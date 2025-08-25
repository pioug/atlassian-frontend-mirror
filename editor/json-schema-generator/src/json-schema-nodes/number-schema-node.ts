import PrimitiveSchemaNode from './primitive-schema-node';
import type { Indexed } from './schema-node-with-validators';

export interface NumberValidators extends Indexed {
	exclusiveMaximum?: number; // 6.3
	exclusiveMinimum?: number; // 6.5
	maximum?: number; // 6.2
	minimum?: number; // 6.4
}

export default class NumberSchemaNode extends PrimitiveSchemaNode<NumberValidators> {
	constructor(validators: NumberValidators = {}) {
		super('string', validators);
	}
}
