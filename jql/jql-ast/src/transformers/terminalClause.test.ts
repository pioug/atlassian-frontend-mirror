import {
  getMockAstNode,
  getStatusEqualsOpenClause,
  getTypeEqualsBugClause,
} from '../../test-utils/ast';
import {
  OPERAND_TYPE_FUNCTION,
  OPERAND_TYPE_KEYWORD,
  OPERAND_TYPE_LIST,
  OPERATOR_EQUALS,
  OPERATOR_IN,
} from '../constants';
import creators from '../creators';
import { type Operand } from '../types';

const getTerminalClauseWithOperand = (operand?: Operand) =>
  creators.terminalClause(
    creators.field('field'),
    creators.operator(OPERATOR_EQUALS),
    operand,
  );

describe('TerminalClause transformer', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const removeClauseMock = jest.fn();
  const replaceClauseMock = jest.fn();
  const mockParent = {
    ...getMockAstNode(),
    removeClause: removeClauseMock,
    replaceClause: replaceClauseMock,
  };

  describe('setOperator', () => {
    it('update value operator and assign parent', () => {
      const terminalClause = getTerminalClauseWithOperand(
        creators.valueOperand('bug'),
      );

      const newOperator = creators.operator(OPERATOR_IN);

      terminalClause.setOperator(newOperator);

      expect(terminalClause.operator).toEqual(newOperator);
      expect(newOperator.parent).toEqual(terminalClause);
    });
  });

  describe('setOperand', () => {
    it('update value operand and assign parent', () => {
      const terminalClause = getTerminalClauseWithOperand(
        creators.valueOperand('bug'),
      );

      const newOperand = creators.valueOperand('issue');

      terminalClause.setOperand(newOperand);

      expect(terminalClause.operand).toEqual(newOperand);
      expect(newOperand.parent).toEqual(terminalClause);
    });
  });

  describe('appendOperand', () => {
    it('add value operand to an empty terminal clause', () => {
      const terminalClause = getTerminalClauseWithOperand();

      const newOperand = creators.valueOperand('issue');

      terminalClause.appendOperand(newOperand);

      expect(terminalClause.operand).toEqual(newOperand);
      expect(newOperand.parent).toEqual(terminalClause);
    });

    it('add value operand to a value operand terminal clause', () => {
      const terminalClause = getTerminalClauseWithOperand(
        creators.valueOperand('bug'),
      );

      const newOperand = creators.valueOperand('issue');

      terminalClause.appendOperand(newOperand);

      expect(terminalClause.operand).toEqual(
        expect.objectContaining({
          operandType: OPERAND_TYPE_LIST,
          values: [
            expect.objectContaining({ value: 'bug' }),
            expect.objectContaining({ value: 'issue' }),
          ],
        }),
      );
    });

    it('add keyword operand to a value operand terminal clause', () => {
      const terminalClause = getTerminalClauseWithOperand(
        creators.valueOperand('bug'),
      );

      const newOperand = creators.keywordOperand();

      terminalClause.appendOperand(newOperand);

      expect(terminalClause.operand).toEqual(
        expect.objectContaining({
          operandType: OPERAND_TYPE_LIST,
          values: [
            expect.objectContaining({ value: 'bug' }),
            expect.objectContaining({
              operandType: OPERAND_TYPE_KEYWORD,
              value: 'empty',
            }),
          ],
        }),
      );
    });

    it('add function operand to a value operand terminal clause', () => {
      const terminalClause = getTerminalClauseWithOperand(
        creators.valueOperand('bug'),
      );

      const newOperand = creators.functionOperand(
        creators.functionString('all'),
        [],
      );

      terminalClause.appendOperand(newOperand);

      expect(terminalClause.operand).toEqual(
        expect.objectContaining({
          operandType: OPERAND_TYPE_LIST,
          values: [
            expect.objectContaining({ value: 'bug' }),
            expect.objectContaining({
              operandType: OPERAND_TYPE_FUNCTION,
              function: expect.objectContaining({
                value: 'all',
              }),
            }),
          ],
        }),
      );
    });

    it('add list operand to a list operand terminal clause', () => {
      const operand = creators.listOperand([
        creators.valueOperand('bug'),
        creators.valueOperand('epic'),
      ]);

      const terminalClause = getTerminalClauseWithOperand(operand);

      const newOperand = creators.valueOperand('issue');

      terminalClause.appendOperand(newOperand);

      expect(terminalClause.operand).toEqual(
        expect.objectContaining({
          operandType: OPERAND_TYPE_LIST,
          values: [
            expect.objectContaining({ value: 'bug' }),
            expect.objectContaining({ value: 'epic' }),
            expect.objectContaining({ value: 'issue' }),
          ],
        }),
      );
    });
  });

  describe('remove', () => {
    it('delegates to parent removeClause', () => {
      const typeEqualsBugClause = getTypeEqualsBugClause();
      typeEqualsBugClause.parent = mockParent;
      typeEqualsBugClause.remove();

      expect(removeClauseMock).toHaveBeenCalledTimes(1);
    });
  });

  describe('replace', () => {
    it('delegates to parent replaceClause', () => {
      const typeEqualsBugClause = getTypeEqualsBugClause();
      const statusEqualsOpenClause = getStatusEqualsOpenClause();
      typeEqualsBugClause.parent = mockParent;
      typeEqualsBugClause.replace(statusEqualsOpenClause);

      expect(replaceClauseMock).toHaveBeenCalledTimes(1);
    });
  });
});
