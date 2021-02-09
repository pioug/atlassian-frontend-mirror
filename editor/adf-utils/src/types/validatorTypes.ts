import { ADFEntity, ADFEntityMark } from '../types';

export interface MarkValidationResult {
  valid: boolean;
  originalMark: ADFEntityMark;
  newMark?: ADFEntityMark;
  errorCode?: ValidationError['code'];
  message?: string;
}

export interface Output {
  valid: boolean;
  entity?: ADFEntity;
}

export interface NodeValidationResult {
  valid: boolean;
  entity?: ADFEntity;
  marksValidationOutput?: MarkValidationResult[];
}

export interface ValidatorContent {
  type: 'array';
  items: Array<string | Array<string>>;
  minItems?: number;
  maxItems?: number;
  optional?: boolean;
  allowUnsupportedBlock: boolean;
  allowUnsupportedInline: boolean;
  isTupleLike?: boolean;
}

export type AttributesSpec =
  | { type: 'number'; optional?: boolean; minimum: number; maximum: number }
  | { type: 'integer'; optional?: boolean; minimum: number; maximum: number }
  | { type: 'boolean'; optional?: boolean }
  | { type: 'string'; optional?: boolean; minLength?: number; pattern?: RegExp }
  | { type: 'enum'; values: Array<string>; optional?: boolean }
  | { type: 'object'; optional?: boolean }
  | { type: 'array'; items: Array<AttributesSpec>; optional?: boolean };

export interface ValidatorSpec {
  props?: {
    attrs?: { props: { [key: string]: AttributesSpec }; optional?: boolean };
    content?: ValidatorContent;
    text?: AttributesSpec;
    marks?: {
      type: 'array';
      items: Array<Array<string>>;
      maxItems?: number;
      optional?: boolean;
    };
  };
  minItems?: number;
  maxItems?: number;
  required?: Array<string>;
}

// NOTE: Don't add huge data inside metadata. Also, don't add `any`.
// We are sending it over analytics, so also be aware of GDPR.
export interface ValidationErrorMap {
  MISSING_PROPERTIES: { props: Array<string> };
  REDUNDANT_PROPERTIES: { props: Array<string> };
  REDUNDANT_ATTRIBUTES: { attrs: Array<string> };
  REDUNDANT_MARKS: { marks: Array<string> };
  INVALID_TYPE: never;
  INVALID_TEXT: never;
  INVALID_CONTENT: never;
  INVALID_CONTENT_LENGTH: {
    length: number;
    requiredLength: number;
    type: RequiredContentLength;
  };
  INVALID_ATTRIBUTES: { attrs: Array<string> };
  UNSUPPORTED_ATTRIBUTES: { attrs: Array<string> };
  DEPRECATED: never;
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
  mode?: ValidationMode;
  // Allow attributes starting with `__` without validation
  allowPrivateAttributes?: boolean;
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
  isNodeAttribute?: boolean;
  isMark?: any;
  allowUnsupportedBlock?: boolean;
  allowUnsupportedInline?: boolean;
}

export type Validate = (
  entity: ADFEntity,
  errorCallback?: ErrorCallback,
  allowed?: Content,
  parentSpec?: ValidatorSpec,
) => Output;
