export type Option = {
  label: string;
  value: string;
  description?: string;
  /**
   * If a string is passed, we use a image tag to create an icon.
   * If a react component is passed, we render as is.
   * The recommendation is to pass a 16x16 icon if no description is provided, or 24x24 if provided.
   * We can't enforce the size if a React component is passed so it's on the consumer to make the appropriate choice.
   */
  icon?: string | React.ReactNode;
};

import { SmartUserPickerProps } from '@atlaskit/user-picker';

export type UserFieldContext = Pick<
  SmartUserPickerProps,
  | 'siteId'
  | 'principalId'
  | 'fieldId'
  | 'productKey'
  | 'containerId'
  | 'objectId'
  | 'childObjectId'
  | 'productAttributes'
  | 'includeUsers'
>;

interface BaseFieldDefinition {
  description?: string;
  label: string;
  name: string;
  isRequired?: boolean;
  allowDuplicates?: boolean;
  isHidden?: boolean;
}

interface BaseEnumField extends BaseFieldDefinition {
  type: 'enum';
  items: Option[];
}

export interface EnumSingleSelectField extends BaseEnumField {
  style: 'select';
  isMultiple?: false;
  defaultValue?: string;
  placeholder?: string;
}

export interface EnumRadioFieldBase extends BaseEnumField {
  style: 'radio';
  isMultiple?: false;
}

// Radio fields are different, they cannot be deselected by a user
//   Thereby they _always_ need a value for submission
//
// You can do that through `defaultValue`, or `isRequired: true`
export interface EnumRadioFieldDefaulted extends EnumRadioFieldBase {
  isRequired?: false;
  defaultValue: string;
}

export interface EnumRadioFieldRequired extends EnumRadioFieldBase {
  isRequired: true;
  defaultValue?: string;
}

export type EnumRadioField = EnumRadioFieldDefaulted | EnumRadioFieldRequired;

export interface EnumMultipleSelectField extends BaseEnumField {
  style: 'select';
  isMultiple: true;
  defaultValue?: string[];
  placeholder?: string;
}

export interface EnumCheckboxField extends BaseEnumField {
  style: 'checkbox';
  isMultiple: true;
  defaultValue?: string[];
}

export type EnumSelectField = EnumSingleSelectField | EnumMultipleSelectField;
export type EnumField = EnumSelectField | EnumRadioField | EnumCheckboxField;

export interface StringOneLineField extends BaseFieldDefinition {
  type: 'string';
  style?: 'oneline';
  defaultValue?: string;
  placeholder?: string;
}

export interface StringMultilineField extends BaseFieldDefinition {
  type: 'string';
  style: 'multiline';
  defaultValue?: string;
  placeholder?: string;
  options?: {
    minimumRows: number;
  };
}

export type StringField = StringOneLineField | StringMultilineField;

export interface NumberField extends BaseFieldDefinition {
  type: 'number';
  defaultValue?: number;
  placeholder?: string;
}

export interface BooleanField extends BaseFieldDefinition {
  type: 'boolean';
  defaultValue?: boolean;
  style?: 'checkbox' | 'toggle';
}

export interface ColorField extends BaseFieldDefinition {
  type: 'color';
  defaultValue?: string;
}

export interface DateField extends BaseFieldDefinition {
  type: 'date';
  defaultValue?: string;
  placeholder?: string;
}

export interface DateRangeField extends BaseFieldDefinition {
  type: 'date-range';
  defaultValue?: DateRangeResult;
  items: Option[];
}
export interface DateRangeResult {
  type: 'date-range';
  value: 'custom' | any;
  from?: string;
  to?: string;
}

export type FieldHandlerLink = {
  type: string;
};

interface BaseCustomField extends BaseFieldDefinition {
  type: 'custom';
  style?: 'select';
  options: {
    isCreatable?: boolean;
    resolver: FieldHandlerLink;
  };
  placeholder?: string;
}

export interface CustomSingleField extends BaseCustomField {
  isMultiple?: false;
  defaultValue?: string;
}

export interface CustomMultipleField extends BaseCustomField {
  isMultiple: true;
  defaultValue?: string[];
}

export interface UserField extends BaseFieldDefinition {
  type: 'user';
  defaultValue?: string | string[] | null | undefined;
  placeholder?: string;
  isMultiple?: boolean;
  options: {
    provider: FieldHandlerLink;
  };
}

export type CustomField = CustomSingleField | CustomMultipleField;
export type NativeField =
  | EnumField
  | StringField
  | NumberField
  | BooleanField
  | ColorField
  | DateField
  | DateRangeField;

export type NestedFieldDefinition = NativeField | CustomField | UserField;

export interface Fieldset extends BaseFieldDefinition {
  type: 'fieldset';
  fields: NestedFieldDefinition[];
  options: {
    isDynamic?: boolean;
    transformer: FieldHandlerLink;
    showTitle?: boolean;
  };
}

export type FieldDefinition = NestedFieldDefinition | Fieldset | GroupingField;

export const isFieldset = (field: FieldDefinition): field is Fieldset => {
  return field.type === 'fieldset';
};
export const isTabGroup = (field: FieldDefinition): field is TabGroupField => {
  return field.type === 'tab-group';
};
export const isExpand = (field: FieldDefinition): field is ExpandField => {
  return field.type === 'expand';
};

export const isDateRange = (value: any): value is DateRangeResult => {
  return value && value.hasOwnProperty('type') && value.type === 'date-range';
};

export interface GroupedField extends BaseFieldDefinition {
  fields: NestedFieldDefinition[];
}

export interface ExpandField extends GroupedField {
  type: 'expand';
  isExpanded?: boolean;
}

export interface TabGroupField extends Omit<GroupedField, 'fields'> {
  type: 'tab-group';
  // The name of the tab field which should be default
  defaultTab?: string;
  fields: TabField[];
}

export interface TabField extends Omit<GroupedField, 'fields'> {
  type: 'tab';
  // Allow Expands to be under tabs
  fields: (NestedFieldDefinition | ExpandField)[];
}

export type GroupingField = ExpandField | TabGroupField;
