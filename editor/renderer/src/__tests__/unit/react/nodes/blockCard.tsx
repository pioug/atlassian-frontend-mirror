import React from 'react';
import { render } from '@testing-library/react';
import { asMock } from '@atlaskit/link-test-helpers/jest';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { mount, ReactWrapper } from 'enzyme';
import { IntlProvider } from 'react-intl-next';

import { CardClient as Client, SmartCardProvider as Provider } from '@atlaskit/link-provider';
import { Card } from '@atlaskit/smart-card';

import BlockCard from '../../../../react/nodes/blockCard';
import InlineCard from '../../../../react/nodes/inlineCard';
import { AnalyticsListener } from '@atlaskit/analytics-next';
import { MockCardComponent } from './card.mock';

import type { DatasourceAttributeProperties } from '@atlaskit/adf-schema/schema';
import { DatasourceTableView, JIRA_LIST_OF_LINKS_DATASOURCE_ID } from '@atlaskit/link-datasource';
import { WidthContext } from '@atlaskit/editor-common/ui';
import { Pressable } from '@atlaskit/primitives/compiled';

jest.mock('@atlaskit/smart-card', () => {
	const originalModule = jest.requireActual('@atlaskit/smart-card');
	return {
		...originalModule,
		Card: jest.fn((props) => <originalModule.Card {...props} />),
	};
});

describe('Renderer - React/Nodes/BlockCard', () => {
	const url = 'https://extranet.atlassian.com/pages/viewpage.action?pageId=3088533424';

	let node: ReactWrapper;
	afterEach(() => {
		node.unmount();
	});

	it('should render a <div>-tag', () => {
		node = mount(<BlockCard url={url} />);
		expect(node.getDOMNode()['tagName']).toEqual('DIV');
	});

	it('should render with url if prop exists', () => {
		node = mount(<BlockCard url={url} />);
		expect(node.find(BlockCard).prop('url')).toEqual(url);
	});

	it('should render with onClick if eventHandlers has correct event key', async () => {
		const mockedOnClick = jest.fn();
		const mockedEvent = { target: {} };
		node = mount(
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

		const onClick = node.find(Card).prop('onClick');

		onClick(mockedEvent);

		expect(mockedOnClick).toHaveBeenCalledWith(mockedEvent, url);
	});

	it('should render with onClick as undefined if eventHandlers is not present', () => {
		node = mount(
			<Provider client={new Client('staging')}>
				<BlockCard url={url} />{' '}
			</Provider>,
		);

		expect(node.find(Card).prop('onClick')).toBeUndefined();
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
			node = mount(
				<Provider client={new Client('staging')}>
					<BlockCard url={url} datasource={datasourceAttributeProperties} />
				</Provider>,
			);
			expect(node.find(Card).length).toBe(0);

			const tableView = node.find(DatasourceTableView);
			expect(tableView.length).toBe(1);
			expect(tableView.props()).toEqual({
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

			node = mount(
				<Provider client={new Client('staging')}>
					<IntlProvider locale="en">
						<BlockCard url={url} datasource={datasourceAttributePropertiesNoCustomSizes} />
					</IntlProvider>
				</Provider>,
			);

			expect(node.find(Card).length).toBe(0);

			const tableView = node.find(DatasourceTableView);
			expect(tableView.length).toBe(1);
			expect(tableView.prop('columnCustomSizes')).toBeUndefined();
		});

		it('should set the wrapper width as 100% when isNodeNested is set as true', () => {
			node = mount(
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

			expect(node.html()).toMatch(
				// Ignored via go/ees005
				// eslint-disable-next-line require-unicode-regexp
				/<div data-testid=\"renderer-datasource-table\" style=\"width: 100%;\".*/,
			);
		});

		it('should set the correct width when isNodeNested is not set', () => {
			node = mount(
				<Provider client={new Client('staging')}>
					<IntlProvider locale="en">
						<WidthContext.Provider value={{ width: 500, breakpoint: 'S' }}>
							<BlockCard url={url} datasource={datasourceAttributeProperties} layout="full-width" />
						</WidthContext.Provider>
					</IntlProvider>
				</Provider>,
			);

			expect(node.html()).toMatch(
				// Ignored via go/ees005
				// eslint-disable-next-line require-unicode-regexp
				/<div data-testid=\"renderer-datasource-table\" style=\"width: 404px;\".*/,
			);
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

			node = mount(
				<Provider client={new Client('staging')}>
					<IntlProvider locale="en">
						<BlockCard url={url} datasource={notRenderableDatasource} />
					</IntlProvider>
				</Provider>,
			);

			expect(node.find(InlineCard).length).toBe(1);
			expect(node.find(InlineCard).prop('url')).toEqual(url);
		});

		it('should render a datasource when datasource ID is JLOL', () => {
			const datasourceAttributePropertiesWithRealJiraId = {
				...datasourceAttributeProperties,
				id: JIRA_LIST_OF_LINKS_DATASOURCE_ID,
			};

			node = mount(
				<Provider client={new Client('staging')}>
					<IntlProvider locale="en">
						<BlockCard url={url} datasource={datasourceAttributePropertiesWithRealJiraId} />
					</IntlProvider>
				</Provider>,
			);
			const tableView = node.find(DatasourceTableView);
			expect(tableView.prop('datasourceId')).toEqual('d8b75300-dfda-4519-b6cd-e49abbd50401');
			expect(tableView.prop('parameters')).toEqual({
				cloudId: 'mock-cloud-id',
				jql: 'JQL=MOCK',
			});
			expect(tableView.prop('visibleColumnKeys')).toEqual(['column-1', 'column-2']);
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
				<BlockCard url="https://atlassian.com" />
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

		expect(Card).toHaveBeenCalledWith(
			expect.objectContaining({
				CompetitorPrompt: MockCompetitorPrompt,
				url: 'test.com',
			}),
			expect.anything(),
		);
	});
});
