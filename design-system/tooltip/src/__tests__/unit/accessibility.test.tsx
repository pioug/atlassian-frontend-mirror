import React from 'react';

import { render } from '@testing-library/react';

import { axe, toHaveNoViolations } from '@af/accessibility-testing';
import Button from '@atlaskit/button';

import Tooltip from '../../Tooltip';

expect.extend(toHaveNoViolations);

it('Basic Tooltip should not fail aXe audit', async () => {
  const { container } = render(
    <Tooltip content="Hello World">
      {(tooltipProps) => <Button {...tooltipProps}>Hover Over Me</Button>}
    </Tooltip>,
  );
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
