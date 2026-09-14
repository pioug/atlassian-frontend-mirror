import {
	AbstractJastVisitor,
	type Clause,
	type CompoundClause,
	type FunctionOperand,
	type ListOperand,
	type NotClause,
	type Query,
	type TerminalClause,
	type ValueOperand,
} from '@atlaskit/jql-ast';
import { expVal } from '@atlaskit/platform-feature-experiments/exp-val';
import { fg } from '@atlaskit/platform-feature-flags/fg';

import { constructFieldWithProperty } from '../../utils/construct-field-with-property/constructFieldWithProperty';
import { isHydratableTeamFunction } from '../../utils/team-jql-functions/isHydratableTeamFunction';

import { normaliseHydrationKey } from './normaliseHydrationKey';

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
const getReconstructedFieldForHydration = (field: TerminalClause['field']): string | null => {
	if (!field.properties?.length) {
		return null;
	}

	const reconstructedField = constructFieldWithProperty(field);

	return normaliseHydrationKey(field.text) !== normaliseHydrationKey(reconstructedField)
		? reconstructedField
		: null;
};

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
		const reconstructedField = expVal('jira_filter_by_agent_and_agent_state', 'isEnabled', false)
			? getReconstructedFieldForHydration(field)
			: null;
		const fieldName = reconstructedField ?? field.text;
		return `${fieldName} ${operator.value} ${operandValue}`;
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

		// The generic gate supersedes the per-function gates: when jql-function-arg-hydration is on,
		// any function with arguments is included (covering membersOf and all others). Otherwise fall
		// back to the legacy path, which only includes the team functions that are individually gated.
		const shouldIncludeFunction = fg('jql-function-arg-hydration')
			? functionOperand.arguments.length > 0
			: isHydratableTeamFunction(functionName);

		return shouldIncludeFunction ? `${functionOperand.function.text}(${args})` : '';
	};

	protected defaultResult(): string {
		return '';
	}
}
