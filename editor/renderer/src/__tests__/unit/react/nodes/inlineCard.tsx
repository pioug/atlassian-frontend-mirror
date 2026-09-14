import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { asMock } from '@atlaskit/link-test-helpers/jest';
import type { MockIntersectionObserverOpts } from '@atlaskit/link-test-helpers';
import { MockIntersectionObserverFactory } from '@atlaskit/link-test-helpers';

import Client from '@atlaskit/link-provider/client';
import { SmartCardProvider as Provider } from '@atlaskit/link-provider/smart-card-provider';
import { Card } from '@atlaskit/smart-card';
import { CardSSR } from '@atlaskit/smart-card/ssr';
import { Pressable } from '@atlaskit/primitives/compiled';

import InlineCard from '../../../../react/nodes/inlineCard';
import { CardErrorBoundary } from '../../../../react/nodes/fallback';
import { getCardClickHandler } from '../../../../react/utils/getCardClickHandler';
import AnalyticsListener from '@atlaskit/analytics-next/AnalyticsListener';
import { MockCardComponent } from './card.mock';
import type { EventHandlers } from '@atlaskit/editor-common/ui';

jest.mock('@atlaskit/smart-card', () => {
	const originalModule = jest.requireActual('@atlaskit/smart-card');
	return {
		...originalModule,
		Card: jest.fn((props) => <originalModule.Card {...props} />),
	};
});

jest.mock('../../../../react/nodes/fallback', () => {
	const actual = jest.requireActual('../../../../react/nodes/fallback');
	return {
		CardErrorBoundary: jest.fn((props) => <actual.CardErrorBoundary {...props} />),
	};
});

jest.mock('@atlaskit/editor-common/provider-factory', () => ({
	...jest.requireActual('@atlaskit/editor-common/provider-factory'),
	useProvider: jest.fn(),
}));

jest.mock('@atlaskit/smart-card/ssr', () => {
	const originalModule = jest.requireActual('@atlaskit/smart-card/ssr');
	return {
		...originalModule,
		CardSSR: jest.fn((props) => <originalModule.CardSSR {...props} />),
	};
});

const url = 'https://extranet.atlassian.com/pages/viewpage.action?pageId=3088533424';

const data = {
	'@context': {
		'@vocab': 'https://www.w3.org/ns/activitystreams#',
		atlassian: 'https://schema.atlassian.com/ns/vocabulary#',
		schema: 'http://schema.org/',
	},
	'@type': 'Document',
	generator: {
		'@type': 'Application',
		name: 'Confluence',
	},
	url,
	name: 'Founder Update 76: Hello, Trello!',
	summary:
		'Today is a big day for Atlassian – we have entered into an agreement to buy Trello. (boom)',
};

// eslint-disable-next-line @atlassian/a11y/require-jest-coverage
describe('Renderer - React/Nodes/InlineCard', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('should render a <span>-tag', () => {
		const { container } = render(
			<Provider client={new Client('staging')}>
				<InlineCard url={url} />
			</Provider>,
		);

		expect(container.querySelector('[data-inline-card]')?.tagName).toEqual('SPAN');
	});

	it('should render with url if prop exists', () => {
		render(
			<Provider client={new Client('staging')}>
				<InlineCard url={url} />
			</Provider>,
		);

		expect((Card as unknown as jest.Mock).mock.lastCall?.[0]).toEqual(
			expect.objectContaining({ url }),
		);
	});

	it('should render with onClick if eventHandlers has correct event key', () => {
		const mockedOnClick = jest.fn();
		const mockedEvent = { target: {} };
		render(
			<Provider client={new Client('staging')}>
				<InlineCard
					url={url}
					eventHandlers={{
						smartCard: {
							onClick: mockedOnClick,
						},
					}}
				/>{' '}
			</Provider>,
		);

		const { onClick } = asMock(Card).mock.lastCall![0];

		onClick(mockedEvent);

		expect(mockedOnClick).toHaveBeenCalledWith(mockedEvent, url);
	});

	it('should pass consumer onClick (not Card onClick) to CardErrorBoundary', () => {
		const mockedOnClick = jest.fn();
		const mockedEvent = { target: {} } as unknown as React.MouseEvent<HTMLElement>;
		render(
			<Provider client={new Client('staging')}>
				<InlineCard
					url={url}
					eventHandlers={{
						smartCard: {
							onClick: mockedOnClick,
						},
					}}
				/>{' '}
			</Provider>,
		);

		// CardErrorBoundary.onClick must be (e, url?: string) — the consumer-facing shape,
		// not the Card/CardSSR shape (e, { destinationUrl? }).
		// When CardErrorBoundary's fallback link is clicked, it calls onClick(e, url)
		// using the ADF url from props.
		asMock(CardErrorBoundary).mock.lastCall![0].onClick(mockedEvent, url);

		expect(mockedOnClick).toHaveBeenCalledWith(mockedEvent, url);
	});

	it('should render with onClick as undefined if eventHandlers is not present', () => {
		render(
			<Provider client={new Client('staging')}>
				<InlineCard url={url} />{' '}
			</Provider>,
		);

		expect(asMock(Card).mock.lastCall![0].onClick).toBeUndefined();
	});

	it('should render with showHoverPreview if hideHoverPreview is false', () => {
		render(
			<Provider client={new Client('staging')}>
				<InlineCard url={url} smartLinks={{ hideHoverPreview: false }} />
			</Provider>,
		);

		expect((Card as unknown as jest.Mock).mock.lastCall?.[0]).toEqual(
			expect.objectContaining({ showHoverPreview: true }),
		);
	});
});

describe('Renderer - React/Nodes/InlineCard (RTL)', () => {
	let mockGetEntries: jest.Mock;
	let mockIntersectionObserverOpts: MockIntersectionObserverOpts;

	beforeEach(() => {
		mockGetEntries = jest.fn().mockImplementation(() => [{ isIntersecting: true }]);
		mockIntersectionObserverOpts = {
			disconnect: jest.fn(),
			getMockEntries: mockGetEntries,
		};
		window.IntersectionObserver = MockIntersectionObserverFactory(mockIntersectionObserverOpts);
	});

	afterEach(() => {
		jest.restoreAllMocks();
	});

	it('should render with hover card if hideHoverPreview is not defined in smartLinks options', () => {
		render(
			<Provider client={new Client('staging')}>
				<InlineCard url={url} />
			</Provider>,
		);

		expect((Card as unknown as jest.Mock).mock.lastCall?.[0]).toEqual(
			expect.objectContaining({
				showHoverPreview: true,
			}),
		);
	});

	it('should not render with hover card if hideHoverPreview is defined in smartLinks options', () => {
		render(
			<Provider client={new Client('staging')}>
				<InlineCard url={url} smartLinks={{ hideHoverPreview: true }} />
			</Provider>,
		);

		expect((Card as unknown as jest.Mock).mock.lastCall?.[0]).toEqual(
			expect.objectContaining({
				showHoverPreview: false,
			}),
		);
	});

	it('should use Card SSR component for ssr mode', async () => {
		const mockedOnClick = jest.fn();
		const mockEventHandlers: EventHandlers = {
			smartCard: { onClick: mockedOnClick },
		};

		class CustomClient extends Client {
			fetchData() {
				return Promise.resolve({
					data,
					meta: {
						visibility: 'public',
						access: 'granted',
						auth: [],
						definitionId: 'd1',
						key: 'object-provider',
					},
				}) as ReturnType<Client['fetchData']>;
			}
		}

		const { findByTestId } = render(
			<Provider client={new CustomClient()}>
				<InlineCard
					url={url}
					smartLinks={{
						ssr: true,
						hideHoverPreview: false,
					}}
					eventHandlers={mockEventHandlers}
				/>
			</Provider>,
		);

		expect((CardSSR as unknown as jest.Mock).mock.lastCall?.[0]).toEqual(
			expect.objectContaining({
				url,
				appearance: 'inline',
				showHoverPreview: true,
				onClick: expect.any(Function),
			}),
		);

		const card = await findByTestId('inline-card-resolved-view');
		fireEvent.click(card);
		expect(mockedOnClick).toHaveBeenCalled();
	});
});

describe('Renderer - React/Nodes/InlineCard - analytics context', () => {
	afterEach(() => {
		jest.restoreAllMocks();
	});

	it('should fire renderer location attribute when rendered', async () => {
		asMock(Card).mockImplementation(MockCardComponent);
		const analyticsSpy = jest.fn();
		const expectedContext = [
			{
				attributes: {
					location: 'renderer',
				},
				location: 'renderer',
			},
		];

		render(
			<AnalyticsListener onEvent={analyticsSpy} channel={'atlaskit'}>
				<Provider client={new Client('staging')}>
					<InlineCard url="https://atlassian.com" />
				</Provider>
			</AnalyticsListener>,
		);

		expect(analyticsSpy).toBeFiredWithAnalyticEventOnce({
			payload: {
				action: 'rendered',
				actionSubject: 'link',
			},
			context: expectedContext,
		});
	});
});

describe('Renderer - React/Nodes/InlineCard - CompetitorPrompt', () => {
	const MockCompetitorPrompt = jest.fn(({ sourceUrl, linkType }) => (
		<Pressable
			type="button"
			aria-label="competitor prompt"
			data-source-url={sourceUrl}
			data-link-type={linkType}
		>
			{sourceUrl}
			{linkType}
		</Pressable>
	));

	beforeEach(() => {
		MockCompetitorPrompt.mockClear();
	});

	it('should render when CompetitorPrompt provided', () => {
		render(
			<Provider client={new Client('staging')}>
				<InlineCard
					url={'test.com'}
					smartLinks={{
						CompetitorPrompt: MockCompetitorPrompt,
					}}
				/>
			</Provider>,
		);

		const competitorPrompt = screen.getByRole('button', { name: 'competitor prompt' });
		expect(competitorPrompt).toBeInTheDocument();
		expect(competitorPrompt).toHaveTextContent('test.com');
		expect(competitorPrompt).toHaveTextContent('inline');
		expect(MockCompetitorPrompt).toHaveBeenCalled();
	});
});

describe('Renderer - React/Nodes/InlineCard - local cache useEffect', () => {
	const mockRefreshCache = jest.fn();
	const { useProvider } = require('@atlaskit/editor-common/provider-factory');

	beforeEach(() => {
		jest.clearAllMocks();
		(useProvider as jest.Mock).mockReturnValue(Promise.resolve({ refreshCache: mockRefreshCache }));
	});

	it('should call refreshCache with the inlineCard type and url', async () => {
		render(
			<Provider client={new Client('staging')}>
				<InlineCard url={url} />
			</Provider>,
		);

		// Flush the provider.then() microtask inside the useEffect
		await new Promise((resolve) => setTimeout(resolve, 0));

		expect(mockRefreshCache).toHaveBeenCalledWith({
			type: 'inlineCard',
			attrs: { url },
		});
	});

	it('should not call refreshCache when url is not provided', async () => {
		render(
			<Provider client={new Client('staging')}>
				<InlineCard />
			</Provider>,
		);

		await new Promise((resolve) => setTimeout(resolve, 0));

		expect(mockRefreshCache).not.toHaveBeenCalled();
	});
});

describe('Renderer - React/Nodes/InlineCard - getCardClickHandler with XPC URL wrapping', () => {
	const url = 'https://extranet.atlassian.com/pages/viewpage.action?pageId=3088533424';

	it('should call consumer onClick with destinationUrl from Card when provided', () => {
		const mockedOnClick = jest.fn();
		const mockedEvent = { target: {} } as unknown as React.MouseEvent<HTMLElement>;

		// Test getCardClickHandler directly — the Card mock calls onClick(e) without the
		// second argument, so we test the closure in isolation to verify the destinationUrl
		// extraction logic without the mock Card interfering.
		const onCardClick = getCardClickHandler({ smartCard: { onClick: mockedOnClick } }, url);

		// Card/CardSSR now calls onClick(e, { destinationUrl }) — simulate that
		onCardClick!(mockedEvent, {
			destinationUrl: 'https://resolved.com',
			url: 'https://original.com',
		});

		// Consumer (e.g. Confluence router) receives the resolved url, not the ADF url
		expect(mockedOnClick).toHaveBeenCalledWith(mockedEvent, 'https://resolved.com');
	});

	it('should fall back to ADF url when Card onClick fires with no destinationUrl', () => {
		const mockedOnClick = jest.fn();
		const mockedEvent = { target: {} } as unknown as React.MouseEvent<HTMLElement>;

		const onCardClick = getCardClickHandler({ smartCard: { onClick: mockedOnClick } }, url);

		// Card fires onClick with empty meta (no destinationUrl)
		onCardClick!(mockedEvent, {});

		// Falls back to the ADF node's url when destinationUrl is absent
		expect(mockedOnClick).toHaveBeenCalledWith(mockedEvent, url);
	});
});
