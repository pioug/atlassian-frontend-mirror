import React from 'react';

import { render } from '@testing-library/react';
import { IntlProvider } from 'react-intl-next';

import * as Image from '../../../../../examples-helpers/images.json';

import User, { USER_TYPE_TEST_ID } from './index';

describe('User Type', () => {
  const setup = ({ ...props } = {}) => {
    return render(
      <IntlProvider locale="en">
        <User {...props} />
      </IntlProvider>,
    );
  };

  it('renders with display name as Unassigned when no parameters passed', async () => {
    const { queryByTestId } = setup();

    const el = queryByTestId(USER_TYPE_TEST_ID);

    expect(el).toBeInTheDocument();
    expect(el).toHaveTextContent('Unassigned');
  });

  it('renders with the passed in displayName', async () => {
    const { queryByTestId } = setup({
      displayName: 'UNCLE_BOB',
    });

    const el = queryByTestId(USER_TYPE_TEST_ID);

    expect(el).toBeInTheDocument();
    expect(el).toHaveTextContent('UNCLE_BOB');
  });

  it('renders with the passed in avatarSource as img src', async () => {
    const { queryByTestId, queryByRole } = setup({
      displayName: 'UNCLE_BOB',
      avatarSource: Image.trello,
    });

    const userContainer = queryByTestId(USER_TYPE_TEST_ID);
    const img = queryByRole('img');

    expect(userContainer).toBeInTheDocument();
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', Image.trello);
  });
});
