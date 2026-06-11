import {
	AbstractJastVisitor,
	type Clause,
	type CompoundClause,
	type FunctionOperand,
	type ListOperand,
	normaliseJqlString,
	type NotClause,
	type Query,
	type TerminalClause,
	type ValueOperand,
} from '@atlaskit/jql-ast';
import { fg } from '@atlaskit/platform-feature-flags';

/**
 * Normalise a JQL string for use as a hydration map key.
 * Strips quotes/escaping and lowercases to ensure case-insensitive matching
 * between field names from different sources (e.g. AST vs hydration API).
 */
export const normaliseHydrationKey = (key: string): string => normaliseJqlString(key).toLowerCase();

/**
 * Given an AST with parse errors, this visitor returns a valid query that is equivalent for hydration purposes
 * (i.e. just fields, operators and values). Resulting query is generated on a best-effort basis and depends on
 * a successful parser error recovery.
 *
 * Example 1:
 * - Original query: "assignee in (abc-123-def"
 * - Equivalent query: "assignee in (abc-123-def)"
 *
 * Example 2:
 * - Original query: "project = EM and status in (Done, currentUser(), EMPTY) and reporter in"
 * - Equivalent query: "project = EM and status in (Done)"
 */
export class ValidQueryVisitor extends AbstractJastVisitor<string> {
	visitQuery = (query: Query): string => {
		if (!query.where) {
			return '';
		}
		return query.where.accept(this);
	};

	visitCompoundClause = (compoundClause: CompoundClause): string => {
		return compoundClause.clauses
			.map((clause: Clause) => clause.accept(this))
			.filter((value) => !!value)
			.join(' and ');
	};

	visitTerminalClause = (terminalClause: TerminalClause): string => {
		const { field, operator, operand } = terminalClause;
		if (!operator || !operand) {
			return '';
		}
		const operandValue = operand.accept(this);
		if (!operandValue) {
			return '';
		}
		return `${field.text} ${operator.value} ${operandValue}`;
	};

	visitNotClause = (notClause: NotClause): string => {
		return notClause.clause.accept(this);
	};

	visitValueOperand = (valueOperand: ValueOperand): string => {
		return valueOperand.text;
	};

	visitListOperand = (listOperand: ListOperand): string => {
		return `(${listOperand.values
			.map((value) => value.accept(this))
			.filter((value) => !!value)
			.join(', ')})`;
	};

	visitFunctionOperand = (functionOperand: FunctionOperand): string => {
		const functionName = functionOperand.function.value.toLowerCase();
		const args = functionOperand.arguments.map((arg) => arg.text).join(', ');

		// The generic gate supersedes the legacy membersOf-specific gate: when
		// jql-function-arg-hydration is on, any function with arguments is included (covering
		// membersOf and all others). Otherwise fall back to the legacy membersOf-only path.
		const shouldIncludeFunction = fg('jql-function-arg-hydration')
			? functionOperand.arguments.length > 0
			: functionName === 'membersof' && fg('jira-membersof-team-support');

		return shouldIncludeFunction ? `${functionOperand.function.text}(${args})` : '';
	};

	protected defaultResult(): string {
		return '';
	}
}
