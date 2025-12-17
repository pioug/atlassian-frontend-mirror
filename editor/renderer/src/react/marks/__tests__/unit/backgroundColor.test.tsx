/**
 * @jsxRuntime classic
 * @jsx jsx
 */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';
import { screen, render } from '@testing-library/react';
import BackgroundColor from '../../backgroundColor';
import { setGlobalTheme } from '@atlaskit/tokens';
import { RendererStyleContainer } from '../../../../ui/Renderer/RendererStyleContainer';

describe('Renderer - React/Marks/BackgroundColor', () => {
	it('should render a background color mark', async () => {
		render(
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766
			<RendererStyleContainer
				appearance="full-page"
				useBlockRenderForCodeBlock={false}
				allowNestedHeaderLinks={false}
			>
				<BackgroundColor dataAttributes={{ 'data-renderer-mark': true }} color="#fedec8">
					Highlight this!
				</BackgroundColor>
			</RendererStyleContainer>,
		);

		const mark = screen.getByText('Highlight this!');

		expect(mark.tagName).toEqual('SPAN');
		expect(mark).toContainHTML(
			`<span data-renderer-mark=\"true\" data-background-custom-color=\"#fedec8\" class=\"fabric-background-color-mark\" style=\"--custom-palette-color: var(--ds-background-accent-yellow-subtler, #F8E6A0);\">Highlight this!</span>`,
		);
		await expect(document.body).toBeAccessible();
	});

	describe('custom colors', () => {
		it('renders in light mode', async () => {
			await setGlobalTheme({ colorMode: 'light' });

			render(
				<BackgroundColor dataAttributes={{ 'data-renderer-mark': true }} color="#ff00cc">
					Highlight this!
				</BackgroundColor>,
			);

			const mark = screen.getByText('Highlight this!');

			expect(mark).toHaveStyle('--custom-palette-color: #ff00cc');

			expect(mark).toHaveClass('fabric-background-color-mark');
			expect(mark).toHaveAttribute('data-background-custom-color', '#ff00cc');
			expect(mark).toHaveAttribute('data-renderer-mark', 'true');
			await expect(document.body).toBeAccessible();
		});

		it('has automatic color inversion in dark mode', async () => {
			await setGlobalTheme({ colorMode: 'dark' });

			render(
				<BackgroundColor dataAttributes={{ 'data-renderer-mark': true }} color="#ff00cc">
					Highlight this!
				</BackgroundColor>,
			);

			const mark = screen.getByText('Highlight this!');

			expect(mark).toHaveStyle('--custom-palette-color: #CE00A1');

			expect(mark).toHaveClass('fabric-background-color-mark');
			expect(mark).toHaveAttribute('data-background-custom-color', '#ff00cc');
			expect(mark).toHaveAttribute('data-renderer-mark', 'true');
			await expect(document.body).toBeAccessible();
		});
	});
});
