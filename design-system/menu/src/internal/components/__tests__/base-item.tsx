import React from 'react';

import { render } from '@testing-library/react';
import { matchers } from 'jest-emotion';

import { subtleText } from '@atlaskit/theme/colors';

import BaseItem from '../base-item';

expect.extend(matchers);

describe('<BaseItem />', () => {
  it('should set description text color with light theme value', () => {
    const { getByText } = render(
      <BaseItem description="Description">Base item</BaseItem>,
    );

    expect(getByText('Description')).toHaveStyleRule(
      'color',
      subtleText({ theme: { mode: 'light' } }),
    );
  });
});
