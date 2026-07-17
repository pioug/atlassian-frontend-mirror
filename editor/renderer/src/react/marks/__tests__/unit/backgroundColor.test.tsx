/**
 * @jsxRuntime classic
 * @jsx jsx
 */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';
import { screen, render } from '@testing-library/react';

import { setGlobalTheme } from '@atlaskit/tokens/set-global-theme';
import { eeTest } from '@atlaskit/tmp-editor-statsig/editor-experiments-test-utils';

import BackgroundColor from '../../backgroundColor';
import { RendererStyleContainer } from '../../../../ui/Renderer/RendererStyleContainer';

// eslint-disable-next-line @atlassian/a11y/require-jest-coverage
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
			`<span data-renderer-mark=\"true\" data-background-custom-color=\"#fedec8\" class=\"fabric-background-color-mark\" style=\"--custom-palette-color: var(--ds-background-accent-orange-subtler);\">Highlight this!</span>`,
		);
		await expect(document.body).toBeAccessible();
	});

	it('should render a background color mark inside a hyperlink', async () => {
		render(
			<RendererStyleContainer
				appearance="full-page"
				useBlockRenderForCodeBlock={false}
				allowNestedHeaderLinks={false}
			>
				<a href="https://www.atlassian.com">
					<BackgroundColor dataAttributes={{ 'data-renderer-mark': true }} color="#fedec8">
						Highlighted link
					</BackgroundColor>
				</a>
			</RendererStyleContainer>,
		);

		const mark = screen.getByText('Highlighted link');
		const link = screen.getByRole('link', { name: 'Highlighted link' });

		expect(link).toHaveAttribute('href', 'https://www.atlassian.com');
		expect(mark).toHaveClass('fabric-background-color-mark');
		expect(mark).toHaveAttribute('data-background-custom-color', '#fedec8');
		await expect(document.body).toBeAccessible();
	});

	eeTest
		.describe('platform_editor_lovability_text_bg_color', 'when highlighted links are enabled')
		.variant(true, () => {
			it('should not apply the highlight unset rule on links in the renderer', () => {
				render(
					<RendererStyleContainer
						appearance="full-page"
						useBlockRenderForCodeBlock={false}
						allowNestedHeaderLinks={false}
					>
						<a href="https://www.atlassian.com">
							<BackgroundColor dataAttributes={{ 'data-renderer-mark': true }} color="#fedec8">
								Highlighted link
							</BackgroundColor>
						</a>
					</RendererStyleContainer>,
				);

				const mark = screen.getByText('Highlighted link');

				// When experiment is enabled, the unset CSS rule is not rendered,
				// so highlight background is preserved on links.
				expect(mark).toHaveClass('fabric-background-color-mark');
				expect(mark).toHaveAttribute('data-background-custom-color', '#fedec8');
			});
		});

	eeTest
		.describe('platform_editor_lovability_text_bg_color', 'when highlighted links are disabled')
		.variant(false, () => {
			it('should apply the highlight unset rule on links in the renderer', () => {
				render(
					<RendererStyleContainer
						appearance="full-page"
						useBlockRenderForCodeBlock={false}
						allowNestedHeaderLinks={false}
					>
						<a href="https://www.atlassian.com">
							<BackgroundColor dataAttributes={{ 'data-renderer-mark': true }} color="#fedec8">
								Highlighted link
							</BackgroundColor>
						</a>
					</RendererStyleContainer>,
				);

				// When experiment is disabled, the unset CSS rule is rendered,
				// so highlight background is suppressed on links.
				const hasUnsetRule = Array.from(document.querySelectorAll('style')).some(
					(style) =>
						style.textContent?.includes('a .fabric-background-color-mark') &&
						style.textContent?.includes('background-color:unset'),
				);
				expect(hasUnsetRule).toBe(true);
			});
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
