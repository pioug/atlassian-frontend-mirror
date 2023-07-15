import React from 'react';

import { render } from '@testing-library/react';

import { axe, toHaveNoViolations } from '@af/accessibility-testing';

import VisuallyHidden from '../../src';

expect.extend(toHaveNoViolations);

it('Basic VisuallyHidden example should not fail aXe audit', async () => {
  const { container } = render(<VisuallyHidden>Testing</VisuallyHidden>);
  const results = await axe(container);

  expect(results).toHaveNoViolations();
});
