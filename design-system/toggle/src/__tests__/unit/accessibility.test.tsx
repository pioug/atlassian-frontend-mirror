import React from 'react';

import { render } from '@testing-library/react';

import { axe } from '@af/accessibility-testing';

import DefaultToggle from '../../../examples/constellation/toggle-default';
import DisabledToggle from '../../../examples/constellation/toggle-disabled';
import Toggle from '../../toggle';

it('should not have violations when have label', async () => {
  const { container } = render(<Toggle label="Toggle" />);
  await axe(container);
});

it('Default toggle should pass axe audit', async () => {
  const { container } = render(<DefaultToggle />);
  await axe(container);
});

it('Disabled toggle should pass axe audit', async () => {
  const { container } = render(<DisabledToggle />);
  await axe(container);
});
