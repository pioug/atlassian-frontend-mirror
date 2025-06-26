/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { css, jsx } from '@compiled/react';
import { render, screen } from '@testing-library/react';

import AtlaskitElementBadge from '../index';

describe('Element: AtlaskitBadge', () => {
	const testId = 'smart-element-atlaskit-badge';

	it('should capture and report a11y violations', async () => {
		const { container } = render(<AtlaskitElementBadge value={5} />);

		await expect(container).toBeAccessible();
	});

	it('renders element', async () => {
		render(<AtlaskitElementBadge value={5} />);

		const element = await screen.findByTestId(testId);

		expect(element).toBeTruthy();
		expect(element.getAttribute('data-smart-element-atlaskit-badge')).toBeTruthy();
		expect(element).toHaveTextContent('5');
	});

	it('renders with override css', async () => {
		const overrideCss = css({
			color: 'black',
		});
		render(<AtlaskitElementBadge value={5} css={overrideCss} />);
		const element = await screen.findByTestId(testId);
		expect(element).toHaveCompiledCss('color', '#000');
	});
});
