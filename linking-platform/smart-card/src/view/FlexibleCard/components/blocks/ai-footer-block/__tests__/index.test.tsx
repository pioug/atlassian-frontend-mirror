import React from 'react';
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css } from '@emotion/react';
import { IntlProvider } from 'react-intl-next';
import { render } from '@testing-library/react';
import { SmartCardProvider } from '@atlaskit/link-provider';

import FooterBlock from '../index';
import context from '../../../../../../__fixtures__/flexible-ui-data-context';
import { useAISummary } from '../../../../../../state/hooks/use-ai-summary';
import { SmartLinkStatus } from '../../../../../../constants';
import { FlexibleUiContext } from '../../../../../../state/flexible-ui-context';

import type { AIFooterBlockProps } from '../types';
import type { FlexibleUiDataContext } from '../../../../../../state/flexible-ui-context/types';

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
		(useAISummary as jest.Mock).mockReturnValue({
			state: { status: 'done' },
		});

		const { getByTestId } = renderAIFooterBlock();

		const resolvedView = getByTestId(`${testIdBase}-resolved-view`);

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
		const { queryByTestId } = renderAIFooterBlock({ status });

		const resolvedView = queryByTestId(`${testIdBase}-resolved-view`);

		expect(resolvedView).toBeNull();
	});

	it('should render provider', async () => {
		const { findByTestId } = renderAIFooterBlock();

		const provider = await findByTestId(`${testIdBase}-provider`);

		expect(provider).toBeDefined();

		const providerLabel = await findByTestId(`${testIdBase}-provider-label`);

		expect(providerLabel.textContent).toBe('Confluence');
	});

	it('renders with override css', async () => {
		const overrideCss = css({
			backgroundColor: 'blue',
		});

		const { findByTestId } = renderAIFooterBlock({
			overrideCss,
			testId: testIdBase,
		});

		const block = await findByTestId(`${testIdBase}-resolved-view`);

		expect(block).toHaveStyleDeclaration('background-color', 'blue');
	});

	describe('AI Metadata', () => {
		it('should render AI metadata when AI action is available', async () => {
			(useAISummary as jest.Mock).mockReturnValue({
				state: { status: 'done' },
			});

			const { findByTestId } = renderAIFooterBlock();

			const aiMetadata = await findByTestId(`${testIdBase}-ai-metadata`);

			expect(aiMetadata).toBeDefined();
		});

		it.each([['ready'], ['error'], ['loading']])(
			'should not render AI metadata when AI summary is in state %s',
			async (status) => {
				(useAISummary as jest.Mock).mockReturnValue({
					state: { status },
				});

				const { queryByTestId } = renderAIFooterBlock();

				const aiMetadata = queryByTestId(`${testIdBase}-ai-metadata`);

				expect(aiMetadata).toBeNull();
			},
		);

		it('should not render AI metadata when AI action is not available', async () => {
			const contextWithNoAiSummaryAction = {
				...context,
				actions: { ...context.actions, AISummaryAction: undefined },
			};

			const { queryByTestId } = renderAIFooterBlock({}, contextWithNoAiSummaryAction);

			const aiMetadata = queryByTestId(`${testIdBase}-ai-metadata`);

			expect(aiMetadata).toBeNull();
		});
	});
});
