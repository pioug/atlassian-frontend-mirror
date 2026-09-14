import React from 'react';

import { render } from '@atlassian/testing-library';
import { axe } from '@af/accessibility-testing';

import BasicAvatarGroupExample from '../../../../examples/02-basic-avatar-group.vr.ap';

it('Basic AvatarGroup example (stack, grid) should not fail aXe audit', async () => {
	const { container } = render(<BasicAvatarGroupExample />);
	await axe(container);
});
