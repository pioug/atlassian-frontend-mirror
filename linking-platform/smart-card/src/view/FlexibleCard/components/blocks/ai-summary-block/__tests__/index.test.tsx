import '@atlaskit/link-test-helpers/jest';

import React from 'react';

import { render, screen } from '@testing-library/react';
import { IntlProvider } from 'react-intl-next';

import { AnalyticsListener } from '@atlaskit/analytics-next';
import { SmartCardProvider } from '@atlaskit/link-provider';
import { fg } from '@atlaskit/platform-feature-flags';

import context from '../../../../../../__fixtures__/flexible-ui-data-context';
import { SmartLinkStatus } from '../../../../../../constants';
import {
	FlexibleCardContext,
	FlexibleUiContext,
} from '../../../../../../state/flexible-ui-context';
import { useAISummary } from '../../../../../../state/hooks/use-ai-summary';
import { ANALYTICS_CHANNEL } from '../../../../../../utils/analytics';
import AISummaryBlock from '../index';
import { type AISummaryBlockProps } from '../types';

jest.mock('../../../../../../state/hooks/use-ai-summary', () => ({
	useAISummary: jest.fn().mockReturnValue({ state: { status: 'ready' } }),
}));

const TestComponent = (props: Partial<AISummaryBlockProps> & { spy: jest.Mock }) => {
	if (fg('platform-linking-flexible-card-context')) {
		return (
			<AnalyticsListener onEvent={props.spy} channel={ANALYTICS_CHANNEL}>
				<SmartCardProvider>
					<IntlProvider locale="en">
						<FlexibleCardContext.Provider value={{ data: context }}>
							<AISummaryBlock status={SmartLinkStatus.Resolved} {...props} />
						</FlexibleCardContext.Provider>
					</IntlProvider>
				</SmartCardProvider>
			</AnalyticsListener>
		);
	}

	return (
		<AnalyticsListener onEvent={props.spy} channel={ANALYTICS_CHANNEL}>
			<SmartCardProvider>
				<IntlProvider locale="en">
					<FlexibleUiContext.Provider value={context}>
						<AISummaryBlock status={SmartLinkStatus.Resolved} {...props} />
					</FlexibleUiContext.Provider>
				</IntlProvider>
			</SmartCardProvider>
		</AnalyticsListener>
	);
};

describe('AISummaryBlock', () => {
	const testIdBase = 'some-test-id';

	const renderAISummaryBlock = (props?: Partial<AISummaryBlockProps>) => {
		const spy = jest.fn();

		const { rerender, ...result } = render(<TestComponent spy={spy} {...props} />);
		const rerenderTestComponent = () => rerender(<TestComponent spy={spy} {...props} />);

		return {
			...result,
			spy,
			rerenderTestComponent,
		};
	};

	describe('status', () => {
		it.each([
			[SmartLinkStatus.Resolving],
			[SmartLinkStatus.Forbidden],
			[SmartLinkStatus.Errored],
			[SmartLinkStatus.NotFound],
			[SmartLinkStatus.Unauthorized],
			[SmartLinkStatus.Fallback],
		])('should render null when status is %s', (status: SmartLinkStatus) => {
			const { container } = renderAISummaryBlock({ status });
			expect(container.children.length).toEqual(0);
		});
	});

	describe('ai summary', () => {
		it('fires expected events when the summary is done', async () => {
			jest.mocked(useAISummary).mockReturnValue({
				state: { status: 'loading', content: '' },
				summariseUrl: jest.fn(),
			});

			const { spy, rerenderTestComponent } = renderAISummaryBlock({
				testId: testIdBase,
			});

			jest.mocked(useAISummary).mockReturnValue({
				state: { status: 'done', content: '' },
				summariseUrl: jest.fn(),
			});

			rerenderTestComponent();

			expect(spy).toBeFiredWithAnalyticEventOnce(
				{
					payload: {
						action: 'viewed',
						actionSubject: 'summary',
						attributes: {
							fromCache: false,
						},
					},
				},
				ANALYTICS_CHANNEL,
			);
			expect(spy).not.toBeFiredWithAnalyticEventOnce(
				{
					payload: {
						action: 'initiated',
						actionSubject: 'aiInteraction',
						attributes: {
							aiFeatureName: 'Smart Links Summary',
							proactiveAIGenerated: 1,
							userGeneratedAI: 0,
						},
					},
				},
				ANALYTICS_CHANNEL,
			);
		});

		it('fires expected events when the summary is cached', async () => {
			jest.mocked(useAISummary).mockReturnValue({
				state: { status: 'done', content: '' },
				summariseUrl: jest.fn(),
			});

			const { spy } = renderAISummaryBlock({
				testId: testIdBase,
			});
			expect(spy).toBeFiredWithAnalyticEventOnce(
				{
					payload: {
						action: 'viewed',
						actionSubject: 'summary',
						attributes: {
							fromCache: true,
						},
					},
				},
				ANALYTICS_CHANNEL,
			);
			expect(spy).toBeFiredWithAnalyticEventOnce(
				{
					payload: {
						action: 'initiated',
						actionSubject: 'aiInteraction',
						attributes: {
							aiFeatureName: 'Smart Links Summary',
							proactiveAIGenerated: 1,
							userGeneratedAI: 0,
						},
					},
				},
				ANALYTICS_CHANNEL,
			);
		});

		it('should not render error state indicator', async () => {
			jest.mocked(useAISummary).mockReturnValue({
				state: { status: 'error', content: '' },
				summariseUrl: jest.fn(),
			});

			renderAISummaryBlock({
				testId: testIdBase,
			});

			const indicatorA = screen.queryByTestId(`${testIdBase}-error-indicator-error`);

			expect(indicatorA).not.toBeInTheDocument();
		});

		it('Display the AI Summary component only when there is summary content available', async () => {
			jest.mocked(useAISummary).mockReturnValue({
				state: { status: 'loading', content: '' },
				summariseUrl: jest.fn(),
			});

			const aiSummaryTestId = `${testIdBase}-ai-summary`;
			const { rerenderTestComponent } = renderAISummaryBlock({
				testId: testIdBase,
			});

			const AISummary = screen.queryByTestId(aiSummaryTestId);
			expect(AISummary).not.toBeInTheDocument();

			jest.mocked(useAISummary).mockReturnValue({
				state: { status: 'loading', content: 'first piece of summary is here' },
				summariseUrl: jest.fn(),
			});

			rerenderTestComponent();
			const AISummaryWithContent = screen.queryByTestId(aiSummaryTestId);
			expect(AISummaryWithContent).toBeInTheDocument();
		});
	});

	describe('metadata', () => {
		it('should not render footer metadata', async () => {
			jest.mocked(useAISummary).mockReturnValue({
				state: { status: 'ready', content: '' },
				summariseUrl: jest.fn(),
			});

			renderAISummaryBlock();

			const provider = screen.queryByTestId(`${testIdBase}-provider`);
			expect(provider).not.toBeInTheDocument();
		});
	});

	it('does not render when there is no summary', async () => {
		jest.mocked(useAISummary).mockReturnValue({
			state: { status: 'ready', content: '' },
			summariseUrl: jest.fn(),
		});

		renderAISummaryBlock();

		const block = screen.queryByTestId('smart-ai-summary-block-resolved-view');
		expect(block).not.toBeInTheDocument();
	});

	it('does not render when the summary is loading', async () => {
		jest.mocked(useAISummary).mockReturnValue({
			state: { status: 'loading', content: '' },
			summariseUrl: jest.fn(),
		});

		renderAISummaryBlock();

		const block = screen.queryByTestId('smart-ai-summary-block-resolved-view');
		expect(block).not.toBeInTheDocument();
	});

	it('renders when the summary is loading with content', async () => {
		jest.mocked(useAISummary).mockReturnValue({
			state: { status: 'loading', content: 'content' },
			summariseUrl: jest.fn(),
		});

		renderAISummaryBlock();

		const block = await screen.findByTestId('smart-ai-summary-block-resolved-view');
		expect(block).toBeInTheDocument();
	});

	it('renders when the summary is done', async () => {
		jest.mocked(useAISummary).mockReturnValue({
			state: { status: 'done', content: 'content' },
			summariseUrl: jest.fn(),
		});

		renderAISummaryBlock();

		const block = await screen.findByTestId('smart-ai-summary-block-resolved-view');
		expect(block).toBeInTheDocument();
	});

	it('does not render on error', () => {
		jest.mocked(useAISummary).mockReturnValue({
			state: { status: 'error', error: 'UNEXPECTED', content: '' },
			summariseUrl: jest.fn(),
		});

		renderAISummaryBlock();

		const block = screen.queryByTestId('smart-ai-summary-block-resolved-view');
		expect(block).not.toBeInTheDocument();
	});

	describe('placeholder', () => {
		const placeholderTestId = 'test-placeholder';
		const placeholder = <div data-testid={placeholderTestId}></div>;

		it('render placeholder when there is no summary', async () => {
			jest.mocked(useAISummary).mockReturnValue({
				state: { status: 'ready', content: '' },
				summariseUrl: jest.fn(),
			});

			renderAISummaryBlock({ placeholder });

			const block = await screen.findByTestId(placeholderTestId);
			expect(block).toBeInTheDocument();
		});

		it('render placeholder when the summary is loading', async () => {
			jest.mocked(useAISummary).mockReturnValue({
				state: { status: 'loading', content: '' },
				summariseUrl: jest.fn(),
			});

			renderAISummaryBlock({ placeholder });

			const block = await screen.findByTestId(placeholderTestId);
			expect(block).toBeInTheDocument();
		});

		it('does not render placeholder when the summary is loading with content', () => {
			jest.mocked(useAISummary).mockReturnValue({
				state: { status: 'loading', content: 'content' },
				summariseUrl: jest.fn(),
			});

			renderAISummaryBlock({ placeholder });

			const block = screen.queryByTestId(placeholderTestId);
			expect(block).not.toBeInTheDocument();
		});

		it('does not render placeholder when the summary is done', () => {
			jest.mocked(useAISummary).mockReturnValue({
				state: { status: 'done', content: 'content' },
				summariseUrl: jest.fn(),
			});

			renderAISummaryBlock({ placeholder });

			const block = screen.queryByTestId(placeholderTestId);
			expect(block).not.toBeInTheDocument();
		});

		it('renders placeholder on error', async () => {
			jest.mocked(useAISummary).mockReturnValue({
				state: { status: 'error', error: 'UNEXPECTED', content: '' },
				summariseUrl: jest.fn(),
			});

			renderAISummaryBlock({ placeholder });

			const block = await screen.findByTestId(placeholderTestId);
			expect(block).toBeInTheDocument();
		});
	});
});
