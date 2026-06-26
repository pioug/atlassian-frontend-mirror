import React from 'react';

import { IntlProvider } from 'react-intl';

import { SmartCardProvider } from '@atlaskit/link-provider';
import { render, screen } from '@atlassian/testing-library';

import mockState from '../../../../../__fixtures__/document-entity';
import { InlineRovoActionButton } from '../index';

describe('InlineRovoActionButton', () => {
	it('should be accessible', async () => {
		const { container } = render(
			<IntlProvider locale="en">
				<SmartCardProvider
					storeOptions={{
						initialState: {
							'https://example.com/': {
								status: 'resolved',
								details: mockState,
							},
						},
					}}
				>
					<InlineRovoActionButton
						testId="rovo-actions-cta"
						actionOptions={{ hide: true, rovoChatAction: { optIn: true } }}
						url={'https://example.com/'}
					/>
				</SmartCardProvider>
			</IntlProvider>,
		);
		await expect(container).toBeAccessible();
	});

	it('renders the icon', () => {
		render(
			<IntlProvider locale="en">
				<SmartCardProvider
					storeOptions={{
						initialState: {
							'https://example.com/': {
								status: 'resolved',
								details: mockState,
							},
						},
					}}
				>
					<InlineRovoActionButton
						testId="rovo-actions-cta"
						actionOptions={{ hide: true, rovoChatAction: { optIn: true } }}
						url={'https://example.com/'}
					/>
				</SmartCardProvider>
			</IntlProvider>,
		);
		expect(screen.getByTestId('rovo-actions-cta')).toBeInTheDocument();
	});
});
