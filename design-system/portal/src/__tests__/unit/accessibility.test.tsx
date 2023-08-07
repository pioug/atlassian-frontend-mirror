import React from 'react';

import { render } from '@testing-library/react';

import { axe } from '@af/accessibility-testing';

import Portal from '../../index';

it('Basic portal with button should pass axe audit', async () => {
  const { container } = render(
    <Portal zIndex={500}>
      <button type="button">Button in portal</button>
    </Portal>,
  );
  await axe(container);
});
