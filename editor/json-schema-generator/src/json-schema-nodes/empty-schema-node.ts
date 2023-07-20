import SchemaNode from './schema-node';

export default class EmptySchemaNode extends SchemaNode {
  toJSON(): object {
    return {};
  }

  toSpec() {
    return { type: 'object' };
  }
}
