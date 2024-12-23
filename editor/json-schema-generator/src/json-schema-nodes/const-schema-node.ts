import SchemaNode from './schema-node';

export default class ConstSchemaNode extends SchemaNode {
	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	constructor(protected value: any) {
		super();
	}

	toJSON(): object {
		return { const: this.value };
	}

	toSpec() {
		return {};
	}
}
