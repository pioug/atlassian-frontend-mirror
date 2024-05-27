import { type RuleNode } from 'antlr4ts/tree';

import {
  type JqlChangedOperatorContext,
  type JqlComparisonOperatorContext,
  type JqlEqualsOperatorContext,
  type JqlInOperatorContext,
  type JqlIsOperatorContext,
  type JqlLikeOperatorContext,
  type JqlWasInOperatorContext,
  type JqlWasOperatorContext,
} from '@atlaskit/jql-parser';

import { internalCreators } from '../creators';
import {
  isChangedOperator,
  isComparisonOperator,
  isEqualsOperator,
  isInOperator,
  isIsOperator,
  isLikeOperator,
  isOperator,
  isWasInOperator,
  isWasOperator,
  type Operator,
} from '../types';

import {
  getPositionFromContext,
  getPositionFromToken,
  JastBuildingVisitor,
  normalizeText,
} from './common';

export class OperatorVisitor extends JastBuildingVisitor<Operator | void> {
  visitJqlEqualsOperator(ctx: JqlEqualsOperatorContext) {
    const text = this.tokens.getText(ctx);
    if (!isEqualsOperator(text)) {
      throw new Error(
        `'${text}' does not match any of the recognised equals operators`,
      );
    }
    return internalCreators.operator(text, text, getPositionFromContext(ctx));
  }

  visitJqlLikeOperator(ctx: JqlLikeOperatorContext) {
    const text = this.tokens.getText(ctx);
    if (!isLikeOperator(text)) {
      throw new Error(
        `'${text}' does not match any of the recognised like operators`,
      );
    }
    return internalCreators.operator(text, text, getPositionFromContext(ctx));
  }

  visitJqlComparisonOperator(ctx: JqlComparisonOperatorContext) {
    const text = this.tokens.getText(ctx);
    if (!isComparisonOperator(text)) {
      throw new Error(
        `'${text}' does not match any of the recognised comparison operators`,
      );
    }
    return internalCreators.operator(text, text, getPositionFromContext(ctx));
  }

  visitJqlInOperator(ctx: JqlInOperatorContext) {
    const text = this.tokens.getText(ctx);
    const value = normalizeText(text);
    if (!isInOperator(value)) {
      // This can happen if an incomplete operator is used, e.g. `status not open`.
      return undefined;
    }
    return internalCreators.operator(value, text, getPositionFromContext(ctx));
  }

  visitJqlIsOperator(ctx: JqlIsOperatorContext) {
    const text = this.tokens.getText(ctx);
    const value = normalizeText(text);
    if (!isIsOperator(value)) {
      throw new Error(
        `'${text}' does not match any of the recognised is operators`,
      );
    }
    return internalCreators.operator(value, text, getPositionFromContext(ctx));
  }

  visitJqlWasOperator(ctx: JqlWasOperatorContext) {
    const text = this.tokens.getText(ctx);
    const value = normalizeText(text);
    if (!isWasOperator(value)) {
      throw new Error(
        `'${text}' does not match any of the recognised was operators`,
      );
    }
    return internalCreators.operator(value, text, getPositionFromContext(ctx));
  }

  visitJqlWasInOperator(ctx: JqlWasInOperatorContext) {
    const text = this.tokens.getText(ctx);
    const value = normalizeText(text);
    if (!isWasInOperator(value)) {
      throw new Error(
        `'${text}' does not match any of the recognised was in operators`,
      );
    }
    return internalCreators.operator(value, text, getPositionFromContext(ctx));
  }

  visitJqlChangedOperator(ctx: JqlChangedOperatorContext) {
    const text = this.tokens.getText(ctx);
    const value = normalizeText(text);
    if (!isChangedOperator(value)) {
      throw new Error(
        `'${text}' does not match any of the recognised changed operators`,
      );
    }
    return internalCreators.operator(value, text, getPositionFromContext(ctx));
  }

  // Recover from clause type ambiguities, e.g. "issuetype was " (which can be a WAS or WAS IN clause)
  visitChildren = (node: RuleNode) => {
    const { sourceInterval } = node;
    const text = this.tokens.getText(sourceInterval);
    if (text) {
      const value = normalizeText(text);
      const { a: startIndex, b: stopIndex } = sourceInterval;
      const startToken = this.tokens.get(startIndex);
      const stopToken = this.tokens.get(stopIndex);
      const position = getPositionFromToken(startToken, stopToken);
      if (isOperator(value)) {
        return internalCreators.operator(value, text, position);
      }
    }
  };
}
