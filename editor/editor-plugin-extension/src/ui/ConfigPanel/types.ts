import type { ExtensionManifest } from '@atlaskit/editor-common/extensions/extension-manifest';
import type { Parameters } from '@atlaskit/editor-common/extensions/extension-parameters';
import type { FieldDefinition } from '@atlaskit/editor-common/extensions/field-definitions';
import type { ContextIdentifierProvider } from '@atlaskit/editor-common/provider-factory/context-identifier-provider';
import type { FeatureFlags } from '@atlaskit/editor-common/types/feature-flags';

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
