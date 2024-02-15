import React from 'react';

import { Form } from 'react-final-form';
import { IntlProvider } from 'react-intl-next';

import { FormContextProvider } from '../../src/controllers/form-context';
import {
  CreateFormFooter,
  CreateFormFooterProps,
} from '../../src/ui/create-form/form-footer/main';

const createExample = (
  props: Partial<CreateFormFooterProps>,
  enableEditView?: () => void,
): React.ComponentType => {
  return function Example() {
    return (
      <IntlProvider locale="en">
        <FormContextProvider enableEditView={enableEditView}>
          <Form<FormData> onSubmit={() => {}}>
            {({}) => {
              return (
                <form onSubmit={() => {}}>
                  <CreateFormFooter
                    formErrorMessage={props.formErrorMessage}
                    handleCancel={() => {}}
                    testId="link-create-form"
                  />
                </form>
              );
            }}
          </Form>
        </FormContextProvider>
      </IntlProvider>
    );
  };
};

export const CreateFormFooterWithErrorMessage = createExample(
  {
    formErrorMessage: 'This is an error message',
  },
  () => {},
);

export const CreateFormFooterWithoutEdit = createExample(
  {
    formErrorMessage: undefined,
  },
  undefined,
);

export const CreateFormFooterDefault = createExample(
  {
    formErrorMessage: undefined,
  },
  () => {},
);
