import React from 'react';

import { render } from '@testing-library/react';

import { axe } from '@af/accessibility-testing';

import Heading from '../../src/heading';

it('Basic Heading should not fail aXe audit', async () => {
  const { container } = render(
    <Heading variant="xxlarge" color="inverse">
      inverse
    </Heading>,
  );
  await axe(container);
});

it('Basic level is correct', async () => {
  const { container } = render(
    <Heading as="div" level="h500" color="inverse">
      inverse
    </Heading>,
  );
  await axe(container);
});

it('Basic varaint is correct', async () => {
  const { container } = render(
    <Heading as="div" variant="xxlarge" color="inverse">
      inverse
    </Heading>,
  );
  await axe(container);
});
