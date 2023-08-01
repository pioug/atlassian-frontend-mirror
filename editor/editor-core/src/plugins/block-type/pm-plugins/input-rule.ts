import type { Schema, NodeType } from '@atlaskit/editor-prosemirror/model';
import type { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import {
  createJoinNodesRule,
  createWrappingTextBlockRule,
  ruleWithAnalytics,
} from '../../../utils/input-rules';
import { createRule, createPlugin } from '@atlaskit/prosemirror-input-rules';
import type { FeatureFlags } from '../../../types/feature-flags';

import type { InputRuleWrapper } from '@atlaskit/prosemirror-input-rules';
import { leafNodeReplacementCharacter } from '@atlaskit/prosemirror-input-rules';
import {
  isConvertableToCodeBlock,
  transformToCodeBlockAction,
} from '../commands/transform-to-code-block';
import { insertBlock } from '../commands/insert-block';
import { safeInsert } from '@atlaskit/editor-prosemirror/utils';
import {
  INPUT_METHOD,
  ACTION,
  ACTION_SUBJECT,
  EVENT_TYPE,
  ACTION_SUBJECT_ID,
} from '@atlaskit/editor-common/analytics';

import type { HeadingLevelsAndNormalText } from '@atlaskit/editor-common/types';

const MAX_HEADING_LEVEL = 6;

function getHeadingLevel(match: string[]): {
  level: HeadingLevelsAndNormalText;
} {
  return {
    level: match[1].length as HeadingLevelsAndNormalText,
  };
}

function headingRule(nodeType: NodeType, maxLevel: number) {
  return createWrappingTextBlockRule({
    match: new RegExp('^(#{1,' + maxLevel + '})\\s$'),
    nodeType,
    getAttrs: getHeadingLevel,
  });
}

function blockQuoteRule(nodeType: NodeType) {
  return createJoinNodesRule(/^\s*>\s$/, nodeType) as InputRuleWrapper;
}

/**
 * Get heading rules
 *
 * @param {Schema} schema
 * @returns {InputRuleWithHandler[]}
 */
function getHeadingRules(schema: Schema): InputRuleWrapper[] {
  // '# ' for h1, '## ' for h2 and etc
  const hashRule = headingRule(schema.nodes.heading, MAX_HEADING_LEVEL);

  const leftNodeReplacementHashRule = createRule(
    new RegExp(`${leafNodeReplacementCharacter}(#{1,6})\\s$`),
    (state, match, start, end) => {
      const level = match[1].length;
      return insertBlock(
        state,
        schema.nodes.heading,
        `heading${level}`,
        start,
        end,
        { level },
      );
    },
  );

  // New analytics handler
  const ruleWithHeadingAnalytics = ruleWithAnalytics(
    (_state, matchResult: RegExpExecArray) => ({
      action: ACTION.FORMATTED,
      actionSubject: ACTION_SUBJECT.TEXT,
      eventType: EVENT_TYPE.TRACK,
      actionSubjectId: ACTION_SUBJECT_ID.FORMAT_HEADING,
      attributes: {
        inputMethod: INPUT_METHOD.FORMATTING,
        newHeadingLevel: getHeadingLevel(matchResult).level,
      },
    }),
  );

  return [
    ruleWithHeadingAnalytics(hashRule),
    ruleWithHeadingAnalytics(leftNodeReplacementHashRule),
  ];
}

/**
 * Get all block quote input rules
 *
 * @param {Schema} schema
 * @returns {InputRuleWithHandler[]}
 */
function getBlockQuoteRules(schema: Schema): InputRuleWrapper[] {
  // '> ' for blockquote
  const greatherThanRule = blockQuoteRule(schema.nodes.blockquote);

  const leftNodeReplacementGreatherRule = createRule(
    new RegExp(`${leafNodeReplacementCharacter}\\s*>\\s$`),
    (state, _match, start, end) => {
      return insertBlock(
        state,
        schema.nodes.blockquote,
        'blockquote',
        start,
        end,
      );
    },
  );

  // Analytics V3 handler
  const ruleWithBlockQuoteAnalytics = ruleWithAnalytics({
    action: ACTION.FORMATTED,
    actionSubject: ACTION_SUBJECT.TEXT,
    eventType: EVENT_TYPE.TRACK,
    actionSubjectId: ACTION_SUBJECT_ID.FORMAT_BLOCK_QUOTE,
    attributes: {
      inputMethod: INPUT_METHOD.FORMATTING,
    },
  });

  return [
    ruleWithBlockQuoteAnalytics(greatherThanRule),
    ruleWithBlockQuoteAnalytics(leftNodeReplacementGreatherRule),
  ];
}

/**
 * Get all code block input rules
 *
 * @param {Schema} schema
 * @returns {InputRuleWithHandler[]}
 */
function getCodeBlockRules(schema: Schema): InputRuleWrapper[] {
  const ruleAnalytics = ruleWithAnalytics({
    action: ACTION.INSERTED,
    actionSubject: ACTION_SUBJECT.DOCUMENT,
    actionSubjectId: ACTION_SUBJECT_ID.CODE_BLOCK,
    attributes: { inputMethod: INPUT_METHOD.FORMATTING },
    eventType: EVENT_TYPE.TRACK,
  });

  const validMatchLength = (match: RegExpExecArray) =>
    match.length > 0 && match[0].length === 3;

  const threeTildeRule = createRule(
    /(?!\s)(`{3,})$/,
    (state, match, start, end) => {
      if (!validMatchLength(match)) {
        return null;
      }

      const attributes: any = {};
      if (match[4]) {
        attributes.language = match[4];
      }

      if (isConvertableToCodeBlock(state)) {
        return transformToCodeBlockAction(state, start, attributes);
      }

      const tr = state.tr;
      tr.delete(start, end);
      const codeBlock = tr.doc.type.schema.nodes.codeBlock.createChecked();
      safeInsert(codeBlock)(tr);

      return tr;
    },
  );

  const leftNodeReplacementThreeTildeRule = createRule(
    new RegExp(`((${leafNodeReplacementCharacter}\`{3,})|^\\s(\`{3,}))(\\S*)$`),
    (state, match, start, end) => {
      if (!validMatchLength(match)) {
        return null;
      }

      const attributes: any = {};
      if (match[4]) {
        attributes.language = match[4];
      }
      const inlineStart = Math.max(
        match.index + state.selection.$from.start(),
        1,
      );
      return insertBlock(
        state,
        schema.nodes.codeBlock,
        'codeblock',
        inlineStart,
        end,
        attributes,
      );
    },
  );

  return [
    ruleAnalytics(threeTildeRule),
    ruleAnalytics(leftNodeReplacementThreeTildeRule),
  ];
}

function inputRulePlugin(
  schema: Schema,
  featureFlags: FeatureFlags,
): SafePlugin | undefined {
  const rules: Array<InputRuleWrapper> = [];

  if (schema.nodes.heading) {
    rules.push(...getHeadingRules(schema));
  }

  if (schema.nodes.blockquote) {
    rules.push(...getBlockQuoteRules(schema));
  }

  if (schema.nodes.codeBlock) {
    rules.push(...getCodeBlockRules(schema));
  }

  if (rules.length !== 0) {
    return createPlugin('block-type', rules, {
      isBlockNodeRule: true,
    });
  }

  return;
}

export default inputRulePlugin;
