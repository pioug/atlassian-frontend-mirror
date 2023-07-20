import SchemaNode from './schema-node';
import { getPmName } from '../utils';

export default class RefSchemaNode extends SchemaNode {
  constructor(protected name: string) {
    super('object');
  }

  toJSON(): object {
    return { $ref: `#/definitions/${this.name}` };
  }

  toSpec() {
    return getPmName(this.name);
  }
}
