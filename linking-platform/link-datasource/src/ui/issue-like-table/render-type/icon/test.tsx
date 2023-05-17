import React from 'react';

import { render } from '@testing-library/react';

import * as Image from '../../../../../examples-helpers/images.json';

import Icon, { ICON_TYPE_TEST_ID } from './index';

describe('Icon Type', () => {
  const setup = ({ source = Image.trello, ...props }) => {
    return render(<Icon source={source} {...props} />);
  };

  it('renders when the source attr is passed', async () => {
    const { queryByTestId, queryByRole } = setup({});

    const imgContainer = queryByTestId(ICON_TYPE_TEST_ID);
    const img = queryByRole('img');

    expect(imgContainer).toBeInTheDocument();
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', Image.trello);
  });

  it('renders with the alt text when label is passed', async () => {
    const { queryByTestId, queryByRole } = setup({
      label: 'my_image',
    });

    const imgContainer = queryByTestId(ICON_TYPE_TEST_ID);
    const img = queryByRole('img');

    expect(imgContainer).toBeInTheDocument();
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('alt', 'my_image');
  });
});
