import { type FieldInputProps } from 'react-final-form';

import { type Validator } from '../../common/types';

type FieldProps = FieldInputProps<any, HTMLElement> & {
  fieldId: string;
  isInvalid: boolean;
};

export type CreateFieldProps = {
  id?: string;
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

  isRequired?: boolean;

  testId: string;

  children: (fieldProps: FieldProps) => React.ReactNode;
};
