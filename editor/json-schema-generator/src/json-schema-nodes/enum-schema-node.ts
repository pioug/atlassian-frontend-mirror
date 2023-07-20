import SchemaNode from './schema-node';

export type EnumTypes = string | number | boolean;

export default class EnumSchemaNode extends SchemaNode {
  values: Set<EnumTypes>;

  constructor(values: EnumTypes | Array<EnumTypes>) {
    super();
    this.values = new Set(Array.isArray(values) ? values : [values]);
  }

  toJSON(): object {
    return { enum: Array.from(this.values) };
  }

  toSpec() {
    return {
      type: 'enum',
      values: Array.from(this.values),
    };
  }
}
