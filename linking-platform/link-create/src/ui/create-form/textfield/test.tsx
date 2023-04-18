import React from 'react';

import { render } from '@testing-library/react';

import { FormContextProvider } from '../../../controllers/form-context';

import { TextField } from './main';

describe('AsyncSelect', () => {
  it("should find LinkCreate by its testid when it's active", async () => {
    const testId = 'link-create-title';

    const { getByTestId } = render(
      <FormContextProvider>
        <TextField name="title" label="Title" testId={testId} />
      </FormContextProvider>,
    );

    expect(getByTestId(testId)).toBeTruthy();
  });
});
