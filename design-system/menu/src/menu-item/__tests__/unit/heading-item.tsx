import React from 'react';

import { render } from '@testing-library/react';
import { matchers } from 'jest-emotion';

import { subtleHeading } from '@atlaskit/theme/colors';

import HeadingItem from '../../heading-item';

expect.extend(matchers);

describe('<HeadingItem />', () => {
  it('should set heading text color with light theme value', () => {
    const { getByTestId } = render(
      <HeadingItem testId="heading-item">Heading item</HeadingItem>,
    );

    expect(getByTestId('heading-item')).toHaveStyleRule(
      'color',
      subtleHeading({ theme: { mode: 'light' } }),
    );
  });
});
