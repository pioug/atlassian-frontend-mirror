import React from 'react';

import { fireEvent, screen, within } from '@testing-library/react';
import { type JsonLd } from 'json-ld-types';

import { AnalyticsListener } from '@atlaskit/analytics-next';
import { type CardState } from '@atlaskit/linking-common';
import {
	expectFunctionToHaveBeenCalledWith,
	type JestFunction,
} from '@atlaskit/media-test-helpers';
import { renderWithIntl } from '@atlaskit/media-test-helpers/renderWithIntl';
import { setGlobalTheme } from '@atlaskit/tokens';

import {
	CONTENT_URL_3P_ACCOUNT_AUTH,
	CONTENT_URL_SECURITY_AND_PERMISSIONS,
} from '../../../constants';
import { PROVIDER_KEYS_WITH_THEMING } from '../../../extractors/constants';
import { ANALYTICS_CHANNEL } from '../../../utils/analytics';
import { mockAnalytics } from '../../../utils/mocks';
import { EmbedCard } from '../index';
import { type EmbedCardProps } from '../types';

import '@atlaskit/link-test-helpers/jest';

const baseData: JsonLd.Response['data'] = {
	'@type': 'Object',
	'@context': {
		'@vocab': 'https://www.w3.org/ns/activitystreams#',
		atlassian: 'https://schema.atlassian.com/ns/vocabulary#',
		schema: 'http://schema.org/',
	},
};

const setup = (cardState: CardState, url: string, props?: Partial<EmbedCardProps>) => {
	const handleFrameClickMock = jest.fn();
	const onResolveMock: JestFunction<Required<EmbedCardProps>['onResolve']> = jest.fn();
	const ref = React.createRef<HTMLIFrameElement>();
	const onEventMock = jest.fn();
	window.open = jest.fn();

	setGlobalTheme({ colorMode: 'dark' });

	const renderResult = renderWithIntl(
		<AnalyticsListener onEvent={onEventMock} channel={ANALYTICS_CHANNEL}>
			<EmbedCard
				url={url}
				cardState={cardState}
				isSelected={true}
				frameStyle="show"
				inheritDimensions={true}
				handleAuthorize={jest.fn()}
				handleErrorRetry={jest.fn()}
				handleFrameClick={handleFrameClickMock}
				analytics={mockAnalytics}
				handleInvoke={jest.fn()}
				onResolve={onResolveMock}
				ref={ref}
				{...props}
			/>
		</AnalyticsListener>,
	);

	const iframeEl = screen.queryByTestId('embed-card-resolved-view-frame') as HTMLIFrameElement;
	if (iframeEl) {
		Object.defineProperty(iframeEl, 'clientWidth', { value: 400 });
	}

	return {
		...renderResult,
		handleFrameClickMock,
		iframeEl,
		onResolveMock,
		onEventMock,
		ref,
	};
};

describe('EmbedCard view component', () => {
	describe('resolved embed with preview', () => {
		const expectedUrl = 'http://some-url.com';
		const expectedName = 'some-name';
		const expectedPreviewUrl = 'http://some-preview-url.com';

		const cardStateOverride: CardState = {
			status: 'resolved',
			details: {
				meta: {
					access: 'granted',
					visibility: 'public',
				},
				data: {
					...baseData,
					url: expectedUrl,
					name: expectedName,
					preview: {
						'@type': 'Link',
						href: expectedPreviewUrl,
						'atlassian:aspectRatio': 0.72,
					},
				},
			},
		};

		it('should render resolved view', () => {
			const { getByTestId, iframeEl } = setup(cardStateOverride, expectedUrl);

			const resolveView = getByTestId('embed-card-resolved-view');
			expect(resolveView).toBeTruthy();
			if (!iframeEl) {
				return expect(iframeEl).toBeDefined();
			}
			expect(iframeEl.src).toEqual('http://some-preview-url.com/');
			expect(resolveView.getAttribute('data-is-selected')).toBe('true');
			// Asserting result of inheritDimensions=true
			expect(window.getComputedStyle(resolveView).getPropertyValue('height')).toEqual('100%');
		});

		describe('FF fix embed preview url query params', () => {
			it.each([PROVIDER_KEYS_WITH_THEMING])(
				'should add themeState query param if theming is supported',
				(providerKey) => {
					const cardStateOverrideWithThemeSupport: any = {
						...cardStateOverride,
						details: {
							...cardStateOverride.details,
							meta: {
								key: providerKey,
								access: 'granted',
								visibility: 'public',
							},
						},
					};
					const { iframeEl } = setup(cardStateOverrideWithThemeSupport, expectedUrl);

					expect(iframeEl.getAttribute('src')).toEqual(
						`${expectedPreviewUrl}/?themeState=dark%3Adark+light%3Alight+spacing%3Aspacing+colorMode%3Adark`,
					);
				},
			);

			it('should not add theme query param if theming is not supported', () => {
				const cardStateOverrideWithThemeSupport: any = {
					...cardStateOverride,
					details: {
						...cardStateOverride.details,
						meta: {
							key: 'not-supported-provider',
							access: 'granted',
							visibility: 'public',
						},
					},
				};
				const { iframeEl } = setup(cardStateOverrideWithThemeSupport, expectedUrl);
				expect(iframeEl.getAttribute('src')).toEqual(expectedPreviewUrl);
			});
		});

		it('should call handleFrameClick when title is clicked', () => {
			const { getByText, handleFrameClickMock } = setup(cardStateOverride, expectedUrl);
			fireEvent.click(getByText(expectedName));
			expect(handleFrameClickMock).toHaveBeenCalled();
		});

		it('should call onResolve right away', () => {
			const { onResolveMock } = setup(cardStateOverride, expectedUrl);
			expectFunctionToHaveBeenCalledWith(onResolveMock, [
				{
					title: expectedName,
					url: expectedUrl,
					aspectRatio: 0.72,
				},
			]);
		});

		it('should pass iframe ref down to resolved view', () => {
			const { iframeEl, ref } = setup(cardStateOverride, expectedUrl);
			expect(iframeEl).toBe(ref.current);
		});
	});

	describe('forbidden embed', () => {
		const expectedUrl = 'https://trellis.coffee/b/gNwMppQL';
		const expectedPreview = 'https://trellis.coffee/b/gNwMppQL?iframeSource=atlassian-smart-link';

		const getForbiddenCardState = (preview: string | undefined): CardState => ({
			status: 'forbidden',
			details: {
				meta: {
					visibility: 'restricted',
					access: 'forbidden',
					requestAccess: {
						accessType: 'REQUEST_ACCESS',
					},
				},
				data: {
					...baseData,
					url: expectedUrl,
					...(preview ? { preview } : {}),
				},
			},
		});

		it('renders forbidden view with default image', () => {
			const cardState = getForbiddenCardState(undefined);
			setup(cardState, expectedUrl);
			const view = screen.getByTestId('embed-card-forbidden-view');
			expect(view).toBeTruthy();

			const image = screen.getByTestId('embed-card-forbidden-view-unresolved-image');
			const svg = within(image).getByTestId('forbidden-svg');
			expect(svg).toBeInTheDocument();
		});

		it('should render resolved view with preview', () => {
			const cardState = getForbiddenCardState(expectedPreview);
			const { getByTestId, iframeEl } = setup(cardState, expectedUrl);

			const resolveView = getByTestId('embed-card-resolved-view');
			expect(resolveView).toBeTruthy();
			if (!iframeEl) {
				return expect(iframeEl).toBeDefined();
			}
			expect(iframeEl.src).toEqual(expectedPreview);
		});

		it('should render forbidden view without preview', () => {
			const cardState = getForbiddenCardState(undefined);
			const { getByTestId } = setup(cardState, expectedUrl);
			const forbiddenView = getByTestId('embed-card-forbidden-view');
			expect(forbiddenView).toBeTruthy();
		});

		it('fires buttonClicked event on click of the request access button', () => {
			const cardState = getForbiddenCardState(undefined);

			const { getByTestId, onEventMock } = setup(cardState, expectedUrl);
			const requestAccessButton = getByTestId('button-request_access');
			fireEvent.click(requestAccessButton);

			expect(onEventMock).toBeFiredWithAnalyticEventOnce({
				payload: {
					action: 'clicked',
					actionSubject: 'button',
					actionSubjectId: 'requestAccess',
					eventType: 'ui',
				},
			});
		});
	});

	describe('unauthorised embed', () => {
		const expectedUrl = 'https://some.url';
		const imageTestId = 'embed-card-unauthorized-view-unresolved-image';
		const titleTestId = 'embed-card-unauthorized-view-unresolved-title';
		const descriptionTestId = 'embed-card-unauthorized-view-unresolved-description';
		const buttonTestId = 'connect-account';

		const getUnauthorizedCardState = ({
			image,
			hideProviderName,
			hasScopeOverrides,
		}: {
			image?: JsonLd.Primitives.Image;
			hideProviderName?: boolean;
			hasScopeOverrides?: boolean;
		} = {}): CardState => ({
			status: 'unauthorized',
			details: {
				meta: {
					access: 'unauthorized',
					visibility: 'restricted',
					hasScopeOverrides,
				},
				data: {
					...baseData,
					generator: {
						'@type': 'Application',
						icon: {
							'@type': 'Image',
							url: 'https://some.icon.url',
						},
						...(image ? { image } : {}),
						...(!hideProviderName ? { name: '3P' } : {}),
					},
					url: expectedUrl,
				},
			},
		});

		it('renders unauthorised view with default image', () => {
			const cardState = getUnauthorizedCardState();
			const { getByTestId } = setup(cardState, expectedUrl);
			const unauthorizedView = getByTestId('embed-card-unauthorized-view');
			expect(unauthorizedView).toBeTruthy();

			const image = getByTestId(imageTestId);
			const svg = within(image).getByTestId('unauthorized-svg');
			expect(svg).toBeInTheDocument();
		});

		it('renders unauthorised view with provider image', () => {
			const expectedImageUrl = 'https://image-url';
			const cardState = getUnauthorizedCardState({
				image: {
					'@type': 'Image',
					url: expectedImageUrl,
				},
			});
			const { getByTestId } = setup(cardState, expectedUrl);

			const unauthorizedView = getByTestId('embed-card-unauthorized-view');
			expect(unauthorizedView).toBeTruthy();

			const unauthorizedViewImage = getByTestId(imageTestId);
			expect(unauthorizedViewImage.getAttribute('src')).toBe(expectedImageUrl);
		});

		it('renders unauthorised view messages', () => {
			const cardState = getUnauthorizedCardState();
			const { getByTestId } = setup(cardState, expectedUrl);

			const unauthorizedView = getByTestId('embed-card-unauthorized-view');
			expect(unauthorizedView).toBeTruthy();

			const title = getByTestId(titleTestId);
			expect(title.textContent).toBe('Connect your 3P account');

			const description = getByTestId(descriptionTestId);
			expect(description.textContent).toBe(
				'Connect your 3P account to collaborate on work across Atlassian products. Learn more about Smart Links.',
			);

			const action = getByTestId(buttonTestId);
			expect(action.textContent).toBe('Connect to 3P');
		});

		it('renders learn more anchor', () => {
			const cardState = getUnauthorizedCardState();
			const { getByTestId } = setup(cardState, expectedUrl);

			const unauthorizedView = getByTestId('embed-card-unauthorized-view');
			expect(unauthorizedView).toBeTruthy();

			const anchor = getByTestId('embed-card-unauthorized-view-learn-more');
			expect(anchor.getAttribute('href')).toBe(CONTENT_URL_SECURITY_AND_PERMISSIONS);
		});

		it('renders alternative unauthorised message when `hasScopeOverrides` flag is present in the meta', () => {
			const cardState = getUnauthorizedCardState({ hasScopeOverrides: true });
			const { getByTestId } = setup(cardState, expectedUrl);

			const unauthorizedView = getByTestId('embed-card-unauthorized-view');
			expect(unauthorizedView).toBeTruthy();

			const title = getByTestId(titleTestId);
			expect(title.textContent).toBe('Connect your 3P account');

			const description = getByTestId(descriptionTestId);
			expect(description.textContent).toBe(
				'Connect your 3P account to collaborate on work across Atlassian products. Learn more about connecting your account to Atlassian products.',
			);

			const action = getByTestId(buttonTestId);
			expect(action.textContent).toBe('Connect to 3P');
		});

		it('renders learn more anchor with 3p auth url when `hasScopeOverrides` flag is provided in the meta', () => {
			const cardState = getUnauthorizedCardState({ hasScopeOverrides: true });
			const { getByTestId } = setup(cardState, expectedUrl);

			const unauthorizedView = getByTestId('embed-card-unauthorized-view');
			expect(unauthorizedView).toBeTruthy();

			const anchor = getByTestId('embed-card-unauthorized-view-learn-more');
			expect(anchor.getAttribute('href')).toBe(CONTENT_URL_3P_ACCOUNT_AUTH);
		});

		it('renders connect button', () => {
			const cardState = getUnauthorizedCardState();
			const { getByTestId } = setup(cardState, expectedUrl);

			const button = getByTestId(buttonTestId);
			expect(button).toBeInTheDocument();
		});

		it('renders unauthorised view without connect flow with provider name', () => {
			const cardState = getUnauthorizedCardState();
			const { getByTestId, queryByTestId } = setup(cardState, expectedUrl, {
				handleAuthorize: undefined,
			});

			const image = getByTestId(imageTestId);
			const svg = within(image).getByTestId('unauthorized-svg');
			expect(svg).toBeInTheDocument();

			const title = getByTestId(titleTestId);
			expect(title.textContent).toBe("We can't display private pages from 3P");

			const description = getByTestId(descriptionTestId);
			expect(description.textContent).toBe(
				"You're trying to preview a link to a private 3P page. We recommend you review the URL or contact the page owner.",
			);

			const button = queryByTestId(buttonTestId);
			expect(button).not.toBeInTheDocument();
		});

		it('renders unauthorised view without connect flow without provider name', () => {
			const cardState = getUnauthorizedCardState({ hideProviderName: true });
			const { getByTestId, queryByTestId } = setup(cardState, expectedUrl, {
				handleAuthorize: undefined,
			});

			const image = getByTestId(imageTestId);
			const svg = within(image).getByTestId('unauthorized-svg');
			expect(svg).toBeInTheDocument();

			const title = getByTestId(titleTestId);
			expect(title.textContent).toBe("We can't display private pages");

			const description = getByTestId(descriptionTestId);
			expect(description.textContent).toBe(
				"You're trying to preview a link to a private page. We recommend you review the URL or contact the page owner.",
			);

			const button = queryByTestId(buttonTestId);
			expect(button).not.toBeInTheDocument();
		});
	});

	describe('not found embed', () => {
		const expectedUrl = 'https://trellis.coffee/b/gNwMppQL';

		const getNotFoundCardState = (): CardState => ({
			status: 'not_found',
			details: {
				meta: {
					visibility: 'not_found',
					access: 'forbidden',
					auth: [],
				},
				data: {
					...baseData,
					url: expectedUrl,
				},
			},
		});

		it('renders not found view with default image', () => {
			const cardState = getNotFoundCardState();
			setup(cardState, expectedUrl);
			const view = screen.getByTestId('embed-card-not-found-view');
			expect(view).toBeTruthy();

			const image = screen.getByTestId('embed-card-not-found-view-unresolved-image');
			const svg = within(image).getByTestId('not-found-svg');
			expect(svg).toBeInTheDocument();
		});
	});
});
