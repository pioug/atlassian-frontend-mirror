import type { ADFAttribute } from '../../types/ADFAttribute';

export type ValidatorSpec =
	| ValidatorSpecNode
	| ValidatorSpecNodeExtends
	| ValidatorSpecMark
	| ValidatorSpecGroup;

export type ValidatorSpecGroup = Array<string>;

export type ValidatorSpecNode = {
	props: {
		attrs?: ValidatorSpecAttributes;
		content?: ValidatorSpecContent;
		marks?: ValidatorSpecNodeMarks;

		text?: { minLength: number; type: 'string' };
		type?: { type: 'enum'; values: Array<string> };
		version?: { type: 'enum'; values: Array<number> };
	};
	required?: Array<string>;
};

export type ValidatorSpecContent = {
	allowUnsupportedBlock?: boolean;
	allowUnsupportedInline?: boolean;
	isTupleLike?: boolean;
	items?: Array<string | string[]>;
	maxItems?: number;
	minItems?: number;
	optional?: boolean;
	type: 'array';
};

export type ValidatorSpecNodeMarks = {
	items: Array<string> | Array<Array<string>>;
	maxItems?: number;
	optional?: boolean;
	type: 'array';
};

export type ValidatorSpecNodeExtends = [string, ValidatorSpecNode];

export type ValidatorSpecMark = {
	props: {
		attrs?: ValidatorSpecAttributes;
		type?: { type: 'enum'; values: Array<string> };
	};
	required?: Array<string>;
};

export type ValidatorSpecMap = Record<string, ValidatorSpec>;

export type ValidatorSpecAttributes =
	| ValidatorSpecAttributesGroup
	| Array<ValidatorSpecAttributesGroup>;

export type ValidatorSpecAttributesGroup = {
	optional?: boolean;
	props: Record<string, ADFAttribute>;
};
