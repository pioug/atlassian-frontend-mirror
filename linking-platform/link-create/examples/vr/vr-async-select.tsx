import React from 'react';

import { Form } from 'react-final-form';

import { AsyncSelect } from '@atlaskit/link-create';

import { FormContextProvider } from '../../src/controllers/form-context';
import { AsyncSelectProps } from '../../src/ui/create-form/async-select/types';

const createExample = (
  props: Partial<AsyncSelectProps> = {},
): React.ComponentType => {
  return function Example() {
    return (
      <FormContextProvider>
        <Form onSubmit={() => {}}>
          {() => (
            <form>
              <AsyncSelect
                name={'exampleAsyncSelectProps'}
                label={'Async Select'}
                {...props}
              />
            </form>
          )}
        </Form>
      </FormContextProvider>
    );
  };
};

export const DefaultAsyncSelect = createExample();
export const AsyncSelectorAllProps = createExample({
  validationHelpText: 'this is a validation help text',
  isRequired: true,
});
