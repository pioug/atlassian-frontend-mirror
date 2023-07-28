import React from 'react';

import {
  AsyncSelect,
  CreateForm,
  CreateFormProps,
  TextField,
} from '@atlaskit/link-create';

const createTextFieldExample = (
  props: Partial<CreateFormProps<FormData>>,
): React.ComponentType => {
  return function Example() {
    return (
      <div>
        <CreateForm onSubmit={() => {}} {...props}>
          <TextField name={'textfield'} />
        </CreateForm>
      </div>
    );
  };
};
const createAsyncSelectExample = (
  props: Partial<CreateFormProps<FormData>>,
): React.ComponentType => {
  return function Example() {
    return (
      <div>
        <CreateForm onSubmit={() => {}} {...props}>
          <AsyncSelect
            name={'asyncselect'}
            label={'This is an async select component'}
          />
        </CreateForm>
      </div>
    );
  };
};

const createMultiChildrenExample = (
  props: Partial<CreateFormProps<FormData>>,
): React.ComponentType => {
  return function Example() {
    return (
      <div>
        <CreateForm onSubmit={() => {}} {...props}>
          <TextField name={'textfield'} />
          <AsyncSelect
            name={'asyncselect'}
            label={'This is an async select component'}
          />
        </CreateForm>
      </div>
    );
  };
};
export const CreateFormWithTextField = createTextFieldExample({});
export const CreateFormWithAsyncSelect = createAsyncSelectExample({});
export const DefaultCreateForm = createMultiChildrenExample({});
export const CreateFormIsLoading = createMultiChildrenExample({
  isLoading: true,
});
export const CreateFormHideFooter = createMultiChildrenExample({
  hideFooter: true,
});
