import React from 'react';

import { render } from '@testing-library/react';

import { axe, toHaveNoViolations } from '@af/accessibility-testing';

import ProgressIndicator from '../../progress-dots';

expect.extend(toHaveNoViolations);

it('Basic ProgressIndicator should not fail aXe audit', async () => {
  const { container } = render(
    <ProgressIndicator
      selectedIndex={0}
      values={['one', 'two', 'three']}
      size="default"
    />,
  );
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
