import React from 'react';

import { render } from '@testing-library/react';

import { axe } from '@af/accessibility-testing';

import BasicExample from '../../../examples/constellation/basic';
import ControlledExample from '../../../examples/constellation/controlled';

it('TableTree should pass basic axe audit', async () => {
  const { container } = render(<BasicExample />);
  await axe(container);
});

it('Controlled TableTree should pass basic axe audit', async () => {
  const { container } = render(<ControlledExample />);
  await axe(container);
});
