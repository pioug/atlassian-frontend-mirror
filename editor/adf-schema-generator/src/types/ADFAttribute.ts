export type ADFAttributes = Record<string, ADFAttribute> | ADFAttributesAnyOf;

export type ADFAttributesAnyOf = { anyOf: Record<string, ADFAttribute>[] };

export type ADFAttribute =
	| ADFAttributeNumber
	| ADFAttributeString
	| ADFAttributeEnum
	| ADFAttributeBoolean
	| ADFAttributeArray
	| ADFAttributeObject;

export type ADFAttributeArray = {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	default?: Array<any> | null;
	items: ADFAttribute;
	max?: number;
	min?: number;
	minItems?: number;
	optional?: boolean;
	type: 'array';
};

export type ADFAttributeNumber = {
	default?: number | null;
	maximum?: number;
	minimum?: number;
	optional?: boolean;
	type: 'number';
};

export type ADFAttributeString = {
	default?: string | null;
	minLength?: number;
	optional?: boolean;
	type: 'string';
	validatorFn?: 'safeUrl';
};

export type ADFAttributeBoolean = {
	default?: boolean | null;
	optional?: boolean;
	type: 'boolean';
};

export type ADFAttributeEnum = {
	default?: string | null;
	optional?: boolean;
	type: 'enum';
	values: Array<string>;
};

export type ADFAttributeObject = {
	additionalProperties?: boolean;
	default?: object | null;
	optional?: boolean;
	properties?: ADFAttributes;
	required?: Array<string>;
	type: 'object';
};
