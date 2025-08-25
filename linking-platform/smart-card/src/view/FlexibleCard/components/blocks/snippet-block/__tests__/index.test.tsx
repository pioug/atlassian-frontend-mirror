/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { css, jsx } from '@compiled/react';
import { render, screen, waitFor } from '@testing-library/react';

import { ffTest } from '@atlassian/feature-flags-test-utils';

import context from '../../../../../../__fixtures__/flexible-ui-data-context';
import { getFlexibleCardTestWrapper } from '../../../../../../__tests__/__utils__/unit-testing-library-helpers';
import { SmartLinkStatus } from '../../../../../../constants';
import { useFlexibleUiOptionContext } from '../../../../../../state/flexible-ui-context';
import { useSmartLinkRenderers } from '../../../../../../state/renderers';
import SnippetBlock from '../index';

jest.mock('../../../../../../state/renderers', () => ({
	useSmartLinkRenderers: jest.fn(),
}));

jest.mock('../../../../../../state/flexible-ui-context', () => ({
	...jest.requireActual('../../../../../../state/flexible-ui-context'),
	useFlexibleUiOptionContext: jest.fn(),
}));

describe('SnippetBlock', () => {
	it('renders SnippetBlock', async () => {
		const testId = 'test-smart-block-snippet';
		render(<SnippetBlock testId={testId} />, {
			wrapper: getFlexibleCardTestWrapper(context),
		});

		const block = await screen.findByTestId(`${testId}-resolved-view`);

		expect(block).toBeDefined();
		expect(block).toHaveTextContent('Lorem ipsum dolor sit amet, consectetur adipiscing elit.');
	});

	describe('with maxLines', () => {
		it('should capture and report a11y violations', async () => {
			const { container } = render(<SnippetBlock />, {
				wrapper: getFlexibleCardTestWrapper(context),
			});

			await expect(container).toBeAccessible();
		});

		it('renders with default maxLines', async () => {
			const testId = 'smart-element-text';
			render(<SnippetBlock />, {
				wrapper: getFlexibleCardTestWrapper(context),
			});

			const element = await screen.findByTestId(testId);

			expect(element).toHaveCompiledCss('-webkit-line-clamp', '3');
		});

		it('renders with specific maxLines', async () => {
			const testId = 'smart-element-text';
			render(<SnippetBlock maxLines={2} />, {
				wrapper: getFlexibleCardTestWrapper(context),
			});

			const element = await screen.findByTestId(testId);

			expect(element).toHaveCompiledCss('-webkit-line-clamp', '2');
		});

		it('renders specific maxLines above the default maxlines', async () => {
			const testId = 'smart-element-text';
			render(<SnippetBlock maxLines={6} />, {
				wrapper: getFlexibleCardTestWrapper(context),
			});

			const element = await screen.findByTestId(testId);

			expect(element).toHaveCompiledCss('-webkit-line-clamp', '6');
		});

		it('renders with default maximum maxLines when maxLines exceed maximum', async () => {
			const testId = 'smart-element-text';
			render(<SnippetBlock maxLines={7} />, {
				wrapper: getFlexibleCardTestWrapper(context),
			});

			const element = await screen.findByTestId(testId);

			expect(element).toHaveCompiledCss('-webkit-line-clamp', '3');
		});
	});

	it('should not render text for a non resolved state', async () => {
		const testId = 'smart-element-text';
		render(<SnippetBlock />, {
			wrapper: getFlexibleCardTestWrapper(context, undefined, SmartLinkStatus.Resolving),
		});
		await waitFor(() => {
			expect(screen.queryByTestId(testId)).toBeNull();
		});
	});

	it('renders with text for a non resolved state when text is overridden', async () => {
		const testId = 'smart-element-text';
		render(<SnippetBlock text="text override for a non resolved state" />, {
			wrapper: getFlexibleCardTestWrapper(context, undefined, SmartLinkStatus.Resolving),
		});

		const block = await screen.findByTestId(testId);

		expect(block).toHaveTextContent('text override for a non resolved state');
	});

	it('renders with override text', async () => {
		const testId = 'smart-element-text';
		render(<SnippetBlock text="text override" />, {
			wrapper: getFlexibleCardTestWrapper(context),
		});

		const block = await screen.findByTestId(testId);

		expect(block).toHaveTextContent('text override');
	});

	it('renders with override css', async () => {
		const overrideCss = css({
			backgroundColor: 'blue',
		});
		render(<SnippetBlock css={overrideCss} testId="css" />, {
			wrapper: getFlexibleCardTestWrapper(context),
		});

		const block = await screen.findByTestId('css-resolved-view');

		expect(block).toHaveCompiledCss('background-color', 'blue');
	});

	ffTest.on('cc-ai-linking-platform-snippet-renderer', 'with fg on', () => {
		describe('with renderers', () => {
			const MockReplacement = ({
				fallbackText,
				contentId,
				contentType,
				cloudId,
			}: {
				cloudId: string;
				contentId: string;
				contentType: string;
				fallbackText?: string;
			}) => (
				<div data-testid="mock-replacement">
					{fallbackText} - {contentId} - {contentType} - {cloudId}
				</div>
			);

			it('renders with replacement component when enabled', async () => {
				(useSmartLinkRenderers as jest.Mock).mockReturnValue({
					snippet: MockReplacement,
				});
				(useFlexibleUiOptionContext as jest.Mock).mockReturnValue({
					enableSnippetRenderer: true,
				});

				render(<SnippetBlock />, { wrapper: getFlexibleCardTestWrapper(context) });

				const replacement = await screen.findByTestId('mock-replacement');
				expect(replacement).toHaveTextContent(
					'Lorem ipsum dolor sit amet, consectetur adipiscing elit. - 123 - page - tenant-123',
				);
			});

			it('renders fallback when renderer is disabled', async () => {
				(useSmartLinkRenderers as jest.Mock).mockReturnValue({
					snippet: MockReplacement,
				});
				(useFlexibleUiOptionContext as jest.Mock).mockReturnValue({
					enableSnippetRenderer: false,
				});

				render(<SnippetBlock />, { wrapper: getFlexibleCardTestWrapper(context) });

				const element = await screen.findByTestId('smart-element-text');
				expect(element).toHaveTextContent(
					'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
				);
			});

			it('renders fallback when renderer is undefined', async () => {
				(useSmartLinkRenderers as jest.Mock).mockReturnValue({
					snippet: MockReplacement,
				});
				(useFlexibleUiOptionContext as jest.Mock).mockReturnValue({
					enableSnippetRenderer: undefined,
				});

				render(<SnippetBlock />, { wrapper: getFlexibleCardTestWrapper(context) });

				const element = await screen.findByTestId('smart-element-text');
				expect(element).toHaveTextContent(
					'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
				);
			});
		});
	});
});
