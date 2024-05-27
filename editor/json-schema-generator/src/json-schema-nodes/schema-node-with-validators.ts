import SchemaNode, { type NodeType } from './schema-node';

export interface Indexed {
  [key: string]: number | string | boolean | undefined;
}

export default abstract class SchemaNodeWithValidators<
  T extends Indexed,
> extends SchemaNode {
  constructor(type: NodeType, protected validators: T) {
    super(type);
  }

  mergeValidationInfo(keys: Array<keyof T>, obj: any) {
    keys.forEach((k) => {
      if (this.validators.hasOwnProperty(k)) {
        obj[k] = this.validators[k];
      }
    });
    return obj;
  }

  abstract toJSON(): Object;
  abstract toSpec(): Object;
}
