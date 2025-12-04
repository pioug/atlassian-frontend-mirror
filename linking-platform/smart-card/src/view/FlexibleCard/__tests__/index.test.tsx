import React from 'react';

import { render, screen } from '@testing-library/react';

import { SmartCardProvider } from '@atlaskit/link-provider';
import { type CardState } from '@atlaskit/linking-common';

import { getCardTestWrapper } from '../../../__tests__/__utils__/unit-testing-library-helpers';
import { SmartLinkStatus } from '../../../constants';
import { TitleBlock } from '../components/blocks';
import FlexibleCard from '../index';

describe('FlexibleCard', () => {
	const title = 'some-name';
	const url = 'http://some-url.com';

	it('renders flexible card', async () => {
		const cardState: CardState = {
			status: 'resolved',
			details: {
				meta: {
					access: 'granted',
					visibility: 'public',
				},
				data: {
					'@type': 'Object',
					'@context': {
						'@vocab': 'https://www.w3.org/ns/activitystreams#',
						atlassian: 'https://schema.atlassian.com/ns/vocabulary#',
						schema: 'http://schema.org/',
					},
					url,
					name: title,
				},
			},
		};

		render(
			<FlexibleCard cardState={cardState} url={url}>
				<TitleBlock />
			</FlexibleCard>,
			{ wrapper: getCardTestWrapper() },
		);

		const container = screen.getByTestId('smart-links-container');
		const titleBlock = screen.getByTestId('smart-block-title-resolved-view');

		expect(container).toBeTruthy();
		expect(titleBlock).toBeTruthy();
		expect(titleBlock).toHaveTextContent(title);
	});

	describe('hover preview', () => {
		it('should capture and report a11y violations', async () => {
			const cardState: CardState = {
				status: 'resolved',
				details: {
					meta: {
						access: 'granted',
						visibility: 'public',
					},
					data: {
						'@type': 'Object',
						'@context': {
							'@vocab': 'https://www.w3.org/ns/activitystreams#',
							atlassian: 'https://schema.atlassian.com/ns/vocabulary#',
							schema: 'http://schema.org/',
						},
						url,
						name: title,
					},
				},
			};
			const { container } = render(
				<FlexibleCard cardState={cardState} url={url}>
					<TitleBlock />
				</FlexibleCard>,
				{ wrapper: getCardTestWrapper() },
			);

			await expect(container).toBeAccessible();
		});

		it('should not render a hover preview when parameter is not provided', async () => {
			const cardState: CardState = {
				status: 'resolved',
				details: {
					meta: {
						access: 'granted',
						visibility: 'public',
					},
					data: {
						'@type': 'Object',
						'@context': {
							'@vocab': 'https://www.w3.org/ns/activitystreams#',
							atlassian: 'https://schema.atlassian.com/ns/vocabulary#',
							schema: 'http://schema.org/',
						},
						url,
						name: title,
					},
				},
			};

			render(
				<FlexibleCard cardState={cardState} url={url}>
					<TitleBlock />
				</FlexibleCard>,
				{ wrapper: getCardTestWrapper() },
			);

			expect(screen.queryByTestId('hover-card-trigger-wrapper')).not.toBeInTheDocument();
		});

		it('should render a hover preview when its prop is enabled and link is included', async () => {
			const cardState: CardState = {
				status: 'resolved',
				details: {
					meta: {
						access: 'granted',
						visibility: 'public',
					},
					data: {
						'@type': 'Object',
						'@context': {
							'@vocab': 'https://www.w3.org/ns/activitystreams#',
							atlassian: 'https://schema.atlassian.com/ns/vocabulary#',
							schema: 'http://schema.org/',
						},
						url,
						name: title,
					},
				},
			};

			render(
				<FlexibleCard showHoverPreview={true} cardState={cardState} url={url}>
					<TitleBlock />
				</FlexibleCard>,
				{ wrapper: getCardTestWrapper() },
			);

			expect(await screen.findByTestId('hover-card-trigger-wrapper')).toBeInTheDocument();
		});

		it('should not render a hover preview when its prop is diabled and link is included', async () => {
			const cardState: CardState = {
				status: 'resolved',
				details: {
					meta: {
						access: 'granted',
						visibility: 'public',
					},
					data: {
						'@type': 'Object',
						'@context': {
							'@vocab': 'https://www.w3.org/ns/activitystreams#',
							atlassian: 'https://schema.atlassian.com/ns/vocabulary#',
							schema: 'http://schema.org/',
						},
						url,
						name: title,
					},
				},
			};

			render(
				<FlexibleCard showHoverPreview={false} cardState={cardState} url={url}>
					<TitleBlock />
				</FlexibleCard>,
				{ wrapper: getCardTestWrapper() },
			);

			expect(screen.queryByTestId('hover-card-trigger-wrapper')).not.toBeInTheDocument();
		});

		it('should not render a hover preview when url is not provided in context', async () => {
			const cardState: CardState = {
				status: 'resolved',
				details: {
					meta: {
						access: 'granted',
						visibility: 'public',
					},
					data: {
						'@type': 'Object',
						'@context': {
							'@vocab': 'https://www.w3.org/ns/activitystreams#',
							atlassian: 'https://schema.atlassian.com/ns/vocabulary#',
							schema: 'http://schema.org/',
						},
						name: title,
					},
				},
			};

			render(
				<FlexibleCard showHoverPreview={true} cardState={cardState} url={url}>
					<TitleBlock />
				</FlexibleCard>,
				{ wrapper: ({ children }) => <SmartCardProvider>{children}</SmartCardProvider> },
			);

			expect(screen.queryByTestId('hover-card-trigger-wrapper')).not.toBeInTheDocument();
		});
	});

	describe('status', () => {
		it('triggers onResolve callback on resolved', async () => {
			const onResolve = jest.fn();
			const cardState = {
				status: SmartLinkStatus.Resolved,
				details: { meta: {}, data: { name: title, url } },
			} as CardState;

			render(
				<FlexibleCard cardState={cardState} onResolve={onResolve} url={url}>
					<TitleBlock />
				</FlexibleCard>,
				{ wrapper: getCardTestWrapper() },
			);

			expect(onResolve).toHaveBeenCalledWith({ title, url });
		});

		it.each([
			[SmartLinkStatus.Errored],
			[SmartLinkStatus.Fallback],
			[SmartLinkStatus.Forbidden],
			[SmartLinkStatus.NotFound],
			[SmartLinkStatus.Unauthorized],
		])('triggers onError callback with %s status', async (status: SmartLinkStatus) => {
			const onError = jest.fn();
			const cardState = {
				status,
				details: { meta: {}, data: { url } },
			} as CardState;

			render(
				<FlexibleCard cardState={cardState} onError={onError} url={url}>
					<TitleBlock />
				</FlexibleCard>,
				{ wrapper: getCardTestWrapper() },
			);

			expect(onError).toHaveBeenCalledWith({ status, url });
		});
	});

	describe('placeholderData prop', () => {
		const placeholderTitle = 'placeholder-title';
		const placeholderUrl = 'http://placeholder-url.com';
		const placeholderCardState: CardState['details'] = {
			meta: {
				access: 'granted',
				visibility: 'public',
			},
			data: {
				'@type': 'Object',
				'@context': {
					'@vocab': 'https://www.w3.org/ns/activitystreams#',
					atlassian: 'https://schema.atlassian.com/ns/vocabulary#',
					schema: 'http://schema.org/',
				},
				url: placeholderUrl,
				name: placeholderTitle,
			},
		};

		const pendingCardState: CardState = {
			status: 'pending',
			details: {
				meta: {
					access: 'granted',
					visibility: 'public',
				},
				data: {
					'@type': 'Object',
					'@context': {
						'@vocab': 'https://www.w3.org/ns/activitystreams#',
						atlassian: 'https://schema.atlassian.com/ns/vocabulary#',
						schema: 'http://schema.org/',
					},
					url,
					name: title,
				},
			},
		};

		it('should use placeholder data when card is in pending status', () => {
			render(
				<FlexibleCard cardState={pendingCardState} url={url} placeholderData={placeholderCardState}>
					<TitleBlock />
				</FlexibleCard>,
				{ wrapper: getCardTestWrapper() },
			);

			const titleBlock = screen.getByTestId('smart-block-title-resolved-view');
			expect(titleBlock).toHaveTextContent(placeholderTitle);
		});

		it('should use placeholder data when card is in resolving status', () => {
			const resolvingCardState: CardState = {
				...pendingCardState,
				status: 'resolving',
			};

			render(
				<FlexibleCard
					cardState={resolvingCardState}
					url={url}
					placeholderData={placeholderCardState}
				>
					<TitleBlock />
				</FlexibleCard>,
				{ wrapper: getCardTestWrapper() },
			);

			const titleBlock = screen.getByTestId('smart-block-title-resolved-view');
			expect(titleBlock).toHaveTextContent(placeholderTitle);
		});

		it('should not use placeholder data when card is in resolved status', () => {
			const resolvedCardState: CardState = {
				...pendingCardState,
				status: 'resolved',
			};

			render(
				<FlexibleCard
					cardState={resolvedCardState}
					url={url}
					placeholderData={placeholderCardState}
				>
					<TitleBlock />
				</FlexibleCard>,
				{ wrapper: getCardTestWrapper() },
			);

			const titleBlock = screen.getByTestId('smart-block-title-resolved-view');
			expect(titleBlock).toHaveTextContent(title);
			expect(titleBlock).not.toHaveTextContent(placeholderTitle);
		});

		it('should not use placeholder data when placeholderData is not provided', () => {
			render(
				<FlexibleCard cardState={pendingCardState} url={url}>
					<TitleBlock />
				</FlexibleCard>,
				{ wrapper: getCardTestWrapper() },
			);

			// Should render the pending state, not resolved state
			expect(screen.queryByTestId('smart-block-title-resolved-view')).not.toBeInTheDocument();
		});

		it('should not trigger onResolve callback with placeholder data', () => {
			const onResolve = jest.fn();

			render(
				<FlexibleCard
					cardState={pendingCardState}
					url={url}
					placeholderData={placeholderCardState}
					onResolve={onResolve}
				>
					<TitleBlock />
				</FlexibleCard>,
				{ wrapper: getCardTestWrapper() },
			);

			expect(onResolve).not.toHaveBeenCalledWith({
				title: placeholderTitle,
				url: placeholderUrl,
			});
		});

		it('should trigger onResolve callback with resolved data', () => {
			const onResolve = jest.fn();
			const resolvedCardState: CardState = {
				...pendingCardState,
				status: 'resolved',
			};

			render(
				<FlexibleCard
					cardState={resolvedCardState}
					url={url}
					placeholderData={placeholderCardState}
					onResolve={onResolve}
				>
					<TitleBlock />
				</FlexibleCard>,
				{ wrapper: getCardTestWrapper() },
			);

			expect(onResolve).toHaveBeenCalledTimes(1);
			expect(onResolve).toHaveBeenCalledWith({ title, url });
		});

		it('should trigger onError callback when resolved data is errored', () => {
			const onError = jest.fn();
			const erroredCardState: CardState = {
				status: 'errored',
				details: {
					meta: {
						access: 'forbidden',
						visibility: 'restricted',
					},
					data: {
						'@type': 'Object',
						'@context': {
							'@vocab': 'https://www.w3.org/ns/activitystreams#',
							atlassian: 'https://schema.atlassian.com/ns/vocabulary#',
							schema: 'http://schema.org/',
						},
					},
				},
			};

			render(
				<FlexibleCard
					cardState={erroredCardState}
					url={url}
					placeholderData={placeholderCardState}
					onError={onError}
				>
					<TitleBlock />
				</FlexibleCard>,
				{ wrapper: getCardTestWrapper() },
			);

			expect(onError).toHaveBeenCalledTimes(1);
			expect(onError).toHaveBeenCalledWith({ status: 'errored', url });
		});
	});
});
