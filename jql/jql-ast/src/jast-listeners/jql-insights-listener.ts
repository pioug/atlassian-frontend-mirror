import { walkAST } from '../api';
import {
	ASSIGNEE_FIELD,
	COLLAPSED_CUSTOM_FIELD_PATTERN_NO_QUOTES,
	COMPOUND_OPERATOR_AND,
	COMPOUND_OPERATOR_OR,
	CREATED_FIELD,
	DUE_DATE_FIELD,
	ISSUE_TYPE_FIELD,
	LAST_VIEWED_FIELD,
	PRIORITY_FIELD,
	PRIVACY_SAFE_FIELDS,
	PROJECT_FIELD,
	REPORTER_FIELD,
	RESOLUTION_DATE_FIELD,
	RESOLUTION_FIELD,
	STATUS_FIELD,
	SUMMARY_FIELD,
	TEAM_CUSTOM_FIELD_TYPE,
	TYPE_FIELD,
	UPDATED_FIELD,
} from '../constants';
import {
	type CompoundClause,
	type Field,
	type FunctionOperand,
	type Jast,
	type JastListener,
	type OrderByField,
	type TerminalClause,
} from '../types';

/**
 * Splits the provided text by new line characters.
 */
export const splitTextByNewLine = (text: string): string[] => text.split(/(?:\r\n?|\n)/);

/**
 * Finds the field type in the collapsed field syntax. eg. "field[xyz]" -> "[xyz]"
 */
export const collapsedFieldType = (text: string): string | undefined => {
	const match = COLLAPSED_CUSTOM_FIELD_PATTERN_NO_QUOTES.exec(text.toLowerCase());

	if (match) {
		return `[${match[1]}]`;
	}

	return undefined;
};

/**
 * Analytics computed for a JQL query.
 */
export type JqlInsightsAttributes = {
	jqlClauseCount: {
		// The number of AND clauses in our AST
		and: number;
		// The number of leaf clauses in our AST (i.e. NON compound clauses)
		leaf: number;
		// The number of NOT clauses in our AST
		not: number;
		// The number of OR clauses in our AST
		or: number;
		// The number of ORDER BY fields in our AST
		orderBy: number;
	};
	// The number of errors encountered when parsing the JQL
	jqlErrorCount: number;
	// Whether a user has used the specified fields below in the WHERE portion of their query
	jqlFieldIsUsed: {
		created: boolean;
		due: boolean;
		lastviewed: boolean;
		resolutionDate: boolean;
		summary: boolean;
		team: boolean;
		updated: boolean;
	};
	// Number of RHS values included in each of the specified fields
	jqlFieldValueCount: {
		assignee: number;
		issueType: number;
		priority: number;
		project: number;
		reporter: number;
		resolution: number;
		status: number;
		team: number;
	};
	// Number of lines used in the query
	jqlLineCount: number;
	// The max number of nested compound clauses in our AST
	jqlMaxCompoundClauseDepth: number;
	// Sorted list of fields used in the query. If a field is not in our list of PRIVACY_SAFE_FIELDS then it will be
	// included as 'other' This will give us an idea of the most common combination of fields used when users query.
	jqlUsedFields: string[];
	// Number of fields used in the WHERE portion of the query
	jqlUsedFieldsCount: number;
	// List of fields used in the order by clause, de-duplicated and in the order of usage.
	jqlUsedFieldsOrderBy: string[];
	// Number of group names used in membersOf function arguments (values NOT starting with "id:")
	membersOfGroupCount: number;
	// Number of team IDs used in membersOf function arguments (values starting with "id:")
	membersOfTeamCount: number;
	// List of team IDs used in membersOf function arguments (not UGC, safe to log)
	membersOfTeamIds: string[];
	// Total number of membersOf function usages (teams + groups combined)
	membersOfTotalCount: number;
};

class JastAnalyticsListener implements JastListener {
	// Default attributes
	public attributes: JqlInsightsAttributes = {
		jqlFieldValueCount: {
			issueType: 0,
			project: 0,
			assignee: 0,
			reporter: 0,
			priority: 0,
			status: 0,
			resolution: 0,
			team: 0,
		},
		jqlFieldIsUsed: {
			summary: false,
			due: false,
			resolutionDate: false,
			created: false,
			lastviewed: false,
			updated: false,
			team: false,
		},
		jqlUsedFields: [],
		jqlUsedFieldsCount: 0,
		jqlUsedFieldsOrderBy: [],
		jqlLineCount: 0,
		jqlErrorCount: 0,
		jqlClauseCount: {
			orderBy: 0,
			leaf: 0,
			and: 0,
			not: 0,
			or: 0,
		},
		jqlMaxCompoundClauseDepth: 0,
		membersOfTotalCount: 0,
		membersOfTeamCount: 0,
		membersOfTeamIds: [],
		membersOfGroupCount: 0,
	};

	private usedFields: Set<string> = new Set();
	private usedFieldsOrderBy: Set<string> = new Set();
	private fieldValueCount = 0;

	// The current number of nested compound clauses for an AST node
	private compoundClauseDepth = 0;

	constructor(jast: Jast) {
		this.attributes.jqlLineCount = splitTextByNewLine(jast.represents).length;
		this.attributes.jqlErrorCount = jast.errors.length;
	}

	private getFieldName = (field: Field) => {
		return collapsedFieldType(field.value) || field.value.toLowerCase();
	};

	private incrementFieldValueCount = () => {
		this.fieldValueCount += 1;
	};

	exitQuery = () => {
		// Track all fields used in the query using the term 'other' for non-privacy safe fields
		const privacySafeFields = new Set<string>();
		this.usedFields.forEach((field) =>
			privacySafeFields.add(PRIVACY_SAFE_FIELDS.includes(field) ? field : 'other'),
		);
		this.attributes.jqlUsedFields = Array.from(privacySafeFields).sort();
		this.attributes.jqlUsedFieldsCount = this.usedFields.size;

		this.attributes.jqlUsedFieldsOrderBy = Array.from(this.usedFieldsOrderBy);
	};

	enterCompoundClause = (compoundClause: CompoundClause) => {
		if (compoundClause.operator.value === COMPOUND_OPERATOR_AND) {
			this.attributes.jqlClauseCount.and += 1;
		} else if (compoundClause.operator.value === COMPOUND_OPERATOR_OR) {
			this.attributes.jqlClauseCount.or += 1;
		}

		this.compoundClauseDepth += 1;
		if (this.compoundClauseDepth > this.attributes.jqlMaxCompoundClauseDepth) {
			this.attributes.jqlMaxCompoundClauseDepth = this.compoundClauseDepth;
		}
	};

	exitCompoundClause = () => {
		this.compoundClauseDepth -= 1;
	};

	enterTerminalClause = (terminalClause: TerminalClause) => {
		const field = this.getFieldName(terminalClause.field);
		switch (field) {
			case SUMMARY_FIELD:
				this.attributes.jqlFieldIsUsed.summary = true;
				break;
			case DUE_DATE_FIELD:
				this.attributes.jqlFieldIsUsed.due = true;
				break;
			case RESOLUTION_DATE_FIELD:
				this.attributes.jqlFieldIsUsed.resolutionDate = true;
				break;
			case CREATED_FIELD:
				this.attributes.jqlFieldIsUsed.created = true;
				break;
			case LAST_VIEWED_FIELD:
				this.attributes.jqlFieldIsUsed.lastviewed = true;
				break;
			case UPDATED_FIELD:
				this.attributes.jqlFieldIsUsed.updated = true;
				break;
			case TEAM_CUSTOM_FIELD_TYPE:
				this.attributes.jqlFieldIsUsed.team = true;
				break;
		}

		this.attributes.jqlClauseCount.leaf += 1;

		// Track all fields used in the query
		this.usedFields.add(field);

		// Reset our count of RHS values for the field
		this.fieldValueCount = 0;
	};

	exitTerminalClause = (terminalClause: TerminalClause) => {
		switch (this.getFieldName(terminalClause.field)) {
			case ISSUE_TYPE_FIELD:
			case TYPE_FIELD:
				this.attributes.jqlFieldValueCount.issueType += this.fieldValueCount;
				break;
			case PROJECT_FIELD:
				this.attributes.jqlFieldValueCount.project += this.fieldValueCount;
				break;
			case ASSIGNEE_FIELD:
				this.attributes.jqlFieldValueCount.assignee += this.fieldValueCount;
				break;
			case REPORTER_FIELD:
				this.attributes.jqlFieldValueCount.reporter += this.fieldValueCount;
				break;
			case PRIORITY_FIELD:
				this.attributes.jqlFieldValueCount.priority += this.fieldValueCount;
				break;
			case STATUS_FIELD:
				this.attributes.jqlFieldValueCount.status += this.fieldValueCount;
				break;
			case RESOLUTION_FIELD:
				this.attributes.jqlFieldValueCount.resolution += this.fieldValueCount;
				break;
			case TEAM_CUSTOM_FIELD_TYPE:
				this.attributes.jqlFieldValueCount.team += this.fieldValueCount;
				break;
			default:
				break;
		}
	};

	enterNotClause = () => {
		this.attributes.jqlClauseCount.not += 1;
	};

	enterFunctionOperand = (functionOperand: FunctionOperand) => {
		this.incrementFieldValueCount();

		// Track membersOf function usage
		const functionName = functionOperand.function.value.toLowerCase();
		if (functionName === 'membersof') {
			// Track each membersOf function call
			this.attributes.membersOfTotalCount += 1;

			functionOperand.arguments.forEach((arg) => {
				const value = arg.value.toLowerCase();
				// Check if it's a teamId (starts with "id:") or a group name
				if (value.startsWith('id:')) {
					// Extract the UUID part after "id:" and normalize whitespace
					const teamId = arg.value.replace(/\s*:\s*/g, ':').trim();
					this.attributes.membersOfTeamIds.push(teamId);
					this.attributes.membersOfTeamCount += 1;
				} else {
					// It's a group name (not starting with "id:")
					this.attributes.membersOfGroupCount += 1;
				}
			});
		}
	};
	enterKeywordOperand = this.incrementFieldValueCount;
	enterValueOperand = this.incrementFieldValueCount;

	enterOrderByField = (orderByField: OrderByField) => {
		this.usedFieldsOrderBy.add(this.getFieldName(orderByField.field));
		this.attributes.jqlClauseCount.orderBy += 1;
	};
}

export const computeJqlInsights = (jast: Jast): JqlInsightsAttributes => {
	const listener = new JastAnalyticsListener(jast);
	walkAST(listener, jast);

	return listener.attributes;
};
