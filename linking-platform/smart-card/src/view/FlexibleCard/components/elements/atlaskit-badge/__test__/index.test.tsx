/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { css, jsx } from '@compiled/react';
import { render, screen } from '@testing-library/react';

import AtlaskitBadge from '../index';

describe('Element: AtlaskitBadge', () => {
	const testId = 'smart-element-atlaskit-badge';

	it('renders element', async () => {
		render(<AtlaskitBadge value={5} />);

		const element = await screen.findByTestId(testId);

		expect(element).toBeTruthy();
		expect(element.getAttribute('data-smart-element-atlaskit-badge')).toBeTruthy();
		expect(element).toHaveTextContent('5');
	});

	it('renders with override css', async () => {
		const overrideCss = css({
			color: 'black',
		});
		render(<AtlaskitBadge value={5} css={overrideCss} />);
		const element = await screen.findByTestId(testId);
		expect(element).toHaveCompiledCss('color', '#000');
	});
});
