export type FormResult = {
  [key: string]: string | number | string[] | number[] | undefined;
};

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
