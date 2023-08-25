import React from 'react';

import { render } from '@testing-library/react';

import { axe } from '@af/accessibility-testing';

import InlineDialog from '../../index';

it('Inline Dialog should pass aXe accessibility audit', async () => {
  const { container } = render(
    <InlineDialog content={<p>Hello!</p>} isOpen={true}>
      <button type="button">Click me!</button>
    </InlineDialog>,
  );

  await axe(container);
});
