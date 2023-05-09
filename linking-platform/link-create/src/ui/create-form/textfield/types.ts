import { TextFieldProps as AKTextFieldProps } from '@atlaskit/textfield';

import { Validator } from '../../../common/types';

export type TextFieldProps = Omit<AKTextFieldProps, 'name' | 'isRequired'> & {
  /** Name passed to the <Field>.*/
  name: string;
  label?: string;
  /**
   * Optional text below the textfield explaining any requirements for a valid value.
   * eg. "Must be 4 or more letters"
   */
  validationHelpText?: string;
  /** Validators for this field */
  validators?: Validator[];
};
