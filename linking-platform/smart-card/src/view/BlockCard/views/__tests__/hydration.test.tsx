import React from 'react';

import { hydrateRoot } from 'react-dom/client';
import { renderToString } from 'react-dom/server';
import { IntlProvider } from 'react-intl';

import { SmartCardProvider } from '@atlaskit/link-provider/smart-card-provider';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';
import { mockExpDisabled } from '@atlassian/experiment-test-utils/mock-exp-disabled';
import { mockExpEnabled } from '@atlassian/experiment-test-utils/mock-exp-enabled';
import { passGate } from '@atlassian/feature-flags-test-utils/mock-gates';
import { act } from '@atlassian/testing-library/act';

import { getCurrentSiteCloudId } from '../../../../state/services/current-site-cloud-id/getCurrentSiteCloudId';
import { getCurrentSiteCloudIdSync } from '../../../../state/services/current-site-cloud-id/getCurrentSiteCloudIdSync';
import { getProviderPctMap } from '../../../../state/services/personalization/getProviderPctMap';
import { getProviderPctMapSync } from '../../../../state/services/personalization/getProviderPctMapSync';
import { mocks } from '../../../../utils/mocks';
import BaseDateTimeElement from '../../../FlexibleCard/components/elements/common/base-date-time-element';
import UnauthorisedView from '../UnauthorisedView';

jest.mock('../../../../state/services/current-site-cloud-id/getCurrentSiteCloudId');
jest.mock('../../../../state/services/current-site-cloud-id/getCurrentSiteCloudIdSync');
jest.mock('../../../../state/services/personalization/getProviderPctMap');
jest.mock('../../../../state/services/personalization/getProviderPctMapSync');
jest.mock('@atlaskit/tmp-editor-statsig/exp-val-equals', () => ({
	expValEquals: jest.fn(),
}));

const HYDRATION_EXPERIMENT = 'platform_sl_hydration_safe_content';
const extensionKey = 'google-object-provider';

describe('block Smart Link and modified date hydration', () => {
	it.each([
		{ hydrationFixEnabled: true, warmCache: true, treatment: true },
		{ hydrationFixEnabled: true, warmCache: true, treatment: false },
		{ hydrationFixEnabled: true, warmCache: false, treatment: true },
		{ hydrationFixEnabled: false, warmCache: true, treatment: true },
		{ hydrationFixEnabled: false, warmCache: false, treatment: true },
	])(
		'hydrates with $warmCache warm cache, fix enabled: $hydrationFixEnabled, treatment: $treatment',
		async ({ hydrationFixEnabled, warmCache, treatment }) => {
			passGate('social-proof-3p-unauth-block-fg');
			jest.mocked(expValEquals).mockReturnValue(treatment);
			if (hydrationFixEnabled) {
				mockExpEnabled(HYDRATION_EXPERIMENT);
			} else {
				mockExpDisabled(HYDRATION_EXPERIMENT);
			}
			jest.mocked(getCurrentSiteCloudId).mockResolvedValue('cloud-id');
			jest.mocked(getProviderPctMap).mockResolvedValue(undefined);
			jest.mocked(getCurrentSiteCloudIdSync).mockReturnValue(undefined);
			jest.mocked(getProviderPctMapSync).mockReturnValue(null);
			const now = jest
				.spyOn(Date, 'now')
				.mockReturnValue(new Date('2026-10-30T12:00:00Z').getTime());
			const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
			const onRecoverableError = jest.fn();
			const container = document.createElement('div');
			document.body.appendChild(container);
			let root: ReturnType<typeof hydrateRoot> | undefined;
			const content = () => (
				<SmartCardProvider>
					<UnauthorisedView
						url="https://docs.google.com/document/d/test"
						onAuthorize={() => {}}
						cardState={{
							status: 'unauthorized',
							details: {
								...mocks.unauthorized,
								meta: { ...mocks.unauthorized.meta, key: extensionKey },
								data: {
									'@context': {
										'@vocab': 'https://www.w3.org/ns/activitystreams#',
										atlassian: 'https://schema.atlassian.com/ns/vocabulary#',
										schema: 'http://schema.org/',
									},
									'@type': 'Document',
									generator: {
										'@type': 'Application',
										name: 'Google Drive',
										icon: { '@type': 'Image', url: 'https://example.com/google-drive.png' },
									},
								},
							},
						}}
					/>
					<BaseDateTimeElement date={new Date('2025-08-18T00:30:00Z')} type="modified" />
					<footer>Included content footer</footer>
				</SmartCardProvider>
			);

			try {
				container.innerHTML = renderToString(
					<IntlProvider locale="en" timeZone="UTC">
						{content()}
					</IntlProvider>,
				);
				expect(container.textContent).toContain('Turn your URLs into rich, interactive previews.');
				expect(container.textContent).toContain('Updated on Aug 18, 2025');
				const serverFooter = container.querySelector('footer');
				const serverDate = container.querySelector('[data-testid="smart-element-date-time"]');

				jest.mocked(getCurrentSiteCloudIdSync).mockReturnValue('cloud-id');
				jest
					.mocked(getProviderPctMapSync)
					.mockReturnValue(warmCache ? { [extensionKey]: 72 } : null);
				await act(async () => {
					root = hydrateRoot(
						container,
						<IntlProvider locale="en" timeZone="America/Los_Angeles">
							{content()}
						</IntlProvider>,
						{ onRecoverableError },
					);
				});

				expect(container.textContent).toContain(
					warmCache && treatment
						? '72% of your team sees Google Drive previews'
						: 'Turn your URLs into rich, interactive previews.',
				);
				expect(container.textContent).toContain('Updated on Aug 17, 2025');
				if (hydrationFixEnabled) {
					expect(onRecoverableError).not.toHaveBeenCalled();
					// Existing react-loadable and analytics providers emit legacy-context deprecations.
					// Keep every other console error visible, including hydration warnings.
					expect(
						consoleError.mock.calls.filter(
							([message]) => !String(message).includes('https://reactjs.org/link/legacy-context'),
						),
					).toEqual([]);
					expect(container.querySelector('footer')).toBe(serverFooter);
					expect(container.querySelector('[data-testid="smart-element-date-time"]')).toBe(
						serverDate,
					);
				} else {
					// Prove this fixture detects the original mismatches and client-render recovery.
					expect(onRecoverableError).toHaveBeenCalled();
				}

				// Background refresh must not change the treatment selected for this mount.
				jest.mocked(getProviderPctMapSync).mockReturnValue({ [extensionKey]: 99 });
				await act(async () => {
					root?.render(
						<IntlProvider locale="en" timeZone="America/Los_Angeles">
							{content()}
						</IntlProvider>,
					);
				});
				expect(container.textContent).not.toContain('99%');
			} finally {
				act(() => root?.unmount());
				container.remove();
				consoleError.mockRestore();
				now.mockRestore();
			}
		},
	);
});
