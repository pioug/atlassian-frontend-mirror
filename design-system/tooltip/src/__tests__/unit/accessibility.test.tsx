import React from 'react';

import { render } from '@testing-library/react';

import { axe } from '@af/accessibility-testing';
import Button from '@atlaskit/button/new';

import Tooltip from '../../Tooltip';

it('Basic Tooltip should not fail aXe audit', async () => {
  const { container } = render(
    <Tooltip content="Hello World">
      {(tooltipProps) => <Button {...tooltipProps}>Hover Over Me</Button>}
    </Tooltip>,
  );
  await axe(container);
});
