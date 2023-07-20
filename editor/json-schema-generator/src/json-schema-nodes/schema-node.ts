export type PrimitiveType =
  | 'null'
  | 'boolean'
  | 'object'
  | 'array'
  | 'number'
  | 'string';
type Type = PrimitiveType | 'integer';
export type NodeType = Type | Array<Type> | null;

export default abstract class SchemaNode {
  constructor(protected type: NodeType = null) {}

  abstract toJSON(): object;
  abstract toSpec(): object | string;
}
