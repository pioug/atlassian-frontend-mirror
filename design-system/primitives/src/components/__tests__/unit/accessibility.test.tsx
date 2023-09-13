import React from 'react';

import { render } from '@testing-library/react';

import { axe } from '@af/accessibility-testing';

import Heading from '../../heading';

describe('Primitives a11y ', () => {
  it('Basic Heading should not fail aXe audit', async () => {
    const { container } = render(
      <Heading level="xxl" color="inverse">
        inverse
      </Heading>,
    );
    await axe(container);
  });
});
