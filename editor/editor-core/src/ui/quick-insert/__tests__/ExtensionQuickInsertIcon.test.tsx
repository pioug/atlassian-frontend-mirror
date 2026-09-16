import React from 'react';

import { render, screen } from '@atlassian/testing-library';

import { ExtensionQuickInsertIcon } from '../ExtensionQuickInsertIcon';

describe('ExtensionQuickInsertIcon', () => {
	it.each([
		[
			'Amplitude',
			'https://dam-cdn.atl.orangelogic.com/AssetLink/730r6bie0211kg6obni4343y4g1wv6n5.svg',
		],
		['Figma', 'https://dam-cdn.atl.orangelogic.com/AssetLink/68t3023r7347271te7qw370k2pk37rgb.svg'],
	] as const)('renders the approved %s icon', (itemTitle, iconUrl) => {
		render(<ExtensionQuickInsertIcon itemKey="embed:item" itemTitle={itemTitle} label="" />);

		const icon = screen.getByAltText('');
		expect(icon).toHaveAttribute('src', iconUrl);
		expect(icon).toHaveAttribute('alt', '');
	});
});
