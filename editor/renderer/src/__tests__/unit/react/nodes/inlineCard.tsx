import React from 'react';
import { mount, type ReactWrapper } from 'enzyme';
import { fireEvent, render, screen } from '@testing-library/react';
import { asMock } from '@atlaskit/link-test-helpers/jest';
import type { MockIntersectionObserverOpts } from '@atlaskit/link-test-helpers';
import { MockIntersectionObserverFactory } from '@atlaskit/link-test-helpers';

import { CardClient as Client, SmartCardProvider as Provider } from '@atlaskit/link-provider';
import { Card } from '@atlaskit/smart-card';
import { CardSSR } from '@atlaskit/smart-card/ssr';
import { Pressable } from '@atlaskit/primitives/compiled';

import InlineCard from '../../../../react/nodes/inlineCard';
import { AnalyticsListener } from '@atlaskit/analytics-next';
import { MockCardComponent } from './card.mock';
import type { EventHandlers } from '@atlaskit/editor-common/ui';
import { ffTest } from '@atlassian/feature-flags-test-utils';

jest.mock('@atlaskit/smart-card', () => {
	const originalModule = jest.requireActual('@atlaskit/smart-card');
	return {
		...originalModule,
		Card: jest.fn((props) => <originalModule.Card {...props} />),
	};
});

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

describe('Renderer - React/Nodes/InlineCard', () => {
	let node: ReactWrapper;

	afterEach(() => {
		node.unmount();
	});

	it('should render a <span>-tag', () => {
		node = mount(<InlineCard url={url} />);
		expect(node.getDOMNode()['tagName']).toEqual('SPAN');
	});

	it('should render with url if prop exists', () => {
		node = mount(<InlineCard url={url} />);
		expect(node.find(InlineCard).prop('url')).toEqual(url);
	});

	it('should render with onClick if eventHandlers has correct event key', () => {
		const mockedOnClick = jest.fn();
		const mockedEvent = { target: {} };
		node = mount(
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

		const onClick = node.find(Card).prop('onClick');

		onClick(mockedEvent);

		expect(mockedOnClick).toHaveBeenCalledWith(mockedEvent, url);
	});

	it('should render with onClick as undefined if eventHandlers is not present', () => {
		node = mount(
			<Provider client={new Client('staging')}>
				<InlineCard url={url} />{' '}
			</Provider>,
		);

		expect(node.find(Card).prop('onClick')).toBeUndefined();
	});

	it('should render with showHoverPreview if hideHoverPreview is false', () => {
		node = mount(
			<Provider client={new Client('staging')}>
				<InlineCard url={url} smartLinks={{ hideHoverPreview: false }} />
			</Provider>,
		);
		expect(node.find(Card).prop('showHoverPreview')).toEqual(true);
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

		expect(Card).toHaveBeenLastCalledWith(
			expect.objectContaining({
				showHoverPreview: true,
			}),
			expect.anything(),
		);
	});

	it('should not render with hover card if hideHoverPreview is defined in smartLinks options', () => {
		render(
			<Provider client={new Client('staging')}>
				<InlineCard url={url} smartLinks={{ hideHoverPreview: true }} />
			</Provider>,
		);

		expect(Card).toHaveBeenLastCalledWith(
			expect.objectContaining({
				showHoverPreview: false,
			}),
			expect.anything(),
		);
	});

	it('should use Card SSR component for ssr mode', async () => {
		const mockedOnClick = jest.fn();
		const mockEventHandlers: EventHandlers = {
			smartCard: { onClick: mockedOnClick },
		};

		class CustomClient extends Client {
			fetchData(url: string) {
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

		expect(CardSSR).toHaveBeenLastCalledWith(
			expect.objectContaining({
				url,
				appearance: 'inline',
				showHoverPreview: true,
				onClick: expect.any(Function),
			}),
			expect.anything(),
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
				<InlineCard url="https://atlassian.com" />
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

	ffTest.on('prompt_whiteboard_competitor_link_gate', '', () => {
		it('should render when CompetitorPrompt provided and feature gate is on', () => {
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

	ffTest.off('prompt_whiteboard_competitor_link_gate', '', () => {
		it('should not render CompetitorPrompt when feature gate is off', () => {
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

			expect(screen.queryByRole('button', { name: 'competitor prompt' })).not.toBeInTheDocument();
			expect(MockCompetitorPrompt).not.toHaveBeenCalled();
		});
	});
});
