import { type Node } from '@atlaskit/editor-prosemirror/model';
import { type EditorState, type Transaction } from '@atlaskit/editor-prosemirror/state';
import {
	AbstractJastVisitor,
	type Argument,
	type CompoundClause,
	type FunctionOperand,
	type Jast,
	type ListOperand,
	type NotClause,
	type Query,
	type TerminalClause,
	type ValueOperand,
} from '@atlaskit/jql-ast';
import { fg } from '@atlaskit/platform-feature-flags';

import { JQLEditorSchema } from '../../../schema';
import { type HydratedValuesMap } from '../../../state/types';
import { type HydratedValue } from '../../../ui/jql-editor/types';
import getDocumentPosition from '../../common/get-document-position';
import { getJastFromState } from '../../jql-ast';
import { RICH_INLINE_NODE } from '../constants';

export const replaceRichInlineNodes = (
	editorState: EditorState,
	hydratedValues: HydratedValuesMap,
): Transaction => {
	const ast = getJastFromState(editorState);
	const transaction = editorState.tr;
	// Do not allow users to revert this transaction with undo command so they can't land in an unhydrated state
	transaction.setMeta('addToHistory', false);

	Object.entries(hydratedValues).forEach(([fieldName, values]) => {
		values.forEach((value) => {
			if (value.type === 'user' || (value.type === 'team' && fg('jira_update_jql_teams'))) {
				// First try to find as direct value operand (e.g., Team[Team] = uuid)
				let astNodes: Array<ValueOperand | Argument> = getValueNodes(ast, fieldName, value.id);

				// If not found as direct value and it's a team, try to find in membersOf function arguments
				if (astNodes.length === 0 && value.type === 'team' && fg('jira-membersof-team-support')) {
					astNodes = getMembersOfArgumentNodes(ast, value.id);
				}

				astNodes.forEach((astNode) => {
					if (astNode.position) {
						const [from, to] = astNode.position;
						const documentFrom = getDocumentPosition(transaction.doc, from);
						if (!isRichInlineNode(transaction.doc, documentFrom)) {
							const documentTo = getDocumentPosition(transaction.doc, to);
							const node = getRichInlineNode(fieldName, value, astNode.text);
							transaction.replaceWith(documentFrom, documentTo, node);
						}
					}
				});
			}
		});
	});

	return transaction;
};

const getRichInlineNode = (fieldName: string, value: HydratedValue, text: string) => {
	switch (value.type) {
		case 'user': {
			const textContent = JQLEditorSchema.text(text);
			return JQLEditorSchema.nodes.user.create({ ...value, fieldName }, textContent);
		}
		case 'team': {
			const textContent = JQLEditorSchema.text(text);
			return JQLEditorSchema.nodes.team.create({ ...value, fieldName }, textContent);
		}
		default: {
			throw new Error(`Unsupported hydrated value type ${value.type}`);
		}
	}
};

const isRichInlineNode = (doc: Node, position: number): boolean => {
	return doc.resolve(position).nodeAfter?.type.spec.group === RICH_INLINE_NODE;
};

const getValueNodes = (ast: Jast, field: string, value: string): ValueOperand[] => {
	if (!ast.query) {
		return [];
	}
	return ast.query.accept(new FindValuesVisitor(field, value));
};

const getMembersOfArgumentNodes = (ast: Jast, teamId: string): Argument[] => {
	if (!ast.query) {
		return [];
	}
	return ast.query.accept(new FindMembersOfArgumentsVisitor(teamId));
};

/**
 * Base visitor class for traversing JQL AST to find specific nodes.
 * Provides common traversal logic - subclasses implement specific matching.
 */
abstract class BaseAstNodeFinder<T> extends AbstractJastVisitor<T[]> {
	visitQuery = (query: Query): T[] => {
		if (query.where === undefined) {
			return [];
		}
		return query.where.accept(this);
	};

	visitCompoundClause = (compoundClause: CompoundClause): T[] => {
		return compoundClause.clauses.reduce((results, clause) => {
			return [...results, ...clause.accept(this)];
		}, [] as T[]);
	};

	visitNotClause = (notClause: NotClause): T[] => {
		return notClause.clause.accept(this);
	};

	visitListOperand = (listOperand: ListOperand): T[] => {
		return listOperand.values.reduce((results, operand) => {
			return [...results, ...operand.accept(this)];
		}, [] as T[]);
	};

	protected aggregateResult(aggregate: T[], nextResult: T[]): T[] {
		return [...aggregate, ...nextResult];
	}

	protected defaultResult(): T[] {
		return [];
	}

	protected equalsIgnoreCase(a: string, b: string): boolean {
		return a.localeCompare(b, undefined, { sensitivity: 'base' }) === 0;
	}
}

/**
 * Visitor that finds value operands matching a specific field and value.
 * Used for direct value queries like "assignee = john-doe" or "Team[team] = uuid".
 */
class FindValuesVisitor extends BaseAstNodeFinder<ValueOperand> {
	private readonly field: string;
	private readonly value: string;

	constructor(field: string, value: string) {
		super();
		this.field = field;
		this.value = value;
	}

	visitTerminalClause = (terminalClause: TerminalClause): ValueOperand[] => {
		if (!this.equalsIgnoreCase(terminalClause.field.value, this.field)) {
			return [];
		}
		if (terminalClause.operand === undefined) {
			return [];
		}
		return terminalClause.operand.accept(this);
	};

	visitValueOperand = (valueOperand: ValueOperand): ValueOperand[] => {
		if (!this.equalsIgnoreCase(valueOperand.value, this.value)) {
			return [];
		}
		return [valueOperand];
	};
}

/**
 * Visitor that finds membersOf function arguments matching a specific team ID.
 * Used for queries like "assignee in membersOf("id: <uuid>")".
 */
class FindMembersOfArgumentsVisitor extends BaseAstNodeFinder<Argument> {
	private readonly teamId: string;

	constructor(teamId: string) {
		super();
		this.teamId = teamId;
	}

	visitTerminalClause = (terminalClause: TerminalClause): Argument[] => {
		if (terminalClause.operand === undefined) {
			return [];
		}
		return terminalClause.operand.accept(this);
	};

	visitFunctionOperand = (functionOperand: FunctionOperand): Argument[] => {
		const functionName = functionOperand.function.value.toLowerCase();

		// Only process membersOf function
		if (functionName !== 'membersof') {
			return [];
		}

		const matchingArgs: Argument[] = [];

		functionOperand.arguments.forEach((arg) => {
			// Normalize both values by removing extra whitespace for comparison
			// This handles both "id: uuid" and "id:uuid" formats
			const normalizedArgValue = this.normalizeValue(arg.value);
			const normalizedTeamId = this.normalizeValue(this.teamId);

			if (this.equalsIgnoreCase(normalizedArgValue, normalizedTeamId)) {
				matchingArgs.push(arg);
			}
		});

		return matchingArgs;
	};

	/**
	 * Normalize value by removing extra whitespace around colons and trimming.
	 * This handles variations like "id: uuid" vs "id:uuid" vs "id:  uuid".
	 */
	private normalizeValue(value: string): string {
		return value.replace(/\s*:\s*/g, ':').trim();
	}
}
