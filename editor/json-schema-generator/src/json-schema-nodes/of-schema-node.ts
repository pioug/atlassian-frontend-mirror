import SchemaNode from './schema-node';

type OfType = 'anyOf' | 'allOf' | 'oneOf';

export default class OfSchemaNode extends SchemaNode {
  constructor(
    protected ofType: OfType,
    protected values: Array<SchemaNode> = [],
  ) {
    super();
  }

  toJSON(): object {
    return { [this.ofType]: this.values.map((item) => item.toJSON()) };
  }

  toSpec() {
    return this.values.map((item) => item.toSpec());
  }
}
