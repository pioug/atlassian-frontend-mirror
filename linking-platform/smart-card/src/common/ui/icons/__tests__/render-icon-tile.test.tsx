import React from 'react';

import { render } from '@atlassian/testing-library/render';
import { screen } from '@atlassian/testing-library/screen';

import { SmartLinkSize } from '../../../../constants';
import PageIconWithColor from '../page-icon';

describe('renderIconTile', () => {
	it('should capture and report a11y violations', async () => {
		const { container } = render(
			<PageIconWithColor label="document" testId="page-icon" size={SmartLinkSize.Large} />,
		);

		await expect(container).toBeAccessible();
	});

	it('uses the non-bold tile appearance', () => {
		render(<PageIconWithColor label="document" testId="page-icon" size={SmartLinkSize.Large} />);

		expect(screen.getByTestId('page-icon')).toHaveCompiledCss(
			'background-color',
			'var(--ds-background-neutral,#0515240f)',
		);
	});
});
