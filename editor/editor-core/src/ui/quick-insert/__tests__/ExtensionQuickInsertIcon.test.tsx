import React from 'react';

import { render, screen } from '@atlassian/testing-library';

import { ExtensionQuickInsertIcon } from '../ExtensionQuickInsertIcon';

describe('ExtensionQuickInsertIcon', () => {
	it('renders the icon supplied by the extension', async () => {
		const ExtensionIcon = ({ label }: { label: string }) => <span aria-label={label} role="img" />;

		const { container } = render(
			<ExtensionQuickInsertIcon
				getIcon={() => Promise.resolve({ default: ExtensionIcon })}
				itemKey="embed:item"
				label="Extension"
			/>,
		);

		expect(await screen.findByRole('img', { name: 'Extension' })).toBeInTheDocument();
		await expect(container).toBeAccessible();
	});
});
