import React from 'react';

import { render } from '@testing-library/react';

import { axe } from '@af/accessibility-testing';

import Heading from '../../src/heading';

it('Basic Heading should not fail aXe audit', async () => {
  const { container } = render(
    <Heading level="h900" color="inverse">
      inverse
    </Heading>,
  );
  await axe(container);
});
