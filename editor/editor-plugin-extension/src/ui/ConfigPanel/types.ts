import type {
	ExtensionManifest,
	FieldDefinition,
	Parameters,
} from '@atlaskit/editor-common/extensions';
import type { ContextIdentifierProvider } from '@atlaskit/editor-common/provider-factory';
import type { FeatureFlags } from '@atlaskit/editor-common/types';

export enum ValidationError {
	Required = 'required',
	Invalid = 'invalid',
}

export enum FieldTypeError {
	isMultipleAndRadio = 'isMultipleAndRadio',
}

export type Entry<T> = [string, T];
export type OnFieldChange = (name: string, isDirty: boolean) => void;

export interface ValidationErrors {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	[key: string]: any;
}

export interface FieldComponentProps {
	extensionManifest: ExtensionManifest;
	featureFlags?: FeatureFlags;
	field: FieldDefinition;
	firstVisibleFieldName?: string;
	onFieldChange: OnFieldChange;
	parameters: Parameters;
	parentName?: string;
}

export interface FormContentProps {
	canRemoveFields?: boolean;
	contextIdentifierProvider?: ContextIdentifierProvider;
	extensionManifest: ExtensionManifest;
	featureFlags?: FeatureFlags;
	fields: FieldDefinition[];
	firstVisibleFieldName?: string;
	isDisabled?: boolean;
	onClickRemove?: (fieldName: string) => void;
	onFieldChange: OnFieldChange;
	parameters?: Parameters;
	parentName?: string;
}
