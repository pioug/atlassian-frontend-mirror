import { Validator } from '../../../common/types';
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

  testId?: string;
  /** Will display a red astrix next to the field title if true */
  isRequired?: boolean;
  /** Validators for this field */
  validators?: Validator[];
}
