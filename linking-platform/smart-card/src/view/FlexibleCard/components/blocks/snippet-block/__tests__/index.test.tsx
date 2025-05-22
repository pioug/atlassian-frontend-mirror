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
import SnippetBlock from '../index';

describe('SnippetBlock', () => {
	ffTest.both('platform-linking-flexible-card-context', 'with fg', () => {
		it('renders SnippetBlock', async () => {
			const testId = 'test-smart-block-snippet';
			render(<SnippetBlock status={SmartLinkStatus.Resolved} testId={testId} />, {
				wrapper: getFlexibleCardTestWrapper(context),
			});

			const block = await screen.findByTestId(`${testId}-resolved-view`);

			expect(block).toBeDefined();
			expect(block).toHaveTextContent('Lorem ipsum dolor sit amet, consectetur adipiscing elit.');
		});

		describe('with maxLines', () => {
			it('renders with default maxLines', async () => {
				const testId = 'smart-element-text';
				render(<SnippetBlock status={SmartLinkStatus.Resolved} />, {
					wrapper: getFlexibleCardTestWrapper(context),
				});

				const element = await screen.findByTestId(testId);

				expect(element).toHaveCompiledCss('-webkit-line-clamp', '3');
			});

			it('renders with specific maxLines', async () => {
				const testId = 'smart-element-text';
				render(<SnippetBlock maxLines={2} status={SmartLinkStatus.Resolved} />, {
					wrapper: getFlexibleCardTestWrapper(context),
				});

				const element = await screen.findByTestId(testId);

				expect(element).toHaveCompiledCss('-webkit-line-clamp', '2');
			});

			it('renders specific maxLines above the default maxlines', async () => {
				const testId = 'smart-element-text';
				render(<SnippetBlock maxLines={6} status={SmartLinkStatus.Resolved} />, {
					wrapper: getFlexibleCardTestWrapper(context),
				});

				const element = await screen.findByTestId(testId);

				expect(element).toHaveCompiledCss('-webkit-line-clamp', '6');
			});

			it('renders with default maximum maxLines when maxLines exceed maximum', async () => {
				const testId = 'smart-element-text';
				render(<SnippetBlock maxLines={7} status={SmartLinkStatus.Resolved} />, {
					wrapper: getFlexibleCardTestWrapper(context),
				});

				const element = await screen.findByTestId(testId);

				expect(element).toHaveCompiledCss('-webkit-line-clamp', '3');
			});
		});

		it('should not render text for a non resolved state', async () => {
			const testId = 'smart-element-text';
			render(<SnippetBlock status={SmartLinkStatus.Resolving} />, {
				wrapper: getFlexibleCardTestWrapper(context),
			});
			await waitFor(() => {
				expect(screen.queryByTestId(testId)).toBeNull();
			});
		});

		it('renders with text for a non resolved state when text is overridden', async () => {
			const testId = 'smart-element-text';
			render(
				<SnippetBlock
					text="text override for a non resolved state"
					status={SmartLinkStatus.Resolving}
				/>,
				{ wrapper: getFlexibleCardTestWrapper(context) },
			);

			const block = await screen.findByTestId(testId);

			expect(block).toHaveTextContent('text override for a non resolved state');
		});

		it('renders with override text', async () => {
			const testId = 'smart-element-text';
			render(<SnippetBlock text="text override" status={SmartLinkStatus.Resolved} />, {
				wrapper: getFlexibleCardTestWrapper(context),
			});

			const block = await screen.findByTestId(testId);

			expect(block).toHaveTextContent('text override');
		});

		it('renders with override css', async () => {
			const overrideCss = css({
				backgroundColor: 'blue',
			});
			render(<SnippetBlock css={overrideCss} status={SmartLinkStatus.Resolved} testId="css" />, {
				wrapper: getFlexibleCardTestWrapper(context),
			});

			const block = await screen.findByTestId('css-resolved-view');

			expect(block).toHaveCompiledCss('background-color', 'blue');
		});
	});
});
