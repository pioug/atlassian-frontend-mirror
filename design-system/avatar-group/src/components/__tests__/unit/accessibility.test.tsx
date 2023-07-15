import React from 'react';

import { render } from '@testing-library/react';

import { axe, toHaveNoViolations } from '@af/accessibility-testing';

import BasicAvatarGroupExample from '../../../../examples/02-basic-avatar-group';

expect.extend(toHaveNoViolations);

it('Basic AvatarGroup example (stack, grid) should not fail aXe audit', async () => {
  const { container } = render(<BasicAvatarGroupExample />);
  const results = await axe(container);

  expect(results).toHaveNoViolations();
});
