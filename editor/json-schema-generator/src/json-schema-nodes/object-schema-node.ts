import type SchemaNode from './schema-node';
import SchemaNodeWithValidators, { type Indexed } from './schema-node-with-validators';
import { isObject } from '../utils';

type Properties = {
	[key: string]: {
		required?: boolean;
		value: SchemaNode;
	};
}; // 6.18, 6.17

export interface ObjectValidators extends Indexed {
	additionalProperties?: boolean; // 6.20
}

export default class ObjectSchemaNode extends SchemaNodeWithValidators<ObjectValidators> {
	properties: Properties;

	constructor(properties: Properties = {}, validators: ObjectValidators = {}) {
		super('object', validators);
		this.properties = properties;
	}

	addProperty(name: string, value: SchemaNode, required: boolean = true) {
		this.properties[name] = { value, required };
	}

	toJSON(): object {
		const obj: object = { type: 'object' };
		// Ignored via go/ees005
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		return Object.keys(this.properties).reduce((obj: any, key: string) => {
			const { value, required } = this.properties[key];
			obj.properties = obj.properties || {};
			obj.properties[key] = value.toJSON();
			if (required) {
				obj.required = obj.required || [];
				obj.required.push(key);
			}

			return this.mergeValidationInfo(['additionalProperties'], obj);
		}, obj);
	}

	toSpec() {
		// Ignored via go/ees005
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const spec = Object.keys(this.properties).reduce((obj: any, key: string) => {
			const { value, required } = this.properties[key];
			obj.props = obj.props || {};
			// Ignored via go/ees005
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			const spec: any = (obj.props[key] = value.toSpec());
			if (isObject(spec) && !Array.isArray(spec)) {
				if (!required) {
					spec.optional = true;
				}
			} else {
				if (required) {
					obj.required = obj.required || [];
					obj.required.push(key);
				}
			}
			return obj;
		}, {});

		return spec;
	}
}
