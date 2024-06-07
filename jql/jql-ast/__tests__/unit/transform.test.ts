import {
	COMPOUND_OPERATOR_AND,
	COMPOUND_OPERATOR_OR,
	type CompoundClause,
	creators,
	JastBuilder,
	type JastListener,
	ORDER_BY_DIRECTION_ASC,
	ORDER_BY_DIRECTION_DESC,
	print,
	type Query,
	type TerminalClause,
	walkAST,
} from '../../src';
import {
	getAllFunctionOperand,
	getCompoundAndClause,
	getCompoundOrClause,
	getCreatedRecentlyClause,
	getEmptyKeywordOperand,
	getEpicAndTaskListOperand,
	getInOperator,
	getOrderByAssigneeField,
	getOrderByStatusField,
	getOrderByTypeField,
	getStatusEqualsOpenClause,
	getStoryValueOperand,
	getTypeEqualsBugClause,
} from '../../test-utils/ast';

type TestCase = {
	name: string;
	input: string;
	expected: string;
	transform: ((query: Query) => void) | JastListener;
};
const testCases: TestCase[] = [
	{
		name: 'Append clause to query without where clause',
		input: 'ORDER BY created',
		expected: 'status = open ORDER BY created',
		transform: (query: Query): void => {
			query.appendClause(getStatusEqualsOpenClause(), COMPOUND_OPERATOR_AND);
		},
	},
	{
		name: 'Append clause to query with where clause',
		input: 'assignee is empty ORDER BY created',
		expected: 'assignee is empty and status = open ORDER BY created',
		transform: (query: Query): void => {
			query.appendClause(getStatusEqualsOpenClause(), COMPOUND_OPERATOR_AND);
		},
	},
	{
		name: 'Append clause to query with compound where clause',
		input: 'assignee is empty and issuetype = bug ORDER BY created',
		expected: 'assignee is empty and issuetype = bug and status = open ORDER BY created',
		transform: (query: Query): void => {
			query.appendClause(getStatusEqualsOpenClause(), COMPOUND_OPERATOR_AND);
		},
	},
	{
		name: 'Append compound clause to query with where clause',
		input: 'assignee is empty ORDER BY created',
		expected: 'assignee is empty and issuetype = bug and status = open ORDER BY created',
		transform: (query: Query): void => {
			query.appendClause(getCompoundAndClause(), COMPOUND_OPERATOR_AND);
		},
	},
	{
		name: 'Append clause to query with compound where clause and mismatched operator',
		input: 'assignee is empty or issuetype = bug ORDER BY created',
		expected: '(assignee is empty or issuetype = bug) and status = open ORDER BY created',
		transform: (query: Query): void => {
			query.appendClause(getStatusEqualsOpenClause(), COMPOUND_OPERATOR_AND);
		},
	},
	{
		name: 'Append multiple clauses to query with where clause',
		input: 'assignee is empty ORDER BY created',
		expected:
			'(assignee is empty and status = open and issuetype = bug) or created > -1w ORDER BY created',
		transform: (query: Query): void => {
			query.appendClause(getStatusEqualsOpenClause(), COMPOUND_OPERATOR_AND);
			query.appendClause(getTypeEqualsBugClause(), COMPOUND_OPERATOR_AND);
			query.appendClause(getCreatedRecentlyClause(), COMPOUND_OPERATOR_OR);
		},
	},
	{
		name: 'Prepends order field to query without order by clause',
		input: 'assignee is empty',
		expected: 'assignee is empty ORDER BY issuetype ASC',
		transform: (query: Query): void => {
			query.prependOrderField(getOrderByTypeField());
		},
	},
	{
		name: 'Prepends order field to query with order by clause',
		input: 'assignee is empty ORDER BY created',
		expected: 'assignee is empty ORDER BY issuetype ASC, created',
		transform: (query: Query): void => {
			query.prependOrderField(getOrderByTypeField());
		},
	},
	{
		name: 'Prepends multiple order fields to query with order by clause',
		input: 'assignee is empty ORDER BY created',
		expected: 'assignee is empty ORDER BY assignee, status DESC, issuetype ASC, created',
		transform: (query: Query): void => {
			query.prependOrderField(getOrderByTypeField());
			query.prependOrderField(getOrderByStatusField());
			query.prependOrderField(getOrderByAssigneeField());
		},
	},
	{
		name: 'Set value operand to a field inside a query',
		input: 'issuetype = bug',
		expected: 'issuetype = story',
		transform: {
			enterTerminalClause: (terminalClause: TerminalClause) => {
				terminalClause.setOperand(getStoryValueOperand());
			},
		},
	},
	{
		name: 'Set keyword operand to a field inside a query',
		input: 'issuetype = bug',
		expected: 'issuetype = empty',
		transform: {
			enterTerminalClause: (terminalClause: TerminalClause) => {
				terminalClause.setOperand(getEmptyKeywordOperand());
			},
		},
	},
	{
		name: 'Set function operand to a field inside a query',
		input: 'issuetype = bug',
		expected: 'issuetype = all()',
		transform: {
			enterTerminalClause: (terminalClause: TerminalClause) => {
				terminalClause.setOperand(getAllFunctionOperand());
			},
		},
	},
	{
		name: 'Set value operand to a field inside a query',
		input: 'issuetype = bug',
		expected: 'issuetype = (epic, task)',
		transform: {
			enterTerminalClause: (terminalClause: TerminalClause) => {
				terminalClause.setOperand(getEpicAndTaskListOperand());
			},
		},
	},
	{
		name: 'Append list operand to a field inside a query',
		input: 'issuetype = bug',
		expected: 'issuetype = (bug, story)',
		transform: {
			enterTerminalClause: (terminalClause: TerminalClause) => {
				terminalClause.appendOperand(getStoryValueOperand());
			},
		},
	},
	{
		name: 'Append keyword operand to a field inside a query',
		input: 'issuetype = bug',
		expected: 'issuetype = (bug, empty)',
		transform: {
			enterTerminalClause: (terminalClause: TerminalClause) => {
				terminalClause.appendOperand(getEmptyKeywordOperand());
			},
		},
	},
	{
		name: 'Append function operand to a field inside a query',
		input: 'issuetype = bug',
		expected: 'issuetype = (bug, all())',
		transform: {
			enterTerminalClause: (terminalClause: TerminalClause) => {
				terminalClause.appendOperand(getAllFunctionOperand());
			},
		},
	},
	{
		name: 'Append list operand to a field inside a query',
		input: 'issuetype = bug',
		expected: 'issuetype = (bug, epic, task)',
		transform: {
			enterTerminalClause: (terminalClause: TerminalClause) => {
				terminalClause.appendOperand(getEpicAndTaskListOperand());
			},
		},
	},
	{
		name: 'Set operator to a terminal clause inside a query',
		input: 'issuetype = bug',
		expected: 'issuetype in bug',
		transform: {
			enterTerminalClause: (terminalClause: TerminalClause) => {
				terminalClause.setOperator(getInOperator());
			},
		},
	},
	{
		name: 'Sets the order direction to query with order by clause',
		input: 'assignee is empty ORDER BY created',
		expected: 'assignee is empty ORDER BY created ASC',
		transform: (query: Query): void => {
			query.setOrderDirection(creators.orderByDirection(ORDER_BY_DIRECTION_ASC));
		},
	},
	{
		name: 'Sets the order direction to query with multiple order by fields',
		input: 'assignee is empty ORDER BY created DESC, status, issuetype ASC',
		expected: 'assignee is empty ORDER BY created ASC, status, issuetype ASC',
		transform: (query: Query): void => {
			query.setOrderDirection(creators.orderByDirection(ORDER_BY_DIRECTION_ASC));
		},
	},
	{
		name: 'Sets the order direction to latest value when called multiple times',
		input: 'assignee is empty ORDER BY created',
		expected: 'assignee is empty ORDER BY created DESC',
		transform: (query: Query): void => {
			query.setOrderDirection(creators.orderByDirection(ORDER_BY_DIRECTION_ASC));
			query.setOrderDirection(creators.orderByDirection(ORDER_BY_DIRECTION_DESC));
		},
	},
	{
		name: 'Does not set the order direction to query with no order by clause',
		input: 'assignee is empty',
		expected: 'assignee is empty',
		transform: (query: Query): void => {
			query.setOrderDirection(creators.orderByDirection(ORDER_BY_DIRECTION_ASC));
		},
	},
	{
		name: 'Removes clause from query with more than two clauses',
		input: 'assignee is empty and issuetype = bug and status = open',
		expected: 'issuetype = bug and status = open',
		transform: {
			enterTerminalClause: (terminalClause: TerminalClause) => {
				if (terminalClause.field.value === 'assignee') {
					terminalClause.remove();
				}
			},
		},
	},
	{
		name: 'Removes clause from query with two clauses',
		input: 'assignee is empty and issuetype = bug',
		expected: 'issuetype = bug',
		transform: {
			enterTerminalClause: (terminalClause: TerminalClause) => {
				if (terminalClause.field.value === 'assignee') {
					terminalClause.remove();
				}
			},
		},
	},
	{
		name: 'Removes clause from query with one clauses',
		input: 'assignee is empty',
		expected: '',
		transform: {
			enterTerminalClause: (terminalClause: TerminalClause) => {
				if (terminalClause.field.value === 'assignee') {
					terminalClause.remove();
				}
			},
		},
	},
	{
		name: 'Removes clause from query with nested clauses',
		input: 'NOT (assignee is empty and issuetype = bug or not status = open)',
		expected: 'not (assignee is empty and issuetype = bug)',
		transform: {
			enterTerminalClause: (terminalClause: TerminalClause) => {
				if (terminalClause.field.value === 'status') {
					terminalClause.remove();
				}
			},
		},
	},
	{
		name: 'Removes multiple clauses from query',
		input: 'assignee is empty and issuetype = bug and status = open',
		expected: '',
		transform: {
			enterTerminalClause: (terminalClause: TerminalClause) => {
				terminalClause.remove();
			},
		},
	},
	{
		name: 'Replaces clause in query',
		input: 'assignee is empty and issuetype = bug',
		expected: 'status = open and issuetype = bug',
		transform: {
			enterTerminalClause: (terminalClause: TerminalClause) => {
				if (terminalClause.field.value === 'assignee') {
					const statusEqualsOpenClause = getStatusEqualsOpenClause();
					terminalClause.replace(statusEqualsOpenClause);
				}
			},
		},
	},
	{
		name: 'Replaces clause from query with nested clauses',
		input: 'NOT (assignee is empty and issuetype = bug or not status = open)',
		expected: 'not ((assignee is empty and issuetype = bug) or not created > -1w)',
		transform: {
			enterTerminalClause: (terminalClause: TerminalClause) => {
				if (terminalClause.field.value === 'status') {
					const createdRecentlyClause = getCreatedRecentlyClause();
					terminalClause.replace(createdRecentlyClause);
				}
			},
		},
	},
	{
		name: 'Replaces multiple clauses from query',
		input: 'assignee is empty and issuetype = bug and not reporter = currentUser()',
		expected: 'status = open and status = open and not status = open',
		transform: {
			enterTerminalClause: (terminalClause: TerminalClause) => {
				const statusEqualsOpenClause = getStatusEqualsOpenClause();
				terminalClause.replace(statusEqualsOpenClause);
			},
		},
	},
	{
		name: 'Replaces compound clause with terminal clause',
		input: 'assignee is empty and issuetype = bug and not reporter = currentUser()',
		expected: 'status = open',
		transform: {
			enterCompoundClause: (compoundClause: CompoundClause) => {
				const statusEqualsOpenClause = getStatusEqualsOpenClause();
				compoundClause.replace(statusEqualsOpenClause);
			},
		},
	},
	{
		name: 'Replaces terminal clause with compound clause',
		input: 'status = open and issuetype = bug',
		expected: '(assignee is empty or created > -1w) and issuetype = bug',
		transform: {
			enterTerminalClause: (terminalClause: TerminalClause) => {
				if (terminalClause.field.value === 'status') {
					const orClause = getCompoundOrClause();
					terminalClause.replace(orClause);
				}
			},
		},
	},
];

describe('Transform and print', () => {
	testCases.forEach(({ input, expected, transform, name }) => {
		it(name, () => {
			const jast = new JastBuilder().build(input);
			if (!jast.query) {
				throw new Error('Failed to parse');
			}

			if (typeof transform === 'function') {
				transform(jast.query);
			} else {
				walkAST(transform, jast);
			}

			expect(print(jast)).toEqual(expected);
		});
	});
});
