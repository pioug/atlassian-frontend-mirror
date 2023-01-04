import React from 'react';

import { render } from '@testing-library/react';

import CustomItem, { CustomItemComponentProps } from '../../custom-item';

describe('<CustomItem />', () => {
  it('should pass through extra props to the component', () => {
    const Link = ({
      children,
      ...props
    }: CustomItemComponentProps & { href: string }) => (
      // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props, @repo/internal/react/use-primitives
      <a {...props}>{children}</a>
    );

    const { getByTestId } = render(
      <CustomItem href="/my-details" component={Link} testId="target">
        Hello world
      </CustomItem>,
    );

    expect(getByTestId('target').getAttribute('href')).toEqual('/my-details');
  });
});
