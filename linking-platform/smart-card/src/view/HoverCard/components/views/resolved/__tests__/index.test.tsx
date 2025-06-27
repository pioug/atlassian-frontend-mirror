import React from 'react';

import { act, fireEvent, render, type RenderOptions } from '@testing-library/react';
import { IntlProvider } from 'react-intl-next';

import FabricAnalyticsListeners, { type AnalyticsWebClient } from '@atlaskit/analytics-listeners';
import { type JsonLd } from '@atlaskit/json-ld-types';
import { type JsonLdDatasourceResponse } from '@atlaskit/link-client-extension';
import { SmartCardProvider } from '@atlaskit/link-provider';
import type { CardState, ProductType } from '@atlaskit/linking-common';

import { getCardState } from '../../../../../../../examples/utils/flexible-ui';
import MockAtlasProject from '../../../../../../__fixtures__/atlas-project';
import mockAtlasProjectWithAiSummary from '../../../../../../__fixtures__/atlas-project-with-ai-summary';
import { SmartLinkPosition, SmartLinkSize } from '../../../../../../constants';
import { useAISummary } from '../../../../../../state/hooks/use-ai-summary';
import { AISummariesStore } from '../../../../../../state/hooks/use-ai-summary/ai-summary-service/store';
import * as useInvoke from '../../../../../../state/hooks/use-invoke';
import * as useResolve from '../../../../../../state/hooks/use-resolve';
import { mocks } from '../../../../../../utils/mocks';
import {
	mockBaseResponseWithErrorPreview,
	mockBaseResponseWithPreview,
	mockConfluenceResponse,
	mockIframelyResponse,
	mockJiraResponse,
} from '../../../../__tests__/__mocks__/mocks';
import HoverCardResolvedView from '../index';

jest.mock('../../../../../../state/hooks/use-ai-summary', () => {
	const original = jest.requireActual('../../../../../../state/hooks/use-ai-summary');
	return {
		useAISummary: jest.fn().mockImplementation(({ url, ari, product }) => {
			return {
				summariseUrl: original.useAISummary({ url, ari, product }).summariseUrl,
				state: { status: 'ready', content: '' },
			};
		}),
	};
});

// Must be similar to the product name we use inside the mocked module below.
const productName: ProductType = 'ATLAS';

const titleBlockProps = {
	maxLines: 2,
	size: SmartLinkSize.Large,
	position: SmartLinkPosition.Center,
};

describe('HoverCardResolvedView', () => {
	const url = 'test-url';
	let cardState: CardState;
	const mockAnalyticsClient = {
		sendUIEvent: jest.fn().mockResolvedValue(undefined),
		sendOperationalEvent: jest.fn().mockResolvedValue(undefined),
		sendTrackEvent: jest.fn().mockResolvedValue(undefined),
		sendScreenEvent: jest.fn().mockResolvedValue(undefined),
	} satisfies AnalyticsWebClient;

	const wrapper: RenderOptions['wrapper'] = ({ children }) => (
		<IntlProvider locale="en">
			<FabricAnalyticsListeners client={mockAnalyticsClient}>
				<SmartCardProvider
					storeOptions={{
						initialState: {
							'test-url': cardState,
						},
					}}
					product={productName}
					isAdminHubAIEnabled
				>
					{children}
				</SmartCardProvider>
			</FabricAnalyticsListeners>
		</IntlProvider>
	);

	const TestComponent = ({
		mockResponse = mockConfluenceResponse as JsonLdDatasourceResponse,
		isAISummaryEnabled,
		cardState,
	}: {
		mockResponse?: JsonLd.Response;
		isAISummaryEnabled?: boolean;
		cardState: any;
	}) => {
		return (
			<HoverCardResolvedView
				extensionKey={mockResponse.meta.key}
				id="123"
				flexibleCardProps={{ cardState, children: null, url }}
				onActionClick={jest.fn()}
				cardState={cardState}
				url={url}
				titleBlockProps={titleBlockProps}
				isAISummaryEnabled={isAISummaryEnabled}
			/>
		);
	};

	beforeEach(() => {
		jest.useFakeTimers();
	});

	afterEach(() => {
		jest.clearAllMocks();
		jest.useRealTimers();
	});

	const setup = ({
		mockResponse = mockConfluenceResponse as JsonLdDatasourceResponse,
		isAISummaryEnabled,
	}: {
		mockResponse?: JsonLd.Response;
		isAISummaryEnabled?: boolean;
	} = {}) => {
		cardState = getCardState({
			data: mockResponse.data,
			meta: mockResponse.meta,
			status: 'resolved',
			datasources: (mockResponse as JsonLdDatasourceResponse).datasources,
		});

		const renderResult = render(
			<TestComponent
				cardState={cardState}
				mockResponse={mockResponse}
				isAISummaryEnabled={isAISummaryEnabled}
			/>,
			{ wrapper },
		);

		const rerenderTestComponent = () =>
			renderResult.rerender(
				<TestComponent
					cardState={cardState}
					mockResponse={mockResponse}
					isAISummaryEnabled={isAISummaryEnabled}
				/>,
			);

		return { ...renderResult, rerenderTestComponent };
	};

	it('renders hover card blocks', async () => {
		const { findAllByTestId, findByTestId } = setup();
		act(() => {
			jest.runAllTimers();
		});
		const titleBlock = await findByTestId('smart-block-title-resolved-view');
		await findAllByTestId('smart-block-metadata-resolved-view');
		const snippetBlock = await findByTestId('smart-block-snippet-resolved-view');
		const actionBlock = await findByTestId('smart-block-action');

		const footerBlock = await findByTestId('smart-ai-footer-block-resolved-view');

		expect(titleBlock).toHaveTextContent('I love cheese');
		expect(snippetBlock).toHaveTextContent('Here is your serving of cheese');
		expect(actionBlock).toBeInTheDocument();
		expect(footerBlock).toHaveTextContent('Confluence');
	});

	describe('preview or snippet', () => {
		it('should render preview instead of snippet when preview data is available', async () => {
			const { findByTestId, queryByTestId } = setup({
				mockResponse: mockBaseResponseWithPreview as JsonLd.Response,
			});
			act(() => {
				jest.runAllTimers();
			});
			await findByTestId('smart-block-title-resolved-view');
			await findByTestId('smart-block-preview-resolved-view');

			expect(queryByTestId('smart-block-snippet-resolved-view')).toBeNull();
		});

		it('should fallback to rendering snippet if preview data is available but fails to load', async () => {
			const { findByTestId, queryByTestId } = setup({
				mockResponse: mockBaseResponseWithErrorPreview as JsonLd.Response,
			});
			act(() => {
				jest.runAllTimers();
			});
			await findByTestId('smart-block-title-resolved-view');
			fireEvent.transitionEnd(await findByTestId('smart-block-preview-resolved-view'));
			await findByTestId('smart-block-snippet-resolved-view');

			expect(queryByTestId('smart-block-preview-resolved-view')).toBeNull();
		});
	});

	describe('metadata', () => {
		it('renders correctly for confluence links', async () => {
			const { findByTestId } = setup();
			await findByTestId('authorgroup-metadata-element');
			const commentCount = await findByTestId('commentcount-metadata-element');
			const reactCount = await findByTestId('reactcount-metadata-element');

			expect(commentCount).toHaveTextContent('4');
			expect(reactCount).toHaveTextContent('8');
		});

		it('renders correctly for jira links', async () => {
			const { findByTestId } = setup({
				mockResponse: mockJiraResponse as JsonLd.Response,
			});
			await findByTestId('assignedtogroup-metadata-element');
			const priority = await findByTestId('priority-metadata-element');
			const state = await findByTestId('state-metadata-element');

			expect(priority).toHaveTextContent('Major');
			expect(state).toHaveTextContent('Done');
		});

		it('renders correctly for other providers', async () => {
			const { findByTestId } = setup({
				mockResponse: mockIframelyResponse as JsonLd.Response,
			});
			const titleBlock = await findByTestId('smart-block-title-resolved-view');
			const modifiedOn = await findByTestId('modifiedon-metadata-element');
			await findByTestId('authorgroup-metadata-element');

			expect(titleBlock).toHaveTextContent('I love cheese');
			expect(modifiedOn).toHaveTextContent('Updated on Jan 1, 2022');
		});
	});

	describe('actions', () => {
		it('renders PreviewAction', async () => {
			const { findByTestId } = setup();

			const action = await findByTestId('smart-action-preview-action');
			expect(action).toHaveTextContent('Open preview');
		});

		it('renders CopyLinkAction', async () => {
			const { findByTestId } = setup();

			const action = await findByTestId('smart-action-copy-link-action');
			expect(action).toHaveTextContent('Copy link');
		});

		it('renders FollowAction', async () => {
			jest.spyOn(useInvoke, 'default').mockReturnValue(jest.fn());
			jest.spyOn(useResolve, 'default').mockReturnValue(jest.fn());
			const { findByTestId } = setup({
				mockResponse: MockAtlasProject,
			});

			const action = await findByTestId('smart-action-follow-action');
			expect(action).toHaveTextContent('Follow project');
		});

		describe('AISummaryAction', () => {
			beforeEach(() => {
				AISummariesStore.clear();
			});

			it('renders AI summary action', async () => {
				const { findByTestId } = setup({
					mockResponse: mockAtlasProjectWithAiSummary,
					isAISummaryEnabled: true,
				});

				const aiSummaryAction = await findByTestId(
					'smart-action-ai-summary-action-summarise-action',
				);
				expect(aiSummaryAction).toHaveTextContent('Summarize with AI');
			});

			it('renders snippet as a placeholder', async () => {
				const { findByTestId } = setup({
					mockResponse: mockAtlasProjectWithAiSummary,
					isAISummaryEnabled: true,
				});

				const snippet = await findByTestId('smart-block-snippet-resolved-view');

				expect(snippet).toBeInTheDocument();
			});

			it('renders AI summary block and hides the snippet when is summary content available', async () => {
				jest.mocked(useAISummary).mockReturnValueOnce({
					state: { status: 'loading', content: '' },
					summariseUrl: jest.fn(),
				});

				const { findByTestId, queryByTestId, rerenderTestComponent } = setup({
					mockResponse: mockAtlasProjectWithAiSummary,
					isAISummaryEnabled: true,
				});

				const snippet = queryByTestId('smart-block-snippet-resolved-view');
				expect(snippet).toBeInTheDocument();

				jest.mocked(useAISummary).mockReturnValueOnce({
					state: {
						status: 'loading',
						content: 'first piece of summary is here',
					},
					summariseUrl: jest.fn(),
				});

				rerenderTestComponent();

				const aiSummaryBlock = await findByTestId('smart-ai-summary-block-resolved-view');
				const snippetAfterRerender = queryByTestId('smart-block-snippet-resolved-view');

				expect(aiSummaryBlock).toBeInTheDocument();
				expect(snippetAfterRerender).not.toBeInTheDocument();
			});

			it('should use a resolved data URL instead of provided URL', () => {
				// Provided URL can be different from the data URL obtained from the resolver (see short links as example).
				// We want to ensure that all components within the Hover Card subscribe to the same URL AI Summary update
				// and do not create two different instances of AI Summary Service.
				setup({
					mockResponse: {
						...mockAtlasProjectWithAiSummary,
						data: {
							...mockAtlasProjectWithAiSummary.data,
							url: 'http://data-link-url.com',
						},
					},
					isAISummaryEnabled: true,
				});

				expect(AISummariesStore.size).toBe(1);
				// Provided URL
				expect(AISummariesStore.get(url)).not.toBeDefined();
				// Data url from the cardState
				expect(AISummariesStore.get('http://data-link-url.com')).toBeDefined();
			});

			it('should call the useAISummary hook with a product name when it`s available in SmartLinkContext', () => {
				setup({
					mockResponse: mockAtlasProjectWithAiSummary,
					isAISummaryEnabled: true,
				});

				expect(useAISummary).toHaveBeenCalledWith(
					expect.objectContaining({
						product: productName,
					}),
				);
			});
		});
	});

	describe('analytics', () => {
		it('should fire render success event when hover card is rendered', async () => {
			const { findByTestId } = setup({
				mockResponse: {
					...mockConfluenceResponse,
					...mocks.analytics.details,
				} as JsonLd.Response,
			});
			await findByTestId('smart-block-title-resolved-view');

			expect(mockAnalyticsClient.sendUIEvent).toHaveBeenCalledWith(
				expect.objectContaining({
					actionSubject: 'smartLink',
					action: 'renderSuccess',
				}),
			);
		});
	});
	it('should capture and report a11y violations', async () => {
		const { container } = setup({
			mockResponse: {
				...mockConfluenceResponse,
				...mocks.analytics.details,
			} as JsonLd.Response,
		});
		await expect(container).toBeAccessible();
	});
});
