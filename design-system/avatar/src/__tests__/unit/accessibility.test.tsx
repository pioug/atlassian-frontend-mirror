import React from 'react';

import { render } from '@testing-library/react';

import { axe } from '@af/accessibility-testing';

import BasicAvatarExample from '../../../examples/01-basicAvatar';
import AvatarItemExample from '../../../examples/03-basicAvatarItem';

it('Basic Avatar examples (circle, square, disabled, with presence, with status) should not fail aXe audit', async () => {
  const { container } = render(<BasicAvatarExample />);
  await axe(container);
});

it('Avatar Item examples should not fail aXe audit', async () => {
  const { container } = render(<AvatarItemExample />);
  await axe(container);
});
