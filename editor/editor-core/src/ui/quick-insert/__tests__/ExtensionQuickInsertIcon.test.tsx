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

	it('forwards a requested small size to the asynchronously loaded extension icon', async () => {
		const ExtensionIcon = ({ size }: { label: string; size?: string }) => (
			<span data-testid="extension-icon" data-size={size} />
		);

		render(
			<ExtensionQuickInsertIcon
				getIcon={() => Promise.resolve({ default: ExtensionIcon })}
				itemKey="skill:research"
				label=""
				size="small"
			/>,
		);

		expect(await screen.findByTestId('extension-icon')).toHaveAttribute('data-size', 'small');
	});

	it('leaves the size unspecified when no size is requested', async () => {
		const ExtensionIcon = ({ size }: { label: string; size?: string }) => (
			<span data-testid="extension-icon" data-size={size} />
		);

		render(
			<ExtensionQuickInsertIcon
				getIcon={() => Promise.resolve({ default: ExtensionIcon })}
				itemKey="skill:research"
				label=""
			/>,
		);

		expect(await screen.findByTestId('extension-icon')).not.toHaveAttribute('data-size');
	});
});
