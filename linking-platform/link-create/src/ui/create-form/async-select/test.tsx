import React from 'react';

import { render } from '@testing-library/react';

import { FormContextProvider } from '../../../controllers/form-context';

import { AsyncSelect } from './main';

describe('AsyncSelect', () => {
  it("should find LinkCreate by its testid when it's active", async () => {
    const testId = 'link-create-async-select';

    const { getByTestId } = render(
      <FormContextProvider>
        <AsyncSelect name="select" label="select an option" testId={testId} />
      </FormContextProvider>,
    );

    expect(getByTestId(testId)).toBeTruthy();
  });
});
