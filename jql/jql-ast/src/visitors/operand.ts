import {
  JqlArgumentListContext,
  JqlEmptyContext,
  JqlFunctionContext,
  JqlFunctionNameContext,
  JqlListContext,
  JqlOperandContext,
  JqlValueContext,
} from '@atlaskit/jql-parser';

import { OPERAND_EMPTY } from '../constants';
import { internalCreators } from '../creators';
import {
  Argument,
  FunctionOperand,
  FunctionString,
  KeywordOperand,
  ListOperand,
  Operand,
  ValueOperand,
} from '../types';
import { notUndefined } from '../utils';

import { ArgumentVisitor } from './argument';
import {
  getPositionFromContext,
  getPositionFromToken,
  JastBuildingVisitor,
} from './common';
import { NumberVisitor } from './number';
import { StringVisitor } from './string';

export class OperandVisitor extends JastBuildingVisitor<Operand | void> {
  stringVisitor = new StringVisitor(this.tokens);
  numberVisitor = new NumberVisitor(this.tokens);
  functionNameVisitor = new FunctionNameVisitor(this.tokens);
  argumentListVisitor = new ArgumentListVisitor(this.tokens);

  visitJqlOperand = (ctx: JqlOperandContext): Operand | void => {
    const operandContext = [
      ctx.jqlEmpty(),
      ctx.jqlValue(),
      ctx.jqlList(),
      ctx.jqlFunction(),
    ].find(notUndefined);
    return operandContext?.accept(this);
  };

  visitJqlEmpty = (ctx: JqlEmptyContext): KeywordOperand | void => {
    // ANTLR will optimistically create a jqlEmpty node in some situations where user input doesn't match the EMPTY
    // token, e.g. when using value operands in IS clauses ("field is value"), where EMPTY is the only valid operand.
    if (ctx.exception) {
      return undefined;
    }
    return internalCreators.keywordOperand(
      OPERAND_EMPTY,
      getPositionFromToken(ctx.EMPTY().payload),
    );
  };

  visitJqlValue = (ctx: JqlValueContext): ValueOperand | void => {
    const stringContext = ctx.jqlString();
    if (stringContext !== undefined) {
      const stringValue = stringContext.accept(this.stringVisitor);
      return internalCreators.valueOperand(
        stringValue.value,
        stringValue.text,
        stringValue.position,
      );
    }
    const numberContext = ctx.jqlNumber();
    if (numberContext !== undefined) {
      return numberContext.accept(this.numberVisitor);
    }
  };

  visitJqlList = (ctx: JqlListContext): ListOperand => {
    const values = ctx
      .jqlOperand()
      .map(operandCtx => operandCtx.accept(this))
      .filter(notUndefined);
    return internalCreators.listOperand(values, getPositionFromContext(ctx));
  };

  visitJqlFunction = (ctx: JqlFunctionContext): FunctionOperand => {
    const argumentListContext = ctx.jqlArgumentList();
    return internalCreators.functionOperand(
      ctx.jqlFunctionName().accept(this.functionNameVisitor),
      argumentListContext === undefined
        ? []
        : argumentListContext.accept(this.argumentListVisitor),
      getPositionFromContext(ctx),
    );
  };
}

class FunctionNameVisitor extends JastBuildingVisitor<FunctionString> {
  stringVisitor = new StringVisitor(this.tokens);

  visitJqlFunctionName = (ctx: JqlFunctionNameContext): FunctionString => {
    const stringContext = ctx.jqlString();
    if (stringContext !== undefined) {
      const stringValue = stringContext.accept(this.stringVisitor);
      return internalCreators.functionString(
        stringValue.value,
        stringValue.text,
        stringValue.position,
      );
    } else {
      const text = this.tokens.getText(ctx);
      return internalCreators.functionString(
        text,
        text,
        getPositionFromContext(ctx),
      );
    }
  };
}

class ArgumentListVisitor extends JastBuildingVisitor<Argument[]> {
  argumentVisitor = new ArgumentVisitor(this.tokens);

  visitJqlArgumentList = (ctx: JqlArgumentListContext): Argument[] => {
    return ctx
      .jqlArgument()
      .map(argumentCtx => argumentCtx.accept(this.argumentVisitor));
  };
}
