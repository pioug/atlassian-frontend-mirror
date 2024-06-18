/** @jsx jsx */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';
import { screen, render } from '@testing-library/react';
import BackgroundColor from '../../backgroundColor';
import { textColorStyles } from '@atlaskit/editor-common/styles';
import { setGlobalTheme } from '@atlaskit/tokens';

describe('Renderer - React/Marks/BackgroundColor', () => {
	it('should render a background color mark', () => {
		render(
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766
			<div css={textColorStyles}>
				<BackgroundColor dataAttributes={{ 'data-renderer-mark': true }} color="#fedec8">
					Highlight this!
				</BackgroundColor>
				,
			</div>,
		);

		const mark = screen.getByText('Highlight this!');

		expect(mark.tagName).toEqual('SPAN');
		expect(mark).toContainHTML(
			`<span data-renderer-mark=\"true\" data-background-custom-color=\"#fedec8\" class=\"fabric-background-color-mark\" style=\"--custom-palette-color: var(--ds-background-accent-orange-subtler, #FEDEC8);\">Highlight this!</span>`,
		);
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
		});
	});
});
