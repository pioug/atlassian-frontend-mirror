import React from 'react';

import { screen } from '@testing-library/react';

import { SmartCardProvider } from '@atlaskit/link-provider';
import { type CardState } from '@atlaskit/linking-common';
import { renderWithIntl } from '@atlaskit/media-test-helpers/renderWithIntl';

import {
	CONTENT_URL_3P_ACCOUNT_AUTH,
	CONTENT_URL_SECURITY_AND_PERMISSIONS,
} from '../../../../constants';
import { mocks } from '../../../../utils/mocks';
import UnauthorisedView from '../UnauthorisedView';

describe('UnauthorisedView', () => {
	const url = 'https://some.url';
	const titleTestId = 'smart-element-link';
	const descriptionTestId = 'smart-block-unauthorized-view-content';
	const buttonTestId = 'smart-action-connect-account';

	const renderComponent = (props?: Partial<React.ComponentProps<typeof UnauthorisedView>>) =>
		renderWithIntl(
			<SmartCardProvider>
				<UnauthorisedView
					cardState={
						{
							status: 'unauthorized',
							details: {
								...mocks.unauthorized,
								data: {
									...mocks.unauthorized.data,
									generator: {
										'@type': 'Application',
										icon: {
											'@type': 'Image',
											url: 'https://some.icon.url',
										},
										name: '3P',
									},
								},
							},
						} as CardState
					}
					onAuthorize={() => {}}
					url={url}
					{...props}
				/>
			</SmartCardProvider>,
		);

	it('renders unauthorised view', async () => {
		renderComponent();

		const title = await screen.findByTestId(titleTestId);
		expect(title).toHaveTextContent(url);

		const description = await screen.findByTestId(descriptionTestId);
		expect(description).toHaveTextContent(
			'Connect your 3P account to collaborate on work across Atlassian products. Learn more about Smart Links.',
		);

		const learnMoreUrl = (await screen.findByRole('link', { name: /learn more/i })).getAttribute(
			'href',
		);
		expect(learnMoreUrl).toBe(CONTENT_URL_SECURITY_AND_PERMISSIONS);

		const button = await screen.findByTestId(buttonTestId);
		expect(button).toHaveTextContent('Connect to 3P');
	});

	it('renders unauthorised view with alternative message when `hasScopeOverrides` flag is present in meta', async () => {
		renderComponent({
			cardState: {
				status: 'unauthorized',
				details: {
					meta: {
						...mocks.unauthorized.meta,
						hasScopeOverrides: true,
					},
					data: {
						...mocks.unauthorized.data,
						generator: {
							'@type': 'Application',
							icon: {
								'@type': 'Image',
								url: 'https://some.icon.url',
							},
							name: '3P',
						},
					},
				},
			} as CardState,
		});

		const title = await screen.findByTestId(titleTestId);
		expect(title).toHaveTextContent(url);

		const description = await screen.findByTestId(descriptionTestId);
		expect(description).toHaveTextContent(
			'Connect your 3P account to collaborate on work across Atlassian products. Learn more about connecting your account to Atlassian products.',
		);

		const learnMoreUrl = (await screen.findByRole('link', { name: /learn more/i })).getAttribute(
			'href',
		);
		expect(learnMoreUrl).toBe(CONTENT_URL_3P_ACCOUNT_AUTH);

		const button = await screen.findByTestId(buttonTestId);
		expect(button).toHaveTextContent('Connect to 3P');
	});

	it('renders unauthorised view without provider name', async () => {
		renderComponent({
			cardState: {
				status: 'unauthorized',
				details: mocks.unauthorized,
			},
		});

		const title = await screen.findByTestId(titleTestId);
		expect(title).toHaveTextContent(url);

		const description = await screen.findByTestId(descriptionTestId);
		expect(description).toHaveTextContent(
			'Connect your account to collaborate on work across Atlassian products. Learn more about Smart Links.',
		);

		const button = await screen.findByTestId(buttonTestId);
		expect(button).toHaveTextContent('Connect');
	});

	it('renders unauthorised view with no auth flow', async () => {
		renderComponent({
			onAuthorize: undefined,
		});

		const title = await screen.findByTestId(titleTestId);
		expect(title).toHaveTextContent(url);

		const description = await screen.findByTestId(descriptionTestId);
		expect(description).toHaveTextContent(
			"You're trying to preview a link to a private 3P page. We recommend you review the URL or contact the page owner.",
		);

		const button = screen.queryByTestId(buttonTestId);
		expect(button).not.toBeInTheDocument();
	});

	it('renders unauthorised view with no auth flow without provider name', async () => {
		renderComponent({
			cardState: {
				status: 'unauthorized',
				details: mocks.unauthorized,
			},
			onAuthorize: undefined,
		});

		const title = await screen.findByTestId(titleTestId);
		expect(title).toHaveTextContent(url);

		const description = await screen.findByTestId(descriptionTestId);
		expect(description).toHaveTextContent(
			"You're trying to preview a link to a private page. We recommend you review the URL or contact the page owner.",
		);

		const button = screen.queryByTestId(buttonTestId);
		expect(button).not.toBeInTheDocument();
	});

	it('should capture and report a11y violations', async () => {
		const { container } = renderWithIntl(
			<SmartCardProvider>
				<UnauthorisedView
					cardState={
						{
							status: 'unauthorized',
							details: {
								...mocks.unauthorized,
								data: {
									...mocks.unauthorized.data,
									generator: {
										'@type': 'Application',
										icon: {
											'@type': 'Image',
											url: 'https://some.icon.url',
										},
										name: '3P',
									},
								},
							},
						} as CardState
					}
					onAuthorize={() => {}}
					url={url}
				/>
			</SmartCardProvider>,
		);
		await expect(container).toBeAccessible();
	});
});
