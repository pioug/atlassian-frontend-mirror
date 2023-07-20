import { snapshot } from '@af/visual-regression';

import {
  DefaultTextField,
  TextFieldWithLabel,
  TextFieldWithMultiProps,
  TextFieldWithValidationHelpText,
  TextFieldWithValue,
  // eslint-disable-next-line @atlassian/tangerine/import/no-parent-imports
} from '../../examples';

type OptionsType = Parameters<typeof snapshot>[1];

const options: OptionsType = {
  variants: [
    {
      name: 'default',
      environment: {},
    },
    {
      name: 'light mode',
      environment: {
        colorScheme: 'light',
      },
    },
    {
      name: 'dark mode',
      environment: {
        colorScheme: 'dark',
      },
    },
  ],
};

snapshot(DefaultTextField, options);
snapshot(TextFieldWithLabel, options);
snapshot(TextFieldWithValidationHelpText, options);
snapshot(TextFieldWithValue, options);
snapshot(TextFieldWithMultiProps, options);
