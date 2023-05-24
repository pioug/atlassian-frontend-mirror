import React from 'react';

import { render, within } from '@testing-library/react';

import Banner from '../../banner';

describe('banner', () => {
  it('basic sanity check', () => {
    const { getByTestId } = render(<Banner testId="banner-basic" />);
    const banner = getByTestId('banner-basic');

    expect(banner).toBeDefined();
  });

  describe('props', () => {
    it('should render children prop', () => {
      const { getByTestId } = render(
        <Banner testId="banner-text">Testing!</Banner>,
      );
      const { getByText } = within(getByTestId('banner-text'));

      expect(getByText('Testing!')).toBeInTheDocument();
    });
  });
});
