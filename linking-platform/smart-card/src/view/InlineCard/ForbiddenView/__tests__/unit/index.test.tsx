import React from 'react';

import { fireEvent, render, screen } from '@testing-library/react';
import { IntlProvider } from 'react-intl-next';

import { SmartCardProvider as Provider } from '@atlaskit/link-provider';
import { ffTest } from '@atlassian/feature-flags-test-utils';

import { expectElementWithText } from '../../../../../__tests__/__utils__/unit-helpers';
import { InlineCardForbiddenView } from '../../index';

jest.mock('react-render-image');

jest.mock('@atlaskit/platform-feature-flags');

const URL =
	'http://product.example.com/lorem/ipsum/dolor/sit/amet/consectetur/adipiscing/volutpat/';

describe('Forbidden view', () => {
	ffTest.both('bandicoots-compiled-migration-smartcard', 'with compiled fg', () => {
		ffTest.both('platform-linking-visual-refresh-v1', 'with visual refresh fg', () => {
			it('should do click if try again clicked', async () => {
				const onRetrySpy = jest.fn();
				render(
					<IntlProvider locale={'en'}>
						<InlineCardForbiddenView url={URL} onAuthorise={onRetrySpy} />
					</IntlProvider>,
				);
				fireEvent.click(await screen.findByRole('button', { name: 'Restricted content' }));
				expect(onRetrySpy).toHaveBeenCalledTimes(1);
			});

			it('should not call onClick if onRetry was triggered', async () => {
				const onClickSpy = jest.fn();
				const onRetrySpy = jest.fn();
				render(
					<IntlProvider locale={'en'}>
						<InlineCardForbiddenView url={URL} onAuthorise={onRetrySpy} onClick={onClickSpy} />
					</IntlProvider>,
				);
				fireEvent.click(await screen.findByRole('button', { name: 'Restricted content' }));
				expect(onRetrySpy).toHaveBeenCalledTimes(1);
				expect(onClickSpy).not.toHaveBeenCalled();
			});

			it('should show correct text', async () => {
				render(
					<IntlProvider locale={'en'}>
						<InlineCardForbiddenView url={URL} />
					</IntlProvider>,
				);
				await expectElementWithText('inline-card-forbidden-view', URL);
			});

			it('should show correct text if actionable', async () => {
				render(
					<IntlProvider locale={'en'}>
						<InlineCardForbiddenView url={URL} onAuthorise={jest.fn()} />
					</IntlProvider>,
				);

				await expectElementWithText('inline-card-forbidden-view', `${URL}Restricted content`);
			});

			it('should show correct icon if not present (fallback icon)', async () => {
				render(
					<IntlProvider locale={'en'}>
						<InlineCardForbiddenView url={URL} onAuthorise={jest.fn()} />
					</IntlProvider>,
				);
				expect(await screen.findByTestId('forbidden-view-fallback-icon')).toHaveAttribute(
					'aria-label',
					'error',
				);
			});

			it('should show correct text if request access type is DIRECT_ACCESS', async () => {
				const requestAccessContext = {
					callToActionMessageKey: 'direct_access',
				};

				render(
					<IntlProvider locale={'en'}>
						<InlineCardForbiddenView
							url={URL}
							requestAccessContext={requestAccessContext as any}
							context="Jira"
						/>
					</IntlProvider>,
				);

				await expectElementWithText('button-connect-other-account', `Join now`);
			});

			it('should do promise if Join to preview clicked', async () => {
				const promise = jest.fn();
				const requestAccessContext = {
					callToActionMessageKey: 'direct_access',
					action: { promise },
				};
				render(
					<IntlProvider locale={'en'}>
						<InlineCardForbiddenView
							url={URL}
							context="Jira"
							requestAccessContext={requestAccessContext as any}
						/>
					</IntlProvider>,
				);
				fireEvent.click(await screen.findByRole('button', { name: 'Join now' }));
				expect(promise).toHaveBeenCalledTimes(1);
			});

			it('should show correct text if request access type is REQUEST_ACCESS', async () => {
				const requestAccessContext = {
					callToActionMessageKey: 'request_access',
				};
				render(
					<IntlProvider locale={'en'}>
						<InlineCardForbiddenView
							url={URL}
							context="Jira"
							requestAccessContext={requestAccessContext as any}
						/>
					</IntlProvider>,
				);

				await expectElementWithText('inline-card-forbidden-view', `${URL}Request access`);
			});

			it('should do promise if request access is clicked', async () => {
				const promise = jest.fn();
				const requestAccessContext = {
					callToActionMessageKey: 'request_access',
					action: { promise },
				};
				render(
					<IntlProvider locale={'en'}>
						<InlineCardForbiddenView
							url={URL}
							context="Jira"
							requestAccessContext={requestAccessContext as any}
						/>
					</IntlProvider>,
				);
				fireEvent.click(await screen.findByRole('button', { name: 'Request access' }));
				expect(promise).toHaveBeenCalledTimes(1);
			});

			it('should render a hover card when showHoverPreview prop is enabled', async () => {
				render(
					<IntlProvider locale="en">
						<Provider>
							<InlineCardForbiddenView showHoverPreview={true} url="www.test.com" context="Jira" />,
						</Provider>
						,
					</IntlProvider>,
				);
				expect(await screen.findByTestId('hover-card-trigger-wrapper')).toBeInTheDocument();
			});

			it('should not render a hover card when showHoverPreview prop is not enabled', async () => {
				render(<InlineCardForbiddenView url="www.test.com" context="Jira" />);
				expect(screen.queryByTestId('hover-card-trigger-wrapper')).not.toBeInTheDocument();
			});
		});
	});
});
