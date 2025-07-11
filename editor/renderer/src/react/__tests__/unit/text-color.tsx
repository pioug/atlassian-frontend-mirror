import React from 'react';
import { render } from '@testing-library/react';
import TextColor from '../../marks/textColor';

import { setGlobalTheme } from '@atlaskit/tokens';

describe('custom text colors inversion in dark mode', () => {
	it('should capture and report a11y violations', async () => {
		await setGlobalTheme({ colorMode: 'dark' });
		const { container } = render(
			<TextColor
				// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage/preview
				color="#ff00cc"
				dataAttributes={{
					'data-renderer-mark': true,
				}}
			>
				test
			</TextColor>,
		);

		await expect(container).toBeAccessible();
	});

	it('inverts in dark mode', async () => {
		await setGlobalTheme({ colorMode: 'dark' });
		const { container } = render(
			<TextColor
				// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage/preview
				color="#ff00cc"
				dataAttributes={{
					'data-renderer-mark': true,
				}}
			>
				test
			</TextColor>,
		);

		const span = container.querySelector('[data-text-custom-color]')!;
		expect(span!).toHaveStyle('--custom-palette-color: #CE00A1');
	});

	it('does not invert in light mode', async () => {
		await setGlobalTheme({ colorMode: 'light' });
		const { container } = render(
			<TextColor
				// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage/preview
				color="#ff00cc"
				dataAttributes={{
					'data-renderer-mark': true,
				}}
			>
				test
			</TextColor>,
		);

		const span = container.querySelector('[data-text-custom-color]')!;
		expect(span!).toHaveStyle('--custom-palette-color: #ff00cc');
	});
});
