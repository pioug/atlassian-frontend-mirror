import React from 'react';

import type { ThemeWithCustomOverrides } from '@atlaskit/tokens/custom-theme-overrides';
import { failGate, passGate } from '@atlassian/feature-flags-test-utils/mock-gates';
import { screen } from '@atlassian/testing-library/screen';
import { render } from '@atlassian/testing-library/testing-library/react';

import AppProvider from '../../src/app-provider';
import { ThemeProvider } from '../../src/theme-provider';

const configuration = (scale?: number): ThemeWithCustomOverrides => ({
	spacing: { id: 'UNSAFE-spacing', overrides: { dynamicSpaceGapScale: scale } },
});

const styleFor = (text: string) => {
	// eslint-disable-next-line testing-library/no-node-access
	const wrapper = screen.getByText(text).closest('[data-subtree-theme]');
	const scope = wrapper?.getAttribute('data-theme-overrides-scope');
	// eslint-disable-next-line testing-library/no-node-access
	return Array.from(document.head.querySelectorAll('style[data-theme-overrides]')).filter((style) =>
		style.textContent?.includes(`[data-theme-overrides-scope="${scope}"]`),
	);
};

describe('custom spacing providers', () => {
	it('uses shared root selectors without synthesizing nested inputs', () => {
		render(
			<AppProvider defaultTheme={configuration(2)}>
				<div>Root</div>
				<ThemeProvider defaultTheme={configuration()}>
					<div>Child</div>
				</ThemeProvider>
			</AppProvider>,
		);
		// eslint-disable-next-line testing-library/no-node-access
		const styles = Array.from(document.head.querySelectorAll('style[data-theme-overrides]'));
		const root = styles.find((style) =>
			style.textContent?.includes('html[data-theme~="spacing:UNSAFE-spacing"]'),
		);
		expect(root).toHaveTextContent('--ds-dynamic-space-gap-scale: 2;');
		expect(root).toHaveTextContent(
			'html[data-theme~="spacing:UNSAFE-spacing"], [data-subtree-theme][data-theme~="spacing:UNSAFE-spacing"]',
		);
		expect(styleFor('Child')).toHaveLength(0);
	});

	it.each([true, false])(
		'updates and resets scoped inputs with static loading %s',
		(staticLoading) => {
			if (staticLoading) {
				passGate('platform-static-theme-loading');
			} else {
				failGate('platform-static-theme-loading');
			}
			const { rerender, unmount } = render(
				<ThemeProvider defaultTheme={configuration(2)}>
					<div>Preview</div>
				</ThemeProvider>,
			);
			expect(styleFor('Preview')).toHaveLength(1);
			expect(styleFor('Preview')[0]).toHaveTextContent('--ds-dynamic-space-gap-scale: 2;');
			rerender(
				<ThemeProvider defaultTheme={configuration()}>
					<div>Preview</div>
				</ThemeProvider>,
			);
			expect(styleFor('Preview')).toHaveLength(0);
			unmount();
			// eslint-disable-next-line testing-library/no-node-access
			expect(document.head.querySelector('style[data-theme-overrides]')).not.toBeInTheDocument();
		},
	);

	it('scopes supplied inputs independently for siblings and nested providers', () => {
		render(
			<>
				<ThemeProvider defaultTheme={configuration(2)}>
					<div>Parent</div>
					<ThemeProvider defaultTheme={configuration(3)}>
						<div>Child</div>
					</ThemeProvider>
				</ThemeProvider>
				<ThemeProvider defaultTheme={configuration(0.5)}>
					<div>Sibling</div>
				</ThemeProvider>
			</>,
		);
		for (const [text, scale] of [
			['Parent', 2],
			['Child', 3],
			['Sibling', 0.5],
		] as const) {
			expect(styleFor(text)).toHaveLength(1);
			expect(styleFor(text)[0]).toHaveTextContent(`--ds-dynamic-space-gap-scale: ${scale};`);
			expect(styleFor(text)[0]).not.toHaveTextContent('--ds-dynamic-space-inset-scale');
		}
	});
});
