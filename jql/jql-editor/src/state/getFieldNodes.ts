import {
	AbstractJastVisitor,
	type CompoundClause,
	type Field,
	type Jast,
	type NotClause,
	type OrderBy,
	type OrderByField,
	type Query,
	type TerminalClause,
} from '@atlaskit/jql-ast';

class FindFieldsVisitor extends AbstractJastVisitor<void> {
	public fields: Set<string> = new Set();

	visitQuery = (query: Query): void => {
		if (query.where !== undefined) {
			query.where.accept(this);
		}
		if (query.orderBy !== undefined) {
			query.orderBy.accept(this);
		}
	};

	visitOrderBy = (orderBy: OrderBy): void => {
		orderBy.fields.map((orderByField) => orderByField.accept(this));
	};

	visitOrderByField = (orderByField: OrderByField): void => {
		orderByField.field.accept(this);
	};

	visitCompoundClause = (compoundClause: CompoundClause): void => {
		compoundClause.clauses.map((clause) => clause.accept(this));
	};

	visitTerminalClause = (terminalClause: TerminalClause): void => {
		terminalClause.field.accept(this);
	};

	visitNotClause = (notClause: NotClause): void => {
		notClause.clause.accept(this);
	};

	visitField = (field: Field): void => {
		this.fields.add(field.value.toLowerCase());
	};

	protected defaultResult(): void {
		return;
	}
}

export const getFieldNodes = (ast: Jast): Set<string> => {
	if (!ast.query) {
		return new Set();
	}

	const visitor = new FindFieldsVisitor();
	ast.query.accept(visitor);

	return visitor.fields;
};
