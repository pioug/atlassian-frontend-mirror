import React from 'react';

import { render } from '@testing-library/react';
import { Form } from 'react-final-form';

import { FormContextProvider } from '../../../controllers/form-context';

import { AsyncSelect, TEST_ID } from './main';

describe('AsyncSelect', () => {
  it("should find LinkCreate by its testid when it's active", async () => {
    const { getByTestId } = render(
      <FormContextProvider>
        <Form onSubmit={() => {}}>
          {() => (
            <form>
              <AsyncSelect
                name="select"
                label="select an option"
                testId={TEST_ID}
              />
            </form>
          )}
        </Form>
      </FormContextProvider>,
    );

    expect(getByTestId(TEST_ID)).toBeTruthy();
  });
});
