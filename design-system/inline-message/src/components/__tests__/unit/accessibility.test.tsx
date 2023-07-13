import React from 'react';

import { render } from '@testing-library/react';

import {
  axe,
  jestAxeConfig,
  toHaveNoViolations,
} from '@af/accessibility-testing';

import InlineMessage from '../../inline-message';

expect.extend(toHaveNoViolations);

it('Basic InlineMessage should not fail aXe audit', async () => {
  const { container } = render(
    <InlineMessage
      title="Inline Message Title Example"
      secondaryText="Secondary Text"
    >
      <p>Primary and secondary text dialog</p>
    </InlineMessage>,
  );
  const results = await axe(container, jestAxeConfig);
  expect(results).toHaveNoViolations();
});
