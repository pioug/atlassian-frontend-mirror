import React from 'react';

import { render } from '@testing-library/react';

import { axe, toHaveNoViolations } from '@af/accessibility-testing';

import Heading from '../../src/heading';

expect.extend(toHaveNoViolations);

it('Basic Heading should not fail aXe audit', async () => {
  const { container } = render(
    <Heading level="h900" color="inverse">
      inverse
    </Heading>,
  );
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
