import React from 'react';

import { render } from '@testing-library/react';

import { axe, toHaveNoViolations } from '@af/accessibility-testing';

import BasicAvatarExample from '../../../examples/01-basicAvatar';
import AvatarItemExample from '../../../examples/03-basicAvatarItem';

expect.extend(toHaveNoViolations);

it('Basic Avatar examples (circle, square, disabled, with presence, with status) should not fail aXe audit', async () => {
  const { container } = render(<BasicAvatarExample />);
  const results = await axe(container);

  expect(results).toHaveNoViolations();
});

it('Avatar Item examples should not fail aXe audit', async () => {
  const { container } = render(<AvatarItemExample />);
  const results = await axe(container);

  expect(results).toHaveNoViolations();
});
