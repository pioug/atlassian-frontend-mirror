import { MockCardComponent } from './card.mock';

import React from 'react';

import { IntlProvider } from 'react-intl';

import type { DatasourceAttributeProperties } from '@atlaskit/adf-schema/block-card';
import AnalyticsListener from '@atlaskit/analytics-next/AnalyticsListener';
import { WidthContext } from '@atlaskit/editor-common/WidthProvider';
import { LazyLoadedDatasourceRenderFailedAnalyticsWrapper } from '@atlaskit/link-datasource/analytics/render-failed';
import { DatasourceTableViewWithWrappers as DatasourceTableView } from '@atlaskit/link-datasource/datasource-table-view-with-wrappers';
import { JIRA_LIST_OF_LINKS_DATASOURCE_ID } from '@atlaskit/link-datasource/jira-issues-modal';
import Client from '@atlaskit/link-provider/client';
import { SmartCardProvider as Provider } from '@atlaskit/link-provider/smart-card-provider';
import '@atlaskit/link-test-helpers/jest/to-be-fired-with-analytic-event-once';
import { asMock } from '@atlaskit/link-test-helpers/jest/as-mock';
import { Pressable } from '@atlaskit/primitives/compiled/pressable';
import { Card } from '@atlaskit/smart-card/card/lazy';
import { CardSSR } from '@atlaskit/smart-card/ssr';
import { mockExpDisabled } from '@atlassian/experiment-test-utils/mock-exp-disabled';
import { mockExpEnabled } from '@atlassian/experiment-test-utils/mock-exp-enabled';
import { act } from '@atlassian/testing-library/act';
import { render } from '@atlassian/testing-library/render';
import { screen } from '@atlassian/testing-library/screen';

import { InlineCard } from '../../../../react/nodes';
import BlockCard from '../../../../react/nodes/blockCard';
import { CardErrorBoundary } from '../../../../react/nodes/fallback';
import { getCardClickHandler } from '../../../../react/utils/getCardClickHandler';

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

jest.mock('@atlaskit/link-datasource/analytics/render-failed', () => ({
	LazyLoadedDatasourceRenderFailedAnalyticsWrapper: jest.fn(),
}));

jest.mock('@atlaskit/smart-card/card/lazy', () => {
	const originalModule = jest.requireActual('@atlaskit/smart-card/card/lazy');
	return {
		...jest.requireActual('@atlaskit/smart-card/card/lazy'),
		Card: jest.fn((props) => <originalModule.Card {...props} />),
	};
});

jest.mock('@atlaskit/smart-card/ssr', () => ({
	CardSSR: jest.fn(() => <div data-testid="smart-card-ssr" />),
}));

// eslint-disable-next-line @atlassian/a11y/require-jest-coverage
describe('Renderer - React/Nodes/BlockCard', () => {
	const url = 'https://extranet.atlassian.com/pages/viewpage.action?pageId=3088533424';

	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('renders an SSR card when SSR is enabled and a URL is provided', () => {
		render(
			<Provider client={new Client('staging')}>
				<BlockCard url={url} smartLinks={{ ssr: true }} />
			</Provider>,
		);

		expect(CardSSR).toHaveBeenCalledTimes(1);
		expect(Card).not.toHaveBeenCalled();
	});

	it('renders a client card when SSR is disabled', () => {
		render(
			<Provider client={new Client('staging')}>
				<BlockCard url={url} smartLinks={{ ssr: false }} />
			</Provider>,
		);

		expect(CardSSR).not.toHaveBeenCalled();
		expect(Card).toHaveBeenCalledTimes(1);
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

		it('keeps the inline card inside the analytics wrapper in control', () => {
			mockExpDisabled('platform_editor_optional_chunk_recovery');
			const table = asMock(DatasourceTableView);
			const originalTable = table.getMockImplementation();
			const error = new Error('Table unavailable');
			table.mockImplementation(() => {
				throw error;
			});
			const onSetLinkTarget = jest.fn(() => '_blank' as const);
			try {
				render(
					<BlockCard
						url={url}
						datasource={datasourceAttributeProperties}
						onSetLinkTarget={onSetLinkTarget}
					/>,
				);
				expect(onSetLinkTarget).toHaveBeenCalledWith(url);
				expect(onSetLinkTarget.mock.contexts).toEqual(
					onSetLinkTarget.mock.calls.map(() => undefined),
				);
				expect(
					asMock(LazyLoadedDatasourceRenderFailedAnalyticsWrapper).mock.lastCall?.[0],
				).toMatchObject({
					error,
					children: { type: InlineCard, props: { url } },
				});
			} finally {
				if (originalTable) {
					table.mockImplementation(originalTable);
				}
			}
		});

		it.each([url, undefined, 'javascript:alert(1)'])(
			'keeps the datasource fallback mounted and reports a shared chunk failure (URL: %s)',
			async (fallbackUrl) => {
				mockExpEnabled('platform_editor_optional_chunk_recovery');
				const analyticsSpy = jest.fn();
				const error = new TypeError('Failed to fetch dynamically imported module');
				let rejectImport!: (reason: Error) => void;
				const sharedModule = new Promise<{ default: React.ComponentType }>((_, reject) => {
					rejectImport = reject;
				});
				const Table = React.lazy(() => sharedModule);
				const Reporter = React.lazy(() => sharedModule);
				const table = asMock(DatasourceTableView);
				const originalTable = table.getMockImplementation();
				table.mockImplementation(() => <Table />);
				asMock(LazyLoadedDatasourceRenderFailedAnalyticsWrapper).mockImplementation(() => (
					<Reporter />
				));
				try {
					render(
						<AnalyticsListener onEvent={analyticsSpy} channel="editor">
							<IntlProvider locale="en">
								<Provider client={new Client('staging')}>
									<p>Neighboring content</p>
									<React.Suspense fallback={null}>
										<BlockCard
											url={fallbackUrl}
											datasource={datasourceAttributeProperties}
											onSetLinkTarget={() => '_blank'}
										/>
									</React.Suspense>
								</Provider>
							</IntlProvider>
						</AnalyticsListener>,
					);
					const neighbor = screen.getByText('Neighboring content');
					await act(async () => rejectImport(error));
					if (fallbackUrl === url) {
						const link = await screen.findByRole('link', { name: (name) => name.startsWith(url) });
						expect(link).toHaveAttribute('href', url);
						expect(link).toHaveAttribute('target', '_blank');
						expect(link).toHaveAttribute('rel', 'noreferrer noopener');
					} else {
						expect(screen.getByText('Unsupported content')).toBeVisible();
						expect(screen.queryByRole('link')).not.toBeInTheDocument();
					}
					expect(analyticsSpy).toHaveBeenCalledWith(
						expect.objectContaining({
							payload: expect.objectContaining({
								action: 'unhandledErrorCaughtV2',
								actionSubject: 'renderer',
								actionSubjectId: 'blockCard',
								attributes: expect.objectContaining({
									errorMessage: `Datasource recovery analytics: ${error.message}`,
								}),
							}),
						}),
						'editor',
					);
					expect(screen.getByText('Neighboring content')).toBe(neighbor);
				} finally {
					asMock(LazyLoadedDatasourceRenderFailedAnalyticsWrapper).mockReset();
					if (originalTable) {
						table.mockImplementation(originalTable);
					}
				}
			},
		);

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
