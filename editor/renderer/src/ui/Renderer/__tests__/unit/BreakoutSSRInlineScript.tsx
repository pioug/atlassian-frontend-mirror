import React from 'react';
import { render, screen } from '@testing-library/react';
import { BreakoutSSRInlineScript } from '../../breakout-ssr';
describe('BreakoutSSRInlineScript', () => {
	it('should capture and report a11y violations', async () => {
		const { container } = render(<BreakoutSSRInlineScript noOpSSRInlineScript={true} />);

		await expect(container).toBeAccessible();
	});

	it('should include breakout script on client if noOpSSRInlineScript is true', async () => {
		render(<BreakoutSSRInlineScript noOpSSRInlineScript={true} />);
		expect(screen.getByTestId('breakout-ssr-inline-script')).toBeDefined();
	});
	it('should not include breakout script on client when jsdom is not defined and noOpSSRInlineScript is false', async () => {
		const orginalNavigator = window.navigator;
		Object.defineProperty(
			window.navigator,
			'userAgent',
			((value) => ({
				get() {
					return value;
				},
				set(v) {
					value = v;
				},
				includes: (str: string) => false,
			}))(window.navigator.userAgent),
		);
		//@ts-ignore we need to override to test for client
		global.navigator.userAgent = { platform: 'macOS', includes: (str: string) => false };
		render(<BreakoutSSRInlineScript noOpSSRInlineScript={false} />);
		expect(screen.queryByTestId('breakout-ssr-inline-script')).toBeNull();
		global.navigator = orginalNavigator;
	});
	it('should not include breakout script on client when jsdom is not defined and noOpSSRInlineScript is true', async () => {
		const orginalNavigator = window.navigator;
		//@ts-ignore we need to override to test for client
		global.navigator.userAgent = { platform: 'macOS', includes: (str: string) => false };
		render(<BreakoutSSRInlineScript noOpSSRInlineScript={true} />);
		expect(screen.getByTestId('breakout-ssr-inline-script')).toBeDefined();
		global.navigator = orginalNavigator;
	});
});
