export type Option = {
  label: string;
  value: string;
  description?: string;
};

interface BaseFieldDefinition {
  description?: string;
  label: string;
  name: string;
  isRequired?: boolean;
  isHidden?: boolean;
}

interface BaseEnumField extends BaseFieldDefinition {
  type: 'enum';
  items: Option[];
}

export interface EnumSingleField extends BaseEnumField {
  isMultiple?: false;
  style: 'select' | 'radio';
  defaultValue?: string;
}

export interface EnumMultipleField extends BaseEnumField {
  isMultiple: true;
  style: 'select' | 'checkbox';
  defaultValue?: string[];
}

export type EnumField = EnumSingleField | EnumMultipleField;

export interface StringField extends BaseFieldDefinition {
  type: 'string';
  defaultValue?: string;
}

export interface NumberField extends BaseFieldDefinition {
  type: 'number';
  defaultValue?: string;
}

export interface BooleanField extends BaseFieldDefinition {
  type: 'boolean';
  defaultValue?: boolean;
}

export interface DateField extends BaseFieldDefinition {
  type: 'date';
  defaultValue?: string;
}

export type FieldHandlerLink = {
  type: string;
};

interface BaseCustomField extends BaseFieldDefinition {
  type: 'custom';
  style?: 'select';
  options: {
    resolver: FieldHandlerLink;
  };
}

export interface CustomSingleField extends BaseCustomField {
  isMultiple?: false;
  defaultValue?: string;
}

export interface CustomMultipleField extends BaseCustomField {
  isMultiple: boolean;
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
