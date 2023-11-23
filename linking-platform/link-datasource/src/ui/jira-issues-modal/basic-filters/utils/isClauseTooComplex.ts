import {
  Clause,
  CLAUSE_TYPE_COMPOUND,
  CLAUSE_TYPE_TERMINAL,
  OPERAND_TYPE_VALUE,
  TerminalClause,
} from '@atlaskit/jql-ast';

import { fuzzyCharacter } from '../../jira-search-container/buildJQL';

export const removeFuzzyCharacter = (value?: string) => {
  if (value?.endsWith(fuzzyCharacter)) {
    return value.slice(0, -1);
  }

  return value;
};

const getValueFromTerminalClause = (clause: TerminalClause) => {
  const { operand } = clause;
  return (
    (operand !== undefined &&
      operand.operandType === OPERAND_TYPE_VALUE &&
      removeFuzzyCharacter(operand.value)) ||
    undefined
  );
};

const areClauseFieldValuesEqual = (
  clauseA: TerminalClause,
  clauseB: TerminalClause,
  clauseC: TerminalClause,
): boolean => {
  const valueA = clauseA && getValueFromTerminalClause(clauseA);
  const valueB = clauseB && getValueFromTerminalClause(clauseB);
  const valueC = clauseC && getValueFromTerminalClause(clauseC);

  const values = [valueA, valueB, valueC].filter(Boolean);

  // checks if valid fields, text, summary and key have the same value, if not, its a complex query and cannnot be recreated in basic mode
  return values.length > 1 && values.every(value => value === values[0]);
};

const areClauseFieldKeysAllowed = (
  clauseA: TerminalClause,
  clauseB: TerminalClause,
  clauseC: TerminalClause,
): boolean => {
  const fieldA = clauseA.field.value;
  const fieldB = clauseB.field.value;
  const fieldC = clauseC?.field.value; // clauseC only if jql with 3 OR clauses, 'text ~ "EDM-6023*" or summary ~ "EDM-6023*" or key = EDM-6023 ORDER BY created DESC',

  return [fieldA, fieldB, fieldC]
    .filter(Boolean)
    .every(field => ['summary', 'text', 'key'].includes(field));
};

const doesCompoundClauseContainAllTerminalClauses = (
  clauses: Clause[],
): clauses is TerminalClause[] => {
  return clauses.every(clauses => clauses.clauseType === CLAUSE_TYPE_TERMINAL);
};

export const isClauseTooComplex = (clauses: Clause[], key: string) => {
  if (key === 'text') {
    const [clause] = clauses;

    if (clause.clauseType === CLAUSE_TYPE_COMPOUND) {
      const textClauses = clause.clauses;

      /**
       * valid: text ~ "test*" or summary ~ "test*" ORDER BY created DESC
       * valid: text ~ "EDM-6023*" or summary ~ "EDM-6023*" or key = EDM-6023 ORDER BY created DESC
       * invalid: assignee = "me" or text ~ "EDM-6023*" or summary ~ "EDM-6023*" or key = EDM-6023 ORDER BY created DESC
       */
      if (textClauses.length !== 2 && textClauses.length !== 3) {
        return true;
      }

      /**
       * valid: text ~ "test*" or summary ~ "test*"
       * invalid: text ~ "test" or (summary ~ "test" or key = "test")
       */
      if (!doesCompoundClauseContainAllTerminalClauses(textClauses)) {
        return true;
      }

      const [clauseA, clauseB, clauseC] = textClauses;

      /**
       * valid: text ~ "EDM-6023*" or summary ~ "EDM-6023*" or key = EDM-6023 ORDER BY created DESC
       * invalid: text ~ "EDM-6023*" or summary ~ "anotherValue" ORDER BY created DESC
       * invalid: text ~ "EDM-6023*" or text ~ "anotherValue" ORDER BY created DESC
       */
      if (!areClauseFieldValuesEqual(clauseA, clauseB, clauseC)) {
        return true;
      }

      /**
       * valid: text ~ "EDM-6023*" ORDER BY created DESC
       * invalid: resolution = 40134 ORDER BY created DESC
       */
      if (!areClauseFieldKeysAllowed(clauseA, clauseB, clauseC)) {
        return true;
      }
    }
  }

  return clauses.length > 1;
};
