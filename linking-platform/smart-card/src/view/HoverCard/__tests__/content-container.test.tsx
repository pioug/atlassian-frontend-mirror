import React from 'react';
import { render } from '@testing-library/react';
import ContentContainer from '../components/ContentContainer';
import { hoverCardClassName } from '../components/HoverCardContent';
import type { ContentContainerProps } from '../types';
import { useAISummary } from '../../../state/hooks/use-ai-summary';
import { Provider as SmartCardProvider } from '@atlaskit/smart-card';
import type { ProductType } from '@atlaskit/linking-common';

jest.mock('../../../state/hooks/use-ai-summary', () => ({
	useAISummary: jest.fn().mockReturnValue({ state: { status: 'ready' } }),
}));

describe('ContentContainer', () => {
	const content = 'test content';
	const testId = 'test-id';
	const url = 'https://some.url';

	const setup = (
		props: Partial<
			ContentContainerProps & {
				product: ProductType | undefined;
			}
		> = {},
	) =>
		render(
			<SmartCardProvider
				storeOptions={{
					initialState: {
						[url]: {
							status: 'resolved',
							details: {
								data: { url: url },
							} as any,
						},
					},
				}}
				product={props.product}
			>
				<ContentContainer testId={testId} url={url} {...props}>
					{content}
				</ContentContainer>
			</SmartCardProvider>,
		);

	it('returns hover card content container', async () => {
		const { findByTestId } = setup();

		const contentContainer = await findByTestId(testId);

		expect(contentContainer).toBeInTheDocument();
		expect(contentContainer.textContent).toBe(content);
		expect(contentContainer.classList.contains(hoverCardClassName)).toBe(true);
	});

	describe('when AI summary is enabled', () => {
		it('wraps container in AI prism', async () => {
			const { findByTestId } = setup({ isAIEnabled: true });
			const prism = await findByTestId(`${testId}-prism`);
			const svg = prism.querySelector('svg');

			expect(prism).toBeInTheDocument();
			expect(svg).toHaveStyleDeclaration('opacity', '0');
		});

		it('shows AI prism', async () => {
			(useAISummary as jest.Mock).mockReturnValue({
				state: { status: 'loading', content: '' },
				summariseUrl: jest.fn(),
			});

			const { findByTestId } = setup({
				isAIEnabled: true,
			});

			const prism = await findByTestId(`${testId}-prism`);
			const svg = prism.querySelector('svg');
			expect(svg).toHaveStyleDeclaration('opacity', '1');
		});

		it('should call the useAISummary hook with a product name when it`s available in SmartLinkContext', () => {
			const productName: ProductType = 'ATLAS';
			setup({
				isAIEnabled: true,
				product: productName,
			});

			expect(useAISummary).toHaveBeenCalledWith(
				expect.objectContaining({
					product: productName,
				}),
			);
			(useAISummary as jest.Mock).mockClear();
		});
	});
});
