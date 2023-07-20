import PrimitiveSchemaNode, { Indexed } from './primitive-schema-node';

export interface StringValidators extends Indexed {
  minLength?: number; // 6.6
  maxLength?: number; // 6.7
  pattern?: string; // 6.8
}

export default class StringSchemaNode extends PrimitiveSchemaNode<StringValidators> {
  constructor(validators: StringValidators = {}) {
    super('string', validators);
  }
}
