import React from 'react';

import { axe } from '@af/accessibility-testing';
import Button from '@atlaskit/button/default/button';
import { render } from '@atlassian/testing-library';

import Tooltip from '../../tooltip';

it('Basic Tooltip should not fail aXe audit', async () => {
	HTMLElement.prototype.matches = jest
		.fn()
		.mockReturnValue(true) as unknown as typeof HTMLElement.prototype.matches;
	const { container } = render(
		<Tooltip content="Hello World">
			{(tooltipProps) => <Button {...tooltipProps}>Hover Over Me</Button>}
		</Tooltip>,
	);
	await axe(container);
});
