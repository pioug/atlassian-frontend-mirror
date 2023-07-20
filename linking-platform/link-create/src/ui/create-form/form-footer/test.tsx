import React from 'react';

import { render } from '@testing-library/react';
import { IntlProvider } from 'react-intl-next';

import { CreateFormFooter } from './main';

describe('FormFooter', () => {
  it('should find the FormFooter error by its id if formErrorMessage is defined', async () => {
    const testId = 'link-create-form';

    const { getByTestId } = render(
      <IntlProvider locale="en">
        <CreateFormFooter
          formErrorMessage={'errorMessage'}
          handleCancel={() => {}}
          submitting={false}
          testId={testId}
        />
      </IntlProvider>,
    );

    expect(getByTestId(`${testId}-error`)).toBeInTheDocument();
  });

  it('should find the FormFooter buttons by type', async () => {
    const testId = 'link-create-form';

    const { getByTestId } = render(
      <IntlProvider locale="en">
        <CreateFormFooter
          formErrorMessage={undefined}
          handleCancel={() => {}}
          submitting={false}
          testId={testId}
        />
      </IntlProvider>,
    );

    expect(getByTestId(`${testId}-button-cancel`)).toHaveAttribute(
      'type',
      'button',
    );
    expect(getByTestId(`${testId}-button-submit`)).toHaveAttribute(
      'type',
      'submit',
    );
  });
});
