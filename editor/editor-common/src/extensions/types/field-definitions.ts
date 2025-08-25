export type Option = {
	description?: string;
	/**
	 * If a string is passed, we use a image tag to create an icon.
	 * If a react component is passed, we render as is.
	 * The recommendation is to pass a 16x16 icon if no description is provided, or 24x24 if provided.
	 * We can't enforce the size if a React component is passed so it's on the consumer to make the appropriate choice.
	 */
	icon?: string | React.ReactNode;
	label: string;
	value: string;
};

import type { Props as SmartUserPickerProps } from '@atlaskit/smart-user-picker';

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
	allowDuplicates?: boolean;
	description?: string;
	isDisabled?: boolean;
	isHidden?: boolean;
	isRequired?: boolean;
	label: string;
	name: string;
}

interface BaseEnumField extends BaseFieldDefinition {
	items: Option[];
	type: 'enum';
}

export interface EnumSingleSelectField extends BaseEnumField {
	defaultValue?: string;
	isMultiple?: false;
	placeholder?: string;
	style: 'select';
}

export interface EnumRadioFieldBase extends BaseEnumField {
	isMultiple?: false;
	style: 'radio';
}

// Radio fields are different, they cannot be deselected by a user
//   Thereby they _always_ need a value for submission
//
// You can do that through `defaultValue`, or `isRequired: true`
export interface EnumRadioFieldDefaulted extends EnumRadioFieldBase {
	defaultValue: string;
	isRequired?: false;
}

export interface EnumRadioFieldRequired extends EnumRadioFieldBase {
	defaultValue?: string;
	isRequired: true;
}

export type EnumRadioField = EnumRadioFieldDefaulted | EnumRadioFieldRequired;

export interface EnumMultipleSelectField extends BaseEnumField {
	defaultValue?: string[];
	isMultiple: true;
	placeholder?: string;
	style: 'select';
}

export interface EnumCheckboxField extends BaseEnumField {
	defaultValue?: string[];
	isMultiple: true;
	style: 'checkbox';
}

export type EnumSelectField = EnumSingleSelectField | EnumMultipleSelectField;
export type EnumField = EnumSelectField | EnumRadioField | EnumCheckboxField;

export interface StringOneLineField extends BaseFieldDefinition {
	defaultValue?: string;
	placeholder?: string;
	style?: 'oneline';
	type: 'string';
}

export interface StringMultilineField extends BaseFieldDefinition {
	defaultValue?: string;
	options?: {
		minimumRows: number;
	};
	placeholder?: string;
	style: 'multiline';
	type: 'string';
}

export type StringField = StringOneLineField | StringMultilineField;

export interface NumberField extends BaseFieldDefinition {
	defaultValue?: number;
	placeholder?: string;
	type: 'number';
}

export interface BooleanField extends BaseFieldDefinition {
	defaultValue?: boolean | string;
	style?: 'checkbox' | 'toggle';
	type: 'boolean';
}

export interface ColorField extends BaseFieldDefinition {
	defaultValue?: string;
	type: 'color';
}

export interface DateField extends BaseFieldDefinition {
	defaultValue?: string;
	placeholder?: string;
	type: 'date';
}

export interface DateRangeField extends BaseFieldDefinition {
	defaultValue?: DateRangeResult;
	items: Option[];
	type: 'date-range';
}
export interface DateRangeResult {
	from?: string;
	to?: string;
	type: 'date-range';
	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	value: 'custom' | any;
}

export type FieldHandlerLink = {
	type: string;
};

interface BaseCustomField extends BaseFieldDefinition {
	options: {
		formatCreateLabel?: (inputValue: string) => React.ReactNode;
		isCreatable?: boolean;
		resolver: FieldHandlerLink;
	};
	placeholder?: string;
	style?: 'select';
	type: 'custom';
}

export interface CustomSingleField extends BaseCustomField {
	defaultValue?: string;
	isMultiple?: false;
}

export interface CustomMultipleField extends BaseCustomField {
	defaultValue?: string[];
	isMultiple: true;
}

export interface UserField extends BaseFieldDefinition {
	defaultValue?: string | string[] | null | undefined;
	isMultiple?: boolean;
	options: {
		provider: FieldHandlerLink;
	};
	placeholder?: string;
	type: 'user';
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
	fields: NestedFieldDefinition[];
	options: {
		isDynamic?: boolean;
		showTitle?: boolean;
		transformer: FieldHandlerLink;
	};
	type: 'fieldset';
}

export type FieldDefinition = NestedFieldDefinition | Fieldset | GroupingField;

export const isFieldset = (field: FieldDefinition): field is Fieldset => {
	return field.type === 'fieldset';
};
export const isTabGroup = (field: FieldDefinition): field is TabGroupField => {
	return field.type === 'tab-group';
};
// Ignored via go/ees005
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const isTabField = (field: any): field is TabField => {
	return 'type' in field && field.type === 'tab';
};
export const isExpand = (field: FieldDefinition): field is ExpandField => {
	return field.type === 'expand';
};

// Ignored via go/ees005
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const isDateRange = (value: any): value is DateRangeResult => {
	return value && value.hasOwnProperty('type') && value.type === 'date-range';
};

export interface GroupedField extends BaseFieldDefinition {
	fields: NestedFieldDefinition[];
	hasGroupedValues?: boolean;
}

export interface ExpandField extends GroupedField {
	isExpanded?: boolean;
	type: 'expand';
}

export interface TabGroupField extends Omit<GroupedField, 'fields'> {
	// The name of the tab field which should be default
	defaultTab?: string;
	fields: TabField[];
	type: 'tab-group';
}

export interface TabField extends Omit<GroupedField, 'fields'> {
	// Allow Expands to be under tabs
	fields: (NestedFieldDefinition | ExpandField)[];
	type: 'tab';
}

export type GroupingField = ExpandField | TabGroupField;
