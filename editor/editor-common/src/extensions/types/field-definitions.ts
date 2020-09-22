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

interface BaseFieldDefinition {
  description?: string;
  label: string;
  name: string;
  isRequired?: boolean;
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
  isHidden?: boolean;
}

export interface StringMultilineField extends BaseFieldDefinition {
  type: 'string';
  style: 'multiline';
  defaultValue?: string;
  placeholder?: string;
  isHidden?: boolean;
  options?: {
    minimumRows: number;
  };
}

export type StringField = StringOneLineField | StringMultilineField;

export interface NumberField extends BaseFieldDefinition {
  type: 'number';
  defaultValue?: string;
  placeholder?: string;
}

export interface BooleanField extends BaseFieldDefinition {
  type: 'boolean';
  defaultValue?: boolean;
  style?: 'checkbox' | 'toggle';
}

export interface DateField extends BaseFieldDefinition {
  type: 'date';
  defaultValue?: string;
  placeholder?: string;
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

export interface Fieldset extends BaseFieldDefinition {
  type: 'fieldset';
  fields: FieldDefinition[];
  options: {
    isDynamic?: boolean;
    transformer: FieldHandlerLink;
  };
}

export type NativeField =
  | EnumField
  | StringField
  | NumberField
  | BooleanField
  | DateField;

export type CustomField = CustomSingleField | CustomMultipleField;

export type FieldDefinition = NativeField | CustomField | Fieldset;

export const isFieldset = (field: FieldDefinition): field is Fieldset => {
  return field.type === 'fieldset';
};
