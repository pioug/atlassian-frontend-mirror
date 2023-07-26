import React from 'react';

import { render } from '@testing-library/react';

import { axe } from '@af/accessibility-testing';

import DefaultPopper from '../../../examples/constellation/popper-basic-positioning';

it('Popper should pass axe audit', async () => {
  const { container } = render(<DefaultPopper />);
  await axe(container);
});
