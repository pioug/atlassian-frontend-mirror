// Disable no-re-export rule for entry point files
/* eslint-disable @atlaskit/editor/no-re-export */

import type { ADFEntity, ADFEntityMark } from '../types';

export interface MarkValidationResult {
	errorCode?: ValidationError['code'];
	message?: string;
	newMark?: ADFEntityMark;
	originalMark: ADFEntityMark;
	valid: boolean;
}

export interface Output {
	entity?: ADFEntity;
	valid: boolean;
}

export interface NodeValidationResult {
	entity?: ADFEntity;
	marksValidationOutput?: MarkValidationResult[];
	valid: boolean;
}

export interface ValidatorContent {
	allowUnsupportedBlock: boolean;
	allowUnsupportedInline: boolean;
	isTupleLike?: boolean;
	items: Array<string | Array<string>>;
	maxItems?: number;
	minItems?: number;
	optional?: boolean;
	type: 'array';
}

export type AttributesSpec =
	| { maximum: number; minimum: number; optional?: boolean; type: 'number' }
	| { maximum: number; minimum: number; optional?: boolean; type: 'integer' }
	| { optional?: boolean; type: 'boolean' }
	| {
			minLength?: number;
			optional?: boolean;
			pattern?: RegExp;
			type: 'string';
			validatorFn?: string;
	  }
	| { optional?: boolean; type: 'enum'; values: Array<string> }
	| { optional?: boolean; type: 'object' }
	| {
			isTupleLike?: boolean;
			items: Array<AttributesSpec>;
			maxItems?: number;
			minItems?: number;
			optional?: boolean;
			type: 'array';
	  }
	| ValidatorSpecAttrs;

export interface ValidatorSpecAttrs {
	optional?: boolean;
	props: { [key: string]: AttributesSpec };
}

export interface ValidatorSpec {
	maxItems?: number;
	minItems?: number;
	props?: {
		attrs?: ValidatorSpecAttrs;
		content?: ValidatorContent;
		marks?: {
			items: Array<Array<string>>;
			maxItems?: number;
			optional?: boolean;
			type: 'array';
		};
		text?: AttributesSpec;
		type?: { type: 'enum'; values: Array<string> };
	};
	required?: Array<string>;
}

// NOTE: Don't add huge data inside metadata. Also, don't add `any`.
// We are sending it over analytics, so also be aware of GDPR.
export interface ValidationErrorMap {
	DEPRECATED: never;
	INVALID_ATTRIBUTES: { attrs: Array<string> };
	INVALID_CONTENT: {
		parentType?: string;
	};
	INVALID_CONTENT_LENGTH: {
		length: number;
		requiredLength: number;
		type: RequiredContentLength;
	};
	INVALID_TEXT: never;
	INVALID_TYPE: never;
	MISSING_PROPERTIES: { props: Array<string> };
	REDUNDANT_ATTRIBUTES: { attrs: Array<string> };
	REDUNDANT_MARKS: { marks: Array<string> };
	REDUNDANT_PROPERTIES: { props: Array<string> };
	UNSUPPORTED_ATTRIBUTES: { attrs: Array<string> };
}

export type RequiredContentLength = 'minimum' | 'maximum';

export type Content = Array<string | [string, object] | Array<string>>;

export type ValidationErrorType = keyof ValidationErrorMap;

export interface ValidationError {
	code: ValidationErrorType;
	message: string;
	meta?: object;
}

export type ErrorCallback = (
	entity: ADFEntity,
	error: ValidationError,
	options: ErrorCallbackOptions,
) => ADFEntity | undefined;

// `loose` - ignore and filter extra props or attributes
export type ValidationMode = 'strict' | 'loose';

export interface ValidationOptions {
	// Allow attributes starting with `__` without validation
	allowPrivateAttributes?: boolean;
	mode?: ValidationMode;
}

export interface SpecValidatorResult {
	hasValidated: boolean;
	result?: NodeValidationResult;
}

export type Err = <T extends ValidationErrorType>(
	code: T,
	msg: string,
	meta?: T extends keyof ValidationErrorMap ? ValidationErrorMap[T] : never,
) => NodeValidationResult;

export interface ErrorCallbackOptions {
	allowNestedTables?: boolean;
	allowUnsupportedBlock?: boolean;
	allowUnsupportedInline?: boolean;
	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	isMark?: any;
	isNodeAttribute?: boolean;
}

export type Validate = (
	entity: ADFEntity,
	errorCallback?: ErrorCallback,
	allowed?: Content,
	parentSpec?: ValidatorSpec,
) => Output;
