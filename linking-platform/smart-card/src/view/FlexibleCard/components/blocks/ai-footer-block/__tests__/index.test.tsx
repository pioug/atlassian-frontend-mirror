/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { css, jsx } from '@compiled/react';
import { render, screen } from '@testing-library/react';
import { IntlProvider } from 'react-intl-next';

import { SmartCardProvider } from '@atlaskit/link-provider';

import context from '../../../../../../__fixtures__/flexible-ui-data-context';
import { SmartLinkStatus } from '../../../../../../constants';
import { FlexibleUiContext } from '../../../../../../state/flexible-ui-context';
import type { FlexibleUiDataContext } from '../../../../../../state/flexible-ui-context/types';
import { useAISummary } from '../../../../../../state/hooks/use-ai-summary';
import { type AISummaryStatus } from '../../../../../../state/hooks/use-ai-summary/ai-summary-service/types';
import FooterBlock from '../index';
import type { AIFooterBlockProps } from '../types';

jest.mock('../../../../../../state/hooks/use-ai-summary', () => ({
	useAISummary: jest.fn(),
}));

describe('AIFooterBlock', () => {
	const testIdBase = 'some-test-id';

	const renderAIFooterBlock = (
		props?: AIFooterBlockProps,
		overrideContext?: FlexibleUiDataContext,
	) => {
		return render(
			<IntlProvider locale="en">
				<SmartCardProvider>
					<FlexibleUiContext.Provider value={overrideContext || context}>
						<FooterBlock status={SmartLinkStatus.Resolved} {...props} testId={testIdBase} />
					</FlexibleUiContext.Provider>
				</SmartCardProvider>
			</IntlProvider>,
		);
	};

	it('should render non-empty block when status is resolved', () => {
		jest.mocked(useAISummary).mockReturnValue({
			state: { status: 'done', content: '' },
			summariseUrl: jest.fn(),
		});

		renderAIFooterBlock();

		const resolvedView = screen.getByTestId(`${testIdBase}-resolved-view`);

		expect(resolvedView).toBeInTheDocument();
	});

	it.each([
		[SmartLinkStatus.Resolving],
		[SmartLinkStatus.Forbidden],
		[SmartLinkStatus.Errored],
		[SmartLinkStatus.NotFound],
		[SmartLinkStatus.Unauthorized],
		[SmartLinkStatus.Fallback],
	])('should render null when status is %s', (status: SmartLinkStatus) => {
		renderAIFooterBlock({ status });

		const resolvedView = screen.queryByTestId(`${testIdBase}-resolved-view`);

		expect(resolvedView).toBeNull();
	});

	it('should render provider', async () => {
		renderAIFooterBlock();

		const provider = await screen.findByTestId(`${testIdBase}-provider`);

		expect(provider).toBeDefined();

		const providerLabel = await screen.findByTestId(`${testIdBase}-provider-label`);

		expect(providerLabel).toHaveTextContent('Confluence');
	});

	it('renders with override css', async () => {
		const overrideCss = css({
			backgroundColor: 'blue',
		});

		render(
			<IntlProvider locale="en">
				<SmartCardProvider>
					<FlexibleUiContext.Provider value={context}>
						<FooterBlock status={SmartLinkStatus.Resolved} testId={testIdBase} css={overrideCss} />
					</FlexibleUiContext.Provider>
				</SmartCardProvider>
			</IntlProvider>,
		);

		const block = await screen.findByTestId(`${testIdBase}-resolved-view`);

		expect(block).toHaveCompiledCss('background-color', 'blue');
	});

	describe('AI Metadata', () => {
		it('should render AI metadata when AI action is available', async () => {
			jest.mocked(useAISummary).mockReturnValue({
				state: { status: 'done', content: '' },
				summariseUrl: jest.fn(),
			});

			renderAIFooterBlock();

			const aiMetadata = await screen.findByTestId(`${testIdBase}-ai-metadata`);

			expect(aiMetadata).toBeDefined();
		});

		it.each<[AISummaryStatus]>([['ready'], ['error'], ['loading']])(
			'should not render AI metadata when AI summary is in state %s',
			async (status) => {
				jest.mocked(useAISummary).mockReturnValue({
					state: { status, content: '' },
					summariseUrl: jest.fn(),
				});

				renderAIFooterBlock();

				const aiMetadata = screen.queryByTestId(`${testIdBase}-ai-metadata`);

				expect(aiMetadata).toBeNull();
			},
		);

		it('should not render AI metadata when AI action is not available', async () => {
			const contextWithNoAiSummaryAction = {
				...context,
				actions: { ...context.actions, AISummaryAction: undefined },
			};

			renderAIFooterBlock({}, contextWithNoAiSummaryAction);

			const aiMetadata = screen.queryByTestId(`${testIdBase}-ai-metadata`);

			expect(aiMetadata).toBeNull();
		});
	});
});
