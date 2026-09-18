import { getPmName } from '../utils';
import SchemaNode from './schema-node';

export default class RefSchemaNode extends SchemaNode {
	constructor(protected name: string) {
		super('object');
	}

	toJSON(): object {
		return { $ref: `#/definitions/${this.name}` };
	}

	toSpec(): string {
		return getPmName(this.name);
	}
}
