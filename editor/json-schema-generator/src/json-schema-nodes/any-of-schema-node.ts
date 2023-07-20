import SchemaNode from './schema-node';
import OfSchemaNode from './of-schema-node';

export default class AnyOfSchemaNode extends OfSchemaNode {
  constructor(values: Array<SchemaNode> = []) {
    super('anyOf', values);
  }

  toSpec() {
    return this.values.map((value) => value.toSpec());
  }
}
