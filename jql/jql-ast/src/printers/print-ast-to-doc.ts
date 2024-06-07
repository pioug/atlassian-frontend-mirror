import { CLAUSE_TYPE_COMPOUND } from '../constants';
import { AbstractJastVisitor } from '../jast-visitors';
import {
	type Argument,
	type AstNode,
	type CompoundClause,
	type CompoundOperator,
	type Field,
	type FunctionOperand,
	type FunctionString,
	type Jast,
	type KeywordOperand,
	type ListOperand,
	type NotClause,
	type NotClauseOperator,
	type Operator,
	type OrderBy,
	type OrderByDirection,
	type OrderByField,
	type OrderByOperator,
	type Predicate,
	type PredicateOperator,
	type Property,
	type Query,
	type TerminalClause,
	type ValueOperand,
} from '../types';

import { type Doc } from './types';
import { group, ifBreak, newLine } from './utils';

type OperatorCase = 'lower' | 'upper' | 'preserve';

export type PrintOptions = {
	/**
	 * Whether to uppercase, lowercase, or preserve the case of operators (terminal, compound, predicated and order by operators) in the printed JQL.
	 * lower: make all operators lowercase
	 * upper: make all operators uppercase
	 * preserve: keep the case of the terminal and predicated operators but compound operators will be lowercase
	 *  and order by uppercase (as original)
	 */
	operatorCase?: OperatorCase;
};

const formatOperator = (operator: string, operatorCase: OperatorCase): string => {
	switch (operatorCase) {
		case 'lower':
			return operator.toLowerCase();
		case 'upper':
			return operator.toUpperCase();
		case 'preserve':
			return operator;
	}
};

export class AstToDocVisitor extends AbstractJastVisitor<Doc> {
	private operatorCase: OperatorCase;

	constructor({ operatorCase }: PrintOptions = {}) {
		super();
		this.operatorCase = operatorCase || 'preserve';
	}

	visitArgument(argument: Argument): Doc {
		return argument.text;
	}

	/**
	 * Visit each of the provided nodes and form a new array with each `Doc` joined by the provided separator.
	 */
	joinNodes<T extends AstNode>(nodes: T[], separator?: Doc): Doc[] {
		const docs: Doc[] = [];
		nodes.forEach((node) => {
			if (separator !== undefined && docs.length > 0) {
				docs.push(separator);
			}
			docs.push(node.accept(this));
		});
		return docs;
	}

	visitCompoundClause(compoundClause: CompoundClause): Doc {
		const operatorDoc = compoundClause.operator.accept(this);

		const clauseDocs: Doc[] = [];
		compoundClause.clauses.forEach((clause) => {
			if (clauseDocs.length > 0) {
				clauseDocs.push(ifBreak(newLine(), ' '), operatorDoc, ' ');
			}

			// Wrap nested compound clauses in parentheses
			if (clause.clauseType === CLAUSE_TYPE_COMPOUND) {
				clauseDocs.push('(', clause.accept(this), ')');
			} else {
				clauseDocs.push(clause.accept(this));
			}
		});

		return group(clauseDocs);
	}

	visitCompoundOperator(compoundOperator: CompoundOperator): Doc {
		return formatOperator(compoundOperator.value, this.operatorCase);
	}

	visitField(field: Field): Doc {
		const propertyDocs: Doc[] = field.properties ? this.joinNodes(field.properties) : [];

		return group([field.text, ...propertyDocs]);
	}

	visitFunction(functionString: FunctionString): Doc {
		return functionString.text;
	}

	visitFunctionOperand(functionOperand: FunctionOperand): Doc {
		const argumentDocs = this.joinNodes(functionOperand.arguments, ', ');

		return group([functionOperand.function.accept(this), '(', ...argumentDocs, ')']);
	}

	visitKeywordOperand(keywordOperand: KeywordOperand): Doc {
		return keywordOperand.value;
	}

	visitListOperand(listOperand: ListOperand): Doc {
		const operandDocs = this.joinNodes(listOperand.values, ', ');
		return group(['(', ...operandDocs, ')']);
	}

	visitOperator(operator: Operator): Doc {
		return formatOperator(operator.text, this.operatorCase);
	}

	visitOrderBy(orderBy: OrderBy): Doc {
		const fieldDocs = this.joinNodes(orderBy.fields, ', ');
		return group([orderBy.operator.accept(this), ' ', ...fieldDocs]);
	}

	visitOrderByDirection(orderByDirection: OrderByDirection): Doc {
		return orderByDirection.value;
	}

	visitOrderByField(orderByField: OrderByField): Doc {
		const docs = [orderByField.field.accept(this)];
		if (orderByField.direction) {
			docs.push(' ', orderByField.direction.accept(this));
		}

		return group(docs);
	}

	visitOrderByOperator(orderByOperator: OrderByOperator): Doc {
		return formatOperator(orderByOperator.value, this.operatorCase);
	}

	visitPredicate(predicate: Predicate): Doc {
		const docs = [predicate.operator.accept(this)];
		if (predicate.operand) {
			docs.push(' ', predicate.operand.accept(this));
		}

		return group(docs);
	}

	visitPredicateOperator(predicateOperator: PredicateOperator): Doc {
		return formatOperator(predicateOperator.text, this.operatorCase);
	}

	visitProperty(property: Property): Doc {
		const docs: Doc[] = [];
		if (property.key) {
			docs.push('[', property.key.accept(this), ']');
		}

		if (property.path) {
			const pathDocs = this.joinNodes(property.path, ' ');
			docs.push(...pathDocs);
		}

		return group(docs);
	}

	visitQuery(query: Query): Doc {
		if (query.where && query.orderBy) {
			return group([query.where.accept(this), ifBreak(newLine(), ' '), query.orderBy.accept(this)]);
		} else if (query.where) {
			return query.where.accept(this);
		} else if (query.orderBy) {
			return query.orderBy.accept(this);
		}
		return '';
	}

	visitTerminalClause(terminalClause: TerminalClause): Doc {
		const docs = [terminalClause.field.accept(this)];

		if (terminalClause.operator) {
			docs.push(' ', terminalClause.operator.accept(this));
		}

		if (terminalClause.operand) {
			docs.push(' ', terminalClause.operand.accept(this));
		}

		terminalClause.predicates.forEach((predicate) => {
			docs.push(' ', predicate.accept(this));
		});

		return group(docs);
	}

	visitValueOperand(valueOperand: ValueOperand): Doc {
		return valueOperand.text;
	}

	visitNotClause(notClause: NotClause): Doc {
		const clauseDocs: Doc[] = [];
		// Wrap nested compound clauses in parentheses
		if (notClause.clause.clauseType === CLAUSE_TYPE_COMPOUND) {
			clauseDocs.push('(', notClause.clause.accept(this), ')');
		} else {
			clauseDocs.push(notClause.clause.accept(this));
		}

		return group([notClause.operator.accept(this), ' ', ...clauseDocs]);
	}

	visitNotClauseOperator(notClauseOperator: NotClauseOperator): Doc {
		return notClauseOperator.value;
	}

	visitChildren(): Doc {
		throw new Error('Required visit method not implemented for node');
	}

	protected defaultResult(): Doc {
		return '';
	}
}

export const printAstToDoc = (jast: Jast, options?: PrintOptions) => {
	const astToDocVisitor = new AstToDocVisitor(options);
	return jast.query ? jast.query.accept(astToDocVisitor) : '';
};
