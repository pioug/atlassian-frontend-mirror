import React from 'react';

import { act, fireEvent, render, type RenderOptions } from '@testing-library/react';
import { IntlProvider } from 'react-intl-next';

import FabricAnalyticsListeners, { type AnalyticsWebClient } from '@atlaskit/analytics-listeners';
import { type JsonLd } from '@atlaskit/json-ld-types';
import { SmartCardProvider } from '@atlaskit/link-provider';
import type { CardState, ProductType } from '@atlaskit/linking-common';
import { SmartLinkResponse } from '@atlaskit/linking-types';
import { ffTest } from '@atlassian/feature-flags-test-utils';

import { getCardState } from '../../../../../../../examples/utils/flexible-ui';
import { SmartLinkPosition, SmartLinkSize } from '../../../../../../constants';
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
		mockResponse = mocks.entityDataSuccess,
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
		mockResponse = mocks.entityDataSuccess,
		isAISummaryEnabled,
	}: {
		mockResponse?: SmartLinkResponse;
		isAISummaryEnabled?: boolean;
	} = {}) => {
		cardState = getCardState({
			data: mockResponse.data,
			meta: mockResponse.meta,
			status: 'resolved',
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

	ffTest.on('smart_links_noun_support', 'entity support', () => {
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
			expect(footerBlock).toHaveTextContent('I love cheese');
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
				const { findByTestId } = setup({
					mockResponse: mockConfluenceResponse as SmartLinkResponse,
				});
				await findByTestId('authorgroup-metadata-element');
				const commentCount = await findByTestId('commentcount-metadata-element');
				const reactCount = await findByTestId('reactcount-metadata-element');

				expect(commentCount).toHaveTextContent('4');
				expect(reactCount).toHaveTextContent('8');
			});

			it('renders correctly for jira links', async () => {
				const { findByTestId } = setup({
					mockResponse: mockJiraResponse as SmartLinkResponse,
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
	});
});
