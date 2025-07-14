/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React from 'react';

import { css, jsx } from '@compiled/react';
import { render, screen } from '@testing-library/react';

import { token } from '@atlaskit/tokens';

import { getFlexibleCardTestWrapper } from '../../../../../../__tests__/__utils__/unit-testing-library-helpers';
import { messages } from '../../../../../../messages';
import { type FlexibleUiDataContext } from '../../../../../../state/flexible-ui-context/types';
import Snippet from '../index';

describe('Snippet', () => {
	const snippetContent = 'Smart link snippet';
	const overrideContent = 'This is a prop content';
	const testId = 'snippet-test';

	const setup = (
		context: FlexibleUiDataContext = {},
		props: React.ComponentProps<typeof Snippet> = {},
	) =>
		render(<Snippet testId={testId} {...props} />, {
			wrapper: getFlexibleCardTestWrapper(context),
		});

	it('renders Snippet element', () => {
		setup({ snippet: snippetContent });
		const snippet = screen.queryByTestId(testId);
		expect(snippet).toHaveTextContent(snippetContent);
		expect(snippet).toHaveCompiledCss('color', 'var(--ds-text,#172b4d)');
	});

	it('does not renders Snippet element without data context', () => {
		setup();
		expect(screen.queryByTestId(testId)).not.toBeInTheDocument();
	});

	describe('content and message', () => {
		it('renders override content', () => {
			setup(undefined, { content: overrideContent });
			const snippet = screen.queryByTestId(testId);
			expect(snippet).toHaveTextContent(overrideContent);
		});

		it('renders intl message', () => {
			setup(undefined, {
				message: { descriptor: messages.actions },
			});
			const snippet = screen.queryByTestId(testId);
			expect(snippet?.textContent).toBe(messages.actions.defaultMessage);
		});

		it('renders intl message as priority', () => {
			setup(
				{ snippet: snippetContent },
				{
					content: overrideContent,
					message: { descriptor: messages.actions },
				},
			);
			const snippet = screen.queryByTestId(testId);

			expect(snippet?.textContent).toBe(messages.actions.defaultMessage);
		});

		it('renders override content as second priority', () => {
			setup({ snippet: snippetContent }, { content: overrideContent });
			const snippet = screen.queryByTestId(testId);
			expect(snippet).toHaveTextContent(overrideContent);
		});
	});

	describe('maxLines', () => {
		it('renders Snippet element with default maxLines', () => {
			setup({ snippet: snippetContent });
			const snippet = screen.queryByTestId(testId);
			expect(snippet).toHaveCompiledCss('-webkit-line-clamp', '3');
		});

		it('renders Snippet element with provided maxLines', () => {
			setup({ snippet: snippetContent }, { maxLines: 1 });
			const snippet = screen.queryByTestId(testId);
			expect(snippet).toHaveCompiledCss('-webkit-line-clamp', '1');
		});
	});

	describe('overrideCss', () => {
		const defaultColor = 'var(--ds-text,#172b4d)';

		it('should capture and report a11y violations', async () => {
			const overrideCss = css({
				marginTop: token('space.1000', '80px'),
				marginRight: token('space.1000', '80px'),
				marginBottom: token('space.1000', '80px'),
				marginLeft: token('space.1000', '80px'),
			});
			const { container } = render(<Snippet testId={testId} css={overrideCss} />, {
				wrapper: getFlexibleCardTestWrapper({ snippet: snippetContent }),
			});

			await expect(container).toBeAccessible();
		});

		it('renders Snippet element with default styles', () => {
			setup({ snippet: snippetContent });
			const snippet = screen.queryByTestId(testId);
			expect(snippet).toHaveCompiledCss('color', defaultColor);
		});

		it('renders Snippet element with provided styles', () => {
			const overrideCss = css({
				marginTop: token('space.1000', '80px'),
				marginRight: token('space.1000', '80px'),
				marginBottom: token('space.1000', '80px'),
				marginLeft: token('space.1000', '80px'),
			});

			render(<Snippet testId={testId} css={overrideCss} />, {
				wrapper: getFlexibleCardTestWrapper({ snippet: snippetContent }),
			});
			const snippet = screen.queryByTestId(testId);
			expect(snippet).toHaveCompiledCss('color', defaultColor);
			expect(snippet).toHaveCompiledCss({
				marginTop: 'var(--ds-space-1000,5pc)',
				marginBottom: 'var(--ds-space-1000,5pc)',
				marginLeft: 'var(--ds-space-1000,5pc)',
				marginRight: 'var(--ds-space-1000,5pc)',
			});
		});

		it('renders Snippet element with override styles', () => {
			const overrideCss = css({
				color: 'white',
			});

			render(<Snippet testId={testId} css={overrideCss} />, {
				wrapper: getFlexibleCardTestWrapper({ snippet: snippetContent }),
			});
			const snippet = screen.queryByTestId(testId);
			expect(snippet).toHaveCompiledCss('color', '#fff');
		});
	});
});
