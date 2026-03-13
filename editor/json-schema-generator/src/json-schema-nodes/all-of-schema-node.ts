import type SchemaNode from './schema-node';
import OfSchemaNode from './of-schema-node';

export default class AllOfSchemaNode extends OfSchemaNode {
	constructor(values: Array<SchemaNode> = []) {
		super('allOf', values);
	}

	toSpec(): (string | object)[] {
		return this.values.map((value) => value.toSpec());
	}
}
