import SchemaNode from './schema-node';

export default class ConstSchemaNode extends SchemaNode {
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
