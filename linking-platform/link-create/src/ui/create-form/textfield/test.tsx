import React from 'react';

import { render } from '@testing-library/react';
import { Form } from 'react-final-form';

import { FormContextProvider } from '../../../controllers/form-context';

import { TEST_ID, TextField } from './main';

describe('AsyncSelect', () => {
  it("should find LinkCreate by its testid when it's active", async () => {
    const { getByTestId } = render(
      <FormContextProvider>
        <Form onSubmit={() => {}}>
          {() => (
            <form>
              <TextField name="title" label="Title" testId={TEST_ID} />
            </form>
          )}
        </Form>
      </FormContextProvider>,
    );

    expect(getByTestId(TEST_ID)).toBeTruthy();
  });
});
