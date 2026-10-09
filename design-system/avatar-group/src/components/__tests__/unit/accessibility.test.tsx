import React from 'react';

import { axe } from '@af/accessibility-testing/jest-axe';
import { render } from '@atlassian/testing-library/testing-library/react';

import BasicAvatarGroupExample from '../../../../examples/02-basic-avatar-group.vr.ap';

it('Basic AvatarGroup example (stack, grid) should not fail aXe audit', async () => {
	const { container } = render(<BasicAvatarGroupExample />);
	await axe(container);
});
