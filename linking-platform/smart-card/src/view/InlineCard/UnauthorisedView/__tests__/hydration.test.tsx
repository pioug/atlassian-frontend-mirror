import React from 'react';

import { hydrateRoot } from 'react-dom/client';
import { renderToString } from 'react-dom/server';
import { IntlProvider } from 'react-intl';
import { DiProvider, injectable, runWithDi } from 'react-magnetic-di';

import { failGate, passGate } from '@atlassian/feature-flags-test-utils/mock-gates';
import { act } from '@atlassian/testing-library/act';
import { screen } from '@atlassian/testing-library/screen';

import { getCachedProviderPctMapAndRefresh } from '../../../../state/services/personalization/getCachedProviderPctMapAndRefresh';
import { InlineCardUnauthorizedView } from '../index';

const mockFireEvent = jest.fn();
jest.mock('../../../../common/analytics/generated/use-analytics-events', () => ({
	useAnalyticsEvents: () => ({ fireEvent: mockFireEvent }),
}));

const HYDRATION_FIX_GATE = 'platform_sl_inline_social_proof_hydration_fix';

describe('Unauthorised View hydration', () => {
	it.each([
		{ gateEnabled: true, cacheState: 'warm', browserMap: { 'google-drive-object-provider': 72 } },
		{ gateEnabled: true, cacheState: 'cold', browserMap: null },
		{ gateEnabled: false, cacheState: 'warm', browserMap: { 'google-drive-object-provider': 72 } },
		{ gateEnabled: false, cacheState: 'cold', browserMap: null },
	])(
		'hydrates a $cacheState browser cache with the hydration fix gate enabled: $gateEnabled',
		async ({ gateEnabled, browserMap }) => {
			if (gateEnabled) {
				passGate(HYDRATION_FIX_GATE);
			} else {
				failGate(HYDRATION_FIX_GATE);
			}

			const onRecoverableError = jest.fn();
			const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
			const container = document.createElement('div');
			document.body.appendChild(container);
			const card = (
				<InlineCardUnauthorizedView
					context="Google Drive"
					extensionKey="google-drive-object-provider"
					url="http://unauthorised-test/"
					onAuthorise={jest.fn()}
				/>
			);
			let root: ReturnType<typeof hydrateRoot> | undefined;

			try {
				container.innerHTML = runWithDi(
					() => renderToString(<IntlProvider locale="en">{card}</IntlProvider>),
					[injectable(getCachedProviderPctMapAndRefresh, () => null)],
				);
				expect(
					screen.getByRole('button', { name: 'Connect your Google Drive account' }),
				).toBeInTheDocument();
				expect(
					screen.queryByTestId('inline-card-unauthorized-view-social-proof-tag'),
				).not.toBeInTheDocument();

				await act(async () => {
					root = hydrateRoot(
						container,
						<DiProvider use={[injectable(getCachedProviderPctMapAndRefresh, () => browserMap)]}>
							<IntlProvider locale="en">{card}</IntlProvider>
						</DiProvider>,
						{ onRecoverableError },
					);
				});

				if (browserMap) {
					expect(
						screen.getByTestId('inline-card-unauthorized-view-social-proof-tag'),
					).toHaveTextContent('72% of your team sees Google Drive previews');
					expect(screen.getByTestId('button-connect-account')).toHaveTextContent(/^Connect$/);
				} else {
					expect(
						screen.queryByTestId('inline-card-unauthorized-view-social-proof-tag'),
					).not.toBeInTheDocument();
					expect(
						screen.getByRole('button', { name: 'Connect your Google Drive account' }),
					).toBeInTheDocument();
				}
				if (!gateEnabled && browserMap) {
					expect(onRecoverableError).toHaveBeenCalledWith(
						expect.objectContaining({ message: expect.stringContaining('Hydration failed') }),
						expect.anything(),
					);
				} else {
					expect(onRecoverableError).not.toHaveBeenCalled();
				}
			} finally {
				act(() => {
					root?.unmount();
				});
				document.body.removeChild(container);
				consoleError.mockRestore();
			}
		},
	);
});
