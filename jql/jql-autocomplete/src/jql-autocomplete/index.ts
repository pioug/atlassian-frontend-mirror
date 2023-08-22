import { CharStreams, CommonTokenStream, Token } from 'antlr4ts';
import { ParseTree } from 'antlr4ts/tree';

import { JQLLexer, JQLParser } from '@atlaskit/jql-parser';

import { BaseAutocomplete } from '../base-autocomplete';
import {
  RuleSuggestionsWithRuleList,
  Suggestions,
} from '../base-autocomplete/types';
import { Position } from '../common/types';

import { rulesWithContext, unclosedStringTokens } from './constants';
import {
  defaultDelimiterTokens,
  defaultIgnoredTokens,
  defaultPreferredRules,
} from './defaults';
import { RuleContextVisitor } from './rule-context-visitor';
import { JQLRuleContext, JQLRuleSuggestions, JQLSuggestions } from './types';
import { isPredicateOperand } from './util';

export class JQLAutocomplete extends BaseAutocomplete<JQLRuleContext> {
  private readonly tree: ParseTree | undefined;

  /**
   * Compute autocomplete suggestions for the given JQLParser and parse tree. Parse tree is used
   * when determining the context for rule suggestions. When `tree` is undefined (e.g. if parsing
   * failed due to a syntax error) then correct suggestions will still be returned, but contextual
   * information like field/operator will not be included.
   */
  private constructor(
    parser: JQLParser,
    ignoredTokens: Set<number> = defaultIgnoredTokens,
    preferredRules: Set<number> = defaultPreferredRules,
    delimiterTokens: Set<number> = defaultDelimiterTokens,
    tree?: ParseTree,
  ) {
    super(parser, ignoredTokens, preferredRules, delimiterTokens);
    this.tree = tree;
  }

  /**
   * Parse the provided text and return a new {@link JQLAutocomplete} object (**does** include
   * {@link JQLRuleContext} data for rule suggestions).
   *
   * @param text Text to compute suggestions for.
   * @param ignoredTokens Tokens which we do not want to return as suggestions. When not provided, {@link defaultIgnoredTokens} will be used.
   * @param preferredRules Rules we want to return as suggestions. When not provided, {@link defaultPreferredRules} will be used.
   * @param delimiterTokens Tokens to use as delimiters. When not provided, {@link defaultDelimiterTokens} will be used.
   */
  static fromText(
    text: string,
    ignoredTokens?: Set<number>,
    preferredRules?: Set<number>,
    delimiterTokens?: Set<number>,
  ): JQLAutocomplete {
    const charStream = CharStreams.fromString(text);
    const lexer = new JQLLexer(charStream);
    const tokenStream = new CommonTokenStream(lexer);
    const parser = new JQLParser(tokenStream);
    parser.removeErrorListeners();

    return new JQLAutocomplete(
      parser,
      ignoredTokens,
      preferredRules,
      delimiterTokens,
      parser.jqlQuery(),
    );
  }

  /**
   * Return a new {@link JQLAutocomplete} object using the provided parser instance (**does not**
   * include {@link JQLRuleContext} data for rule suggestions).
   *
   * @param parser Parser instance to compute suggestions for.
   * @param ignoredTokens Tokens which we do not want to return as suggestions. When not provided, {@link defaultIgnoredTokens} will be used.
   * @param preferredRules Rules we want to return as suggestions. When not provided, {@link defaultPreferredRules} will be used.
   * @param delimiterTokens Tokens to use as delimiters. When not provided, {@link defaultDelimiterTokens} will be used.
   */
  static fromParser(
    parser: JQLParser,
    ignoredTokens?: Set<number>,
    preferredRules?: Set<number>,
    delimiterTokens?: Set<number>,
  ): JQLAutocomplete {
    return new JQLAutocomplete(
      parser,
      ignoredTokens,
      preferredRules,
      delimiterTokens,
    );
  }

  /**
   * Walk the parse tree and mutate the provided rules object to add context data for relevant rules.
   *
   * @override
   */
  protected assignRuleContextData(
    maybeCaretToken: Token | void,
    rules: RuleSuggestionsWithRuleList<JQLRuleContext>,
  ): RuleSuggestionsWithRuleList<JQLRuleContext> {
    if (this.tree === undefined) {
      return rules;
    }

    rules.forEach(([ruleSuggestion, ruleList], ruleNumber) => {
      if (rulesWithContext.includes(ruleNumber)) {
        const ruleContextVisitor = new RuleContextVisitor(
          ruleSuggestion,
          ruleList,
          ruleNumber,
          this.getTokenStream(),
          maybeCaretToken,
        );
        ruleSuggestion.context = this.tree?.accept(ruleContextVisitor) ?? null;
      }
    });

    return rules;
  }

  getJQLSuggestionsForCaretPosition(
    caretSelectionRange: Position,
  ): JQLSuggestions {
    return this.mapToJQLSuggestions(
      this.getSuggestionsForCaretPosition(caretSelectionRange),
    );
  }

  getJQLSuggestionsForTokenIndex(tokenIndex: number): JQLSuggestions {
    return this.mapToJQLSuggestions(
      this.getSuggestionsForTokenIndex(tokenIndex),
    );
  }

  /**
   * Map the provided rule suggestions keyed by parser rule index into {@link JQLRuleSuggestions}
   * using a consumer-friendly rule name.
   *
   * Here we maintain a fixed subset of JQL parse rules which we return as rule suggestions. We map
   * the parse rule index into a predefined string which consumers should use when interpreting
   * rules.
   *
   * Why do we only support a subset of rules? Because otherwise we'd have 2 options:
   * 1. Return all rules keyed by rule index. This means consumers need to import the JQLParser
   * module to interpret the rule and will become more tightly coupled to ANTLR generated
   * dependencies.
   * 2. Return all rules keyed by the rule display name. This will make implementation more fragile
   * as any change to rule names within our grammar has the potential to break all consumers.
   *
   * By only supporting a subset of rules, we can gradually evolve the list as new use cases emerge
   * and ensure that consumers have a stable API they can build upon.
   *
   * @override
   */
  private mapToJQLSuggestions({
    tokens,
    rules,
  }: Suggestions<JQLRuleContext>): JQLSuggestions {
    const ruleSuggestions: JQLRuleSuggestions = {};

    rules.forEach(([ruleSuggestion, ruleList], key) => {
      switch (key) {
        case JQLParser.RULE_jqlField:
          ruleSuggestions.field = ruleSuggestion;
          break;
        case JQLParser.RULE_jqlCustomField:
          ruleSuggestions.customField = ruleSuggestion;
          break;
        case JQLParser.RULE_jqlEqualsOperator:
        case JQLParser.RULE_jqlLikeOperator:
        case JQLParser.RULE_jqlComparisonOperator:
        case JQLParser.RULE_jqlInOperator:
        case JQLParser.RULE_jqlIsOperator:
        case JQLParser.RULE_jqlWasOperator:
        case JQLParser.RULE_jqlWasInOperator:
        case JQLParser.RULE_jqlChangedOperator:
          ruleSuggestions.operator = ruleSuggestion;
          break;
        case JQLParser.RULE_jqlValue:
          // Disable autocomplete for predicate operands.
          // To be removed when we build proper autocomplete support.
          if (!isPredicateOperand(ruleList)) {
            ruleSuggestions.value = ruleSuggestion;
          }
          break;
        case JQLParser.RULE_jqlListStart:
          // Disable autocomplete for predicate operands.
          // To be removed when we build proper autocomplete support.
          if (!isPredicateOperand(ruleList)) {
            ruleSuggestions.list = ruleSuggestion;
          }
          break;
        case JQLParser.RULE_jqlFunction:
          // Disable autocomplete for predicate operands.
          // To be removed when we build proper autocomplete support.
          if (!isPredicateOperand(ruleList)) {
            ruleSuggestions.function = ruleSuggestion;
          }
          break;
        case JQLParser.RULE_jqlFieldProperty:
          ruleSuggestions.fieldProperty = ruleSuggestion;
          break;
        case JQLParser.RULE_jqlArgument:
          for (let i = ruleList.length - 1; i >= 0; i--) {
            // The argument rule is shared between functions and field properties. We inspect the
            // rule list to determine which rule our suggestion is scoped to.
            if (ruleList[i] === JQLParser.RULE_jqlFunction) {
              ruleSuggestions.functionArgument = ruleSuggestion;
              break;
            }
            if (ruleList[i] === JQLParser.RULE_jqlPropertyArgument) {
              ruleSuggestions.fieldPropertyArgument = ruleSuggestion;
              break;
            }
            if (ruleList[i] === JQLParser.RULE_jqlFieldProperty) {
              ruleSuggestions.fieldPropertyId = ruleSuggestion;
              break;
            }
          }
          break;
        default:
      }
    });

    return {
      tokens,
      rules: ruleSuggestions,
    };
  }

  private isCaretAtUnclosedString(caretToken: Token) {
    return unclosedStringTokens.includes(caretToken.type);
  }

  /**
   *  This method is being overridden for a specific scenario where we encounter string inside an unclosed single quote or double quote.
   *  If this method returns null then the Position calculation will be further processed by getReplacePosition in the base-autocomplete/
   *
   *  @override
   *
   */
  protected overrideReplacePosition(
    replaceStartToken: Token | void,
    maybeCaretToken: Token | void,
    caretSelectionRange: Position,
  ): Position | null {
    if (maybeCaretToken && this.isCaretAtUnclosedString(maybeCaretToken)) {
      const [start, stop] = caretSelectionRange;

      // If the replaceStartToken is not defined (i.e. cursor at beginning of string) or the caret is
      // positioned at a delimiter/hidden token then we want to append at selection start.
      // Otherwise we want our replacement to start from the beginning of specified token.
      const startPosition =
        replaceStartToken === undefined ||
        this.isCaretAtDelimiterOrHiddenToken(replaceStartToken)
          ? start
          : Math.min(replaceStartToken.startIndex, start);

      return [startPosition, stop];
    }

    return null;
  }
}
