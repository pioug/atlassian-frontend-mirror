import type { ExtensionManifest } from '@atlaskit/editor-common/extensions';
import type { ContextIdentifierProvider } from '@atlaskit/editor-common/provider-factory';
import {
  FieldDefinition,
  Parameters,
} from '@atlaskit/editor-common/extensions';
import { FeatureFlags } from '@atlaskit/editor-common/types';

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
  [key: string]: any;
}

export interface FieldComponentProps {
  field: FieldDefinition;
  parameters: Parameters;
  parentName?: string;
  extensionManifest: ExtensionManifest;
  firstVisibleFieldName?: string;
  onFieldChange: OnFieldChange;
  featureFlags?: FeatureFlags;
}

export interface FormContentProps {
  fields: FieldDefinition[];
  parentName?: string;
  parameters?: Parameters;
  extensionManifest: ExtensionManifest;
  canRemoveFields?: boolean;
  onClickRemove?: (fieldName: string) => void;
  onFieldChange: OnFieldChange;
  firstVisibleFieldName?: string;
  contextIdentifierProvider?: ContextIdentifierProvider;
  featureFlags?: FeatureFlags;
}
