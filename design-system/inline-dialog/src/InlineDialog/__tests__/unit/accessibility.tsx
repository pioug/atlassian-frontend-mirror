import React from 'react';

import { render } from '@testing-library/react';

import { axe } from '@af/accessibility-testing';

import DefaultInlineDialog from '../../../../examples/01-default';

it('Inline Dialog should pass aXe accessibility audit', async () => {
  const { container } = render(<DefaultInlineDialog />);

  await axe(container);
});
