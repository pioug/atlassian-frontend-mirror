import React from 'react';

import { failGate, passGate } from '@atlassian/feature-flags-test-utils/mock-gates';
import { render } from '@atlassian/testing-library/render';
import { screen } from '@atlassian/testing-library/screen';

import { SmartLinkSize } from '../../../../constants';
import PageIconWithColor from '../page-icon';

describe('renderIconTile', () => {
	it('should capture and report a11y violations', async () => {
		passGate('platform_lp_non_bold_large_sl_icon');

		const { container } = render(
			<PageIconWithColor label="document" testId="page-icon" size={SmartLinkSize.Large} />,
		);

		await expect(container).toBeAccessible();
	});

	it('uses the non-bold tile appearance when platform_lp_non_bold_large_sl_icon is on', () => {
		passGate('platform_lp_non_bold_large_sl_icon');

		render(<PageIconWithColor label="document" testId="page-icon" size={SmartLinkSize.Large} />);

		expect(screen.getByTestId('page-icon')).toHaveCompiledCss(
			'background-color',
			'var(--ds-background-neutral,#0515240f)',
		);
	});

	it('keeps the bold tile appearance when platform_lp_non_bold_large_sl_icon is off', () => {
		failGate('platform_lp_non_bold_large_sl_icon');

		render(<PageIconWithColor label="document" testId="page-icon" size={SmartLinkSize.Large} />);

		expect(screen.getByTestId('page-icon')).toHaveCompiledCss(
			'background-color',
			'var(--ds-background-accent-blue-subtle,#669df1)',
		);
	});
});
