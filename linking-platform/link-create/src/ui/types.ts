import { ReactNode } from 'react';

import { Group } from './group-selection/types';

export interface LinkCreatePlugin {
  /**
   * The Group that this plugin entity belongs to
   */
  group: Group;

  /**
   * A label to display for the plugin entity
   */
  label: string;

  /**
   * An icon to display for the plugin entity
   */
  icon: string;

  /**
   * A unique key for the plugin entity
   */
  key: string;

  /**
   * A renderer function to render the form
   */
  form: ReactNode;
}

export interface LinkCreateProps {
  /**
   * A `testId` prop is provided for specified elements, which is a unique
   * string that appears as a data attribute `data-testid` in the rendered code,
   * serving as a hook for automated tests */
  testId?: string;

  plugins: LinkCreatePlugin[];

  /**
   * The initial group key for create. If this is provided, it will jump
   * directly to the entity selection screen
   */
  groupKey?: string;

  /**
   * The initial entity name for create. If this is provided, it will jump
   * directly to the entity creation form.
   * Note: it will be non-optional for now and can move to optional when we have
   * the meta creation flow built.
   */
  entityKey: string;

  /**
   * This callback for when the resource has been successfully created.
   */
  onCreate?: (url: string) => void;

  /**
   * This callback for any errors
   */
  onFailure?: (error: unknown) => void;

  /**
   * This callback for when the form was manually discarded by user
   */
  onCancel?: () => void;

  /**
   * This value controls whether the Create Modal should be active or hidden
   * Default: false
   */
  active?: boolean;
}

export type Validator<FieldName extends string> = {
  /** The field of the form that should be validated (eg. referencing name of TextFieldProps) */
  fieldName: FieldName;
  /** Return true when the given input is invalid */
  isInvalid: (val: string) => Promise<boolean>;
  /** An error message is used to tell a user that the field input is invalid. For example, an error message could be 'Invalid username, needs to be more than 4 characters'. */
  errorMessage: string;
};

export interface TextFieldProps {
  /** Name passed to the <Field>.*/
  name: string;
  /** This should be properly internationalization-ed */
  label: string;
  /**
   * Optional text below the textfield explaining any requirements for a valid value.
   * eg. "Must be 4 or more letters"
   */
  validationHelpText?: string;
}
export interface Option {
  /** html `value` attribute to differentiate options */
  value: string;
  /** This should be properly internationalization-ed */
  label: string;
}

export interface SelectProps {
  name: string;
  /* Title of the select. Displayed in a label above it. */
  title: string;
  /** Placeholder to go in the select */
  placeholder?: string;
  /** Options available in the select */
  options: Option[];
  /** Default select option */
  defaultOption?: Option;
}
export interface FormProps<Fields extends string> {
  /**
   * Each validator will run on form submit. If multiple validators for a given field, the
   * last validator's error will be shown
   */
  validators: Validator<Fields>[];
}
