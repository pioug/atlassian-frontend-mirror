import {
  AsyncSelectProps as AKAsyncSelectProps,
  GroupType,
  OptionType,
} from '@atlaskit/select';

import { Validator } from '../../../common/types';

export type AsyncSelectProps<T = OptionType> = Omit<
  AKAsyncSelectProps<T>,
  'loadOptions'
> & {
  /** Name passed to the <Field> */
  name: string;
  /** This should be properly internationalization-ed */
  label: string;
  /**
   * Optional text below the field explaining any requirements for a valid value.
   * eg. "Must be 4 or more letters"
   */
  validationHelpText?: string;

  testId?: string;
  /** Will display a red astrix next to the field title if true */
  isRequired?: boolean;
  /** Validators for this field */
  validators?: Validator[];
  /**
   * Function to options to display in async select.
   * **WARNING** Will refetch if function changes.
   */
  loadOptions?: (inputValue: string) => Promise<T[] | GroupType<T>[]>;
};
