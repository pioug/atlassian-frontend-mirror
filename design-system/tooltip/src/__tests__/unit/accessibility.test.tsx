import React from 'react';

import { render } from '@testing-library/react';

import { axe } from '@af/accessibility-testing';
import Button from '@atlaskit/button/new';
import { fg } from '@atlaskit/platform-feature-flags';

import Tooltip from '../../tooltip';

jest.mock('@atlaskit/platform-feature-flags');
const mockGetBooleanFF = fg as jest.MockedFunction<typeof fg>;

it('Basic Tooltip should not fail aXe audit', async () => {
	mockGetBooleanFF.mockImplementation((key) => key === 'platform-tooltip-focus-visible');
	HTMLElement.prototype.matches = jest.fn().mockReturnValue(true);
	const { container } = render(
		<Tooltip content="Hello World">
			{(tooltipProps) => <Button {...tooltipProps}>Hover Over Me</Button>}
		</Tooltip>,
	);
	await axe(container);
});
