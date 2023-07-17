import React from 'react';

import { render } from '@testing-library/react';

import { FormContextProvider } from '../../../controllers/form-context';

import { AsyncSelect, TEST_ID } from './main';

describe('AsyncSelect', () => {
  it("should find LinkCreate by its testid when it's active", async () => {
    const { getByTestId } = render(
      <FormContextProvider>
        <AsyncSelect name="select" label="select an option" testId={TEST_ID} />
      </FormContextProvider>,
    );

    expect(getByTestId(TEST_ID)).toBeTruthy();
  });
});
