import React from 'react';
import { render } from '@testing-library/react';
import { asMock } from '@atlaskit/link-test-helpers/jest';
import { IntlProvider } from 'react-intl';

import Client from '@atlaskit/link-provider/client';
import { SmartCardProvider as Provider } from '@atlaskit/link-provider/smart-card-provider';
import { Card } from '@atlaskit/smart-card';

import BlockCard from '../../../../react/nodes/blockCard';
import { CardErrorBoundary } from '../../../../react/nodes/fallback';
import { getCardClickHandler } from '../../../../react/utils/getCardClickHandler';
import AnalyticsListener from '@atlaskit/analytics-next/AnalyticsListener';
import { MockCardComponent } from './card.mock';

import type { DatasourceAttributeProperties } from '@atlaskit/adf-schema/block-card';
import { DatasourceTableViewWithWrappers as DatasourceTableView } from '@atlaskit/link-datasource/datasource-table-view-with-wrappers';
import { JIRA_LIST_OF_LINKS_DATASOURCE_ID } from '@atlaskit/link-datasource/jira-issues-modal';
import { WidthContext } from '@atlaskit/editor-common/ui';
import { Pressable } from '@atlaskit/primitives/compiled';

jest.mock('../../../../react/nodes/fallback', () => {
	const actual = jest.requireActual('../../../../react/nodes/fallback');
	return {
		CardErrorBoundary: jest.fn((props) => <actual.CardErrorBoundary {...props} />),
	};
});

jest.mock('@atlaskit/link-datasource/datasource-table-view-with-wrappers', () => {
	const actual = jest.requireActual(
		'@atlaskit/link-datasource/datasource-table-view-with-wrappers',
	);
	return {
		...jest.requireActual('@atlaskit/link-datasource/datasource-table-view-with-wrappers'),
		DatasourceTableViewWithWrappers: jest.fn((props) => (
			<actual.DatasourceTableViewWithWrappers {...props} />
		)),
	};
});

jest.mock('@atlaskit/smart-card', () => {
	const originalModule = jest.requireActual('@atlaskit/smart-card');
	return {
		...originalModule,
		Card: jest.fn((props) => <originalModule.Card {...props} />),
	};
});

// eslint-disable-next-line @atlassian/a11y/require-jest-coverage
describe('Renderer - React/Nodes/BlockCard', () => {
	const url = 'https://extranet.atlassian.com/pages/viewpage.action?pageId=3088533424';

	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('should render a <div>-tag', () => {
		const { container } = render(
			<Provider client={new Client('staging')}>
				<BlockCard url={url} />
			</Provider>,
		);

		expect(container.querySelector('[data-block-card]')?.tagName).toEqual('DIV');
	});

	it('should render with url if prop exists', () => {
		render(
			<Provider client={new Client('staging')}>
				<BlockCard url={url} />
			</Provider>,
		);

		expect((Card as unknown as jest.Mock).mock.lastCall?.[0]).toEqual(
			expect.objectContaining({ url }),
		);
	});

	it('should render with onClick if eventHandlers has correct event key', async () => {
		const mockedOnClick = jest.fn();
		const mockedEvent = { target: {} };
		render(
			<Provider client={new Client('staging')}>
				<BlockCard
					url={url}
					eventHandlers={{
						smartCard: {
							onClick: mockedOnClick,
						},
					}}
				/>
			</Provider>,
		);

		const { onClick } = asMock(Card).mock.lastCall![0];

		onClick(mockedEvent);

		expect(mockedOnClick).toHaveBeenCalledWith(mockedEvent, url);
	});

	it('should pass consumer onClick (not Card onClick) to CardErrorBoundary', async () => {
		const mockedOnClick = jest.fn();
		const mockedEvent = { target: {} } as unknown as React.MouseEvent<HTMLElement>;
		render(
			<Provider client={new Client('staging')}>
				<BlockCard
					url={url}
					eventHandlers={{
						smartCard: {
							onClick: mockedOnClick,
						},
					}}
				/>
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
				<BlockCard url={url} />{' '}
			</Provider>,
		);

		expect(asMock(Card).mock.lastCall![0].onClick).toBeUndefined();
	});

	describe('rendering a datasource', () => {
		const datasourceAttributeProperties: DatasourceAttributeProperties = {
			id: 'mock-datasource-id',
			parameters: {
				cloudId: 'mock-cloud-id',
				jql: 'JQL=MOCK',
			},
			views: [
				{
					type: 'table',
					properties: {
						columns: [
							{ key: 'column-1', isWrapped: true },
							{ key: 'column-2', width: 42 },
						],
					},
				},
			],
		};

		it('should render a DatasourceTableView if datasource is provided with JQL and a table view', () => {
			const { container } = render(
				<Provider client={new Client('staging')}>
					<BlockCard url={url} datasource={datasourceAttributeProperties} />
				</Provider>,
			);

			expect(Card).not.toHaveBeenCalled();
			expect(container.querySelectorAll('[data-testid="renderer-datasource-table"]')).toHaveLength(
				1,
			);
			expect((DatasourceTableView as unknown as jest.Mock).mock.lastCall?.[0]).toEqual({
				onVisibleColumnKeysChange: undefined,
				onColumnResize: undefined,
				url: 'https://extranet.atlassian.com/pages/viewpage.action?pageId=3088533424',
				datasourceId: 'mock-datasource-id',
				parameters: {
					cloudId: 'mock-cloud-id',
					jql: 'JQL=MOCK',
				},
				visibleColumnKeys: ['column-1', 'column-2'],
				columnCustomSizes: {
					'column-2': 42,
				},
				wrappedColumnKeys: ['column-1'],
			});
		});

		it('should render a DatasourceTableView with undefined custom column sizes when none are defined in views', () => {
			const datasourceAttributePropertiesNoCustomSizes: DatasourceAttributeProperties = {
				id: 'mock-datasource-id',
				parameters: {
					cloudId: 'mock-cloud-id',
					jql: 'JQL=MOCK',
				},
				views: [
					{
						type: 'table',
						properties: {
							columns: [{ key: 'column-1' }, { key: 'column-2' }],
						},
					},
				],
			};

			const { container } = render(
				<Provider client={new Client('staging')}>
					<IntlProvider locale="en">
						<BlockCard url={url} datasource={datasourceAttributePropertiesNoCustomSizes} />
					</IntlProvider>
				</Provider>,
			);

			expect(Card).not.toHaveBeenCalled();
			expect(container.querySelectorAll('[data-testid="renderer-datasource-table"]')).toHaveLength(
				1,
			);
			expect(asMock(DatasourceTableView).mock.lastCall![0].columnCustomSizes).toBeUndefined();
		});

		it('should set the wrapper width as 100% when isNodeNested is set as true', () => {
			const { container } = render(
				<Provider client={new Client('staging')}>
					<IntlProvider locale="en">
						<BlockCard
							url={url}
							datasource={datasourceAttributeProperties}
							layout="full-width"
							isNodeNested={true}
						/>
					</IntlProvider>
				</Provider>,
			);

			expect(container.querySelector('[data-testid="renderer-datasource-table"]')).toHaveStyle({
				width: '100%',
			});
		});

		it('should set the correct width when isNodeNested is not set', () => {
			const { container } = render(
				<Provider client={new Client('staging')}>
					<IntlProvider locale="en">
						<WidthContext.Provider value={{ width: 500, breakpoint: 'S' }}>
							<BlockCard url={url} datasource={datasourceAttributeProperties} layout="full-width" />
						</WidthContext.Provider>
					</IntlProvider>
				</Provider>,
			);

			expect(container.querySelector('[data-testid="renderer-datasource-table"]')).toHaveStyle({
				width: '404px',
			});
		});

		it('should render inlineCard if jira issue datasource is provided with JQL but NOT a table view', () => {
			const notRenderableDatasource = {
				...datasourceAttributeProperties,
				views: [
					{
						...datasourceAttributeProperties.views[0],
						type: 'NOT_TABLE',
					},
				],
			} as any;

			render(
				<Provider client={new Client('staging')}>
					<IntlProvider locale="en">
						<BlockCard url={url} datasource={notRenderableDatasource} />
					</IntlProvider>
				</Provider>,
			);

			expect((Card as unknown as jest.Mock).mock.lastCall?.[0]).toEqual(
				expect.objectContaining({ url, appearance: 'inline' }),
			);
		});

		it('should render a datasource when datasource ID is JLOL', () => {
			const datasourceAttributePropertiesWithRealJiraId = {
				...datasourceAttributeProperties,
				id: JIRA_LIST_OF_LINKS_DATASOURCE_ID,
			};

			render(
				<Provider client={new Client('staging')}>
					<IntlProvider locale="en">
						<BlockCard url={url} datasource={datasourceAttributePropertiesWithRealJiraId} />
					</IntlProvider>
				</Provider>,
			);

			const tableViewProps = asMock(DatasourceTableView).mock.lastCall![0];

			expect(tableViewProps.datasourceId).toEqual('d8b75300-dfda-4519-b6cd-e49abbd50401');
			expect(tableViewProps.parameters).toEqual({
				cloudId: 'mock-cloud-id',
				jql: 'JQL=MOCK',
			});
			expect(tableViewProps.visibleColumnKeys).toEqual(['column-1', 'column-2']);
		});
	});
});

describe('Renderer - React/Nodes/BlockCard - analytics context', () => {
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
					<BlockCard url="https://atlassian.com" />
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

describe('Renderer - React/Nodes/BlockCard - CompetitorPrompt', () => {
	const MockCompetitorPrompt = jest.fn(() => (
		<Pressable role="button" aria-label="competitor prompt">
			Prompt
		</Pressable>
	));

	beforeEach(() => {
		MockCompetitorPrompt.mockClear();
	});

	it('should pass through CompetitorPrompt compeont when provided', () => {
		render(
			<Provider client={new Client('staging')}>
				<BlockCard
					url={'test.com'}
					smartLinks={{
						CompetitorPrompt: MockCompetitorPrompt,
					}}
				/>
			</Provider>,
		);

		expect((Card as unknown as jest.Mock).mock.lastCall?.[0]).toEqual(
			expect.objectContaining({
				CompetitorPrompt: MockCompetitorPrompt,
				url: 'test.com',
			}),
		);
	});
});

describe('Renderer - React/Nodes/BlockCard - getCardClickHandler with XPC URL wrapping', () => {
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
