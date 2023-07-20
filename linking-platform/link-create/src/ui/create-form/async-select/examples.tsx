import React from 'react';

import { AsyncSelect } from '@atlaskit/link-create';

import { AsyncSelectProps } from './types';

const createExample = (
  props: Partial<AsyncSelectProps> = {},
): React.ComponentType => {
  return function Example() {
    return (
      <div>
        <AsyncSelect
          name={'exampleAsyncSelectProps'}
          label={'Async Select'}
          {...props}
        />
      </div>
    );
  };
};

export const DefaultAsyncSelect = createExample();
export const AsyncSelectValidationHelpText = createExample({
  validationHelpText: 'this is a validation help text',
});

export const AsyncSelectIsRequired = createExample({
  isRequired: true,
});
export const AsyncSelectorAllProps = createExample({
  validationHelpText: 'this is a validation help text',
  isRequired: true,
});
