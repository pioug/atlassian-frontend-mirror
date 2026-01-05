import type SchemaNode from './schema-node';
import SchemaNodeWithValidators, { type Indexed } from './schema-node-with-validators';

export interface ArrayValidators extends Indexed {
	maxItems?: number; // 6.11
	minItems?: number; // 6.12
}

export default class ArraySchemaNode extends SchemaNodeWithValidators<ArrayValidators> {
	_isTupleLike = false;
	items: Array<SchemaNode>; // 6.9 -> SchemaNode | Array<SchemaNode>;

	constructor(items: SchemaNode | Array<SchemaNode> = [], validators: ArrayValidators = {}) {
		super('array', validators);
		this.items = Array.isArray(items) ? items : [items];
	}

	push(items: SchemaNode | Array<SchemaNode> | undefined): void {
		if (items) {
			this.items = this.items.concat(items);
		}
	}

	toJSON(): object {
		const items = this.items.map((item) => item.toJSON());
		// Ignored via go/ees005
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const obj: any = { type: 'array' };

		if (items.length) {
			obj.items = items.length === 1 ? items[0] : items;
		}

		return this.mergeValidationInfo(['minItems', 'maxItems'], obj);
	}

	toSpec() {
		const items = this.items.map((item) => item.toSpec());
		// Ignored via go/ees005
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const obj: any = { type: 'array', items };

		if (this._isTupleLike) {
			obj['isTupleLike'] = true;
		}

		return this.mergeValidationInfo(
			[
				'minItems',
				'maxItems',
				'allowUnsupportedBlock',
				'allowUnsupportedInline',
				'forceContentValidation',
			],
			obj,
		);
	}
}
