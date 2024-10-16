import React from 'react';
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css } from '@emotion/react';
import { render, screen } from '@testing-library/react';

import AtlaskitBadge from '../index';

describe('Element: AtlaskitBadge', () => {
	const testId = 'smart-element-atlaskit-badge';

	it('renders element', async () => {
		render(<AtlaskitBadge value={5} />);

		const element = await screen.findByTestId(testId);

		expect(element).toBeTruthy();
		expect(element.getAttribute('data-smart-element-atlaskit-badge')).toBeTruthy();
		expect(element.textContent).toBe('5');
	});

	it('renders with override css', async () => {
		const overrideCss = css({
			color: 'black',
		});
		render(<AtlaskitBadge value={5} overrideCss={overrideCss} />);
		const element = await screen.findByTestId(testId);
		expect(element).toHaveStyleDeclaration('color', 'black');
	});
});
