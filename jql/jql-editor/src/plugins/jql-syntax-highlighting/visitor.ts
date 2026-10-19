import { type EditorState } from '@atlaskit/editor-prosemirror/state';
import { AbstractJastVisitor } from '@atlaskit/jql-ast/abstract-jast-visitor';
import type { NotClauseOperator } from '@atlaskit/jql-ast/ast/clause';
import { isOperandNode } from '@atlaskit/jql-ast/ast/operand';
import type { Operator } from '@atlaskit/jql-ast/ast/operator';
import type { OrderByDirection, OrderByOperator } from '@atlaskit/jql-ast/ast/order-by';
import type { PredicateOperator } from '@atlaskit/jql-ast/ast/predicate';
import type { AstNode, Position } from '@atlaskit/jql-ast/common';
import type { CompoundOperator } from '@atlaskit/jql-ast/compound-operator';
import type { Field } from '@atlaskit/jql-ast/field';

import getDocumentPosition from '../common/get-document-position';
import { type Highlight } from './types';

export class SyntaxHighlightingVisitor extends AbstractJastVisitor<Highlight[]> {
	state: EditorState;

	constructor(state: EditorState) {
		super();
		this.state = state;
	}

	visitCompoundOperator = (compoundOperator: CompoundOperator): Highlight[] => {
		return compoundOperator.positions.map((position) => this.createHighlight('keyword', position));
	};

	visitNotClauseOperator = (notClauseOperator: NotClauseOperator): Highlight[] => {
		return this.getHighlightsIfPosition('keyword', notClauseOperator.position);
	};

	visitOrderByOperator = (orderByOperator: OrderByOperator): Highlight[] => {
		return this.getHighlightsIfPosition('keyword', orderByOperator.position);
	};

	visitOrderByDirection = (orderByDirection: OrderByDirection): Highlight[] => {
		return this.getHighlightsIfPosition('keyword', orderByDirection.position);
	};

	visitField = (field: Field): Highlight[] => {
		return this.getHighlightsIfPosition('field', field.position);
	};

	visitOperator = (operator: Operator): Highlight[] => {
		return this.getHighlightsIfPosition('operator', operator.position);
	};

	visitPredicateOperator = (predicateOperator: PredicateOperator): Highlight[] => {
		return this.getHighlightsIfPosition('operator', predicateOperator.position);
	};

	protected shouldVisitNextChild(node: AstNode): boolean {
		// Skip visiting operand subtrees, which don't require syntax highlighting and can make a big impact on performance
		return !isOperandNode(node);
	}

	protected aggregateResult(aggregate: Highlight[], nextResult: Highlight[]): Highlight[] {
		return aggregate.concat(nextResult);
	}

	protected defaultResult(): never[] {
		return [];
	}

	private getHighlightsIfPosition = (
		tokenType: string,
		maybePosition: Position | null,
	): Highlight[] => {
		if (!maybePosition) {
			return [];
		}

		return [this.createHighlight(tokenType, maybePosition)];
	};

	private createHighlight = (tokenType: string, [start, end]: Position): Highlight => {
		const documentFrom = getDocumentPosition(this.state.doc, start);
		const documentTo = getDocumentPosition(this.state.doc, end);
		return { tokenType, documentFrom, documentTo };
	};
}
