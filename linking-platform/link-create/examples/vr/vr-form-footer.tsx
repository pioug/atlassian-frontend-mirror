import React from 'react';

import {
  CreateFormFooter,
  CreateFormFooterProps,
} from '../../src/ui/create-form/form-footer/main';

const createExample = (
  props: Partial<CreateFormFooterProps>,
): React.ComponentType => {
  return function Example() {
    return (
      <CreateFormFooter
        formErrorMessage={props.formErrorMessage}
        handleCancel={() => {}}
        submitting={props.submitting || false}
        testId="link-create-form"
      />
    );
  };
};

export const CreateFormFooterWithErrorMessage = createExample({
  formErrorMessage: 'This is an error message',
  submitting: false,
});

export const CreateFormFooterSubmitting = createExample({
  formErrorMessage: undefined,
  submitting: true,
});

export const CreateFormFooterSubmittingWithErrorMessage = createExample({
  formErrorMessage: 'This is an error message',
  submitting: true,
});
