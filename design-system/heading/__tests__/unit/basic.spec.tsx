import React from 'react';

import { render } from '@testing-library/react';

import Heading from '../../src';

describe('Heading', () => {
  it('renders', () => {
    const { getByTestId } = render(
      <Heading level="h100" testId="test">
        Hello
      </Heading>,
    );

    expect(getByTestId('test')).toBeDefined();
  });
});
