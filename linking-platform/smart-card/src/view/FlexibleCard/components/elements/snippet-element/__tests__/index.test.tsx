import React from 'react';
import { css } from '@emotion/react';
import { IntlProvider } from 'react-intl-next';
import { render } from '@testing-library/react';
import { messages } from '../../../../../../messages';
import { type FlexibleUiDataContext } from '../../../../../../state/flexible-ui-context/types';
import { FlexibleUiContext } from '../../../../../../state/flexible-ui-context';
import Snippet from '../index';
import { token } from '@atlaskit/tokens';

describe('Snippet', () => {
	const snippetContent = 'Smart link snippet';
	const overrideContent = 'This is a prop content';
	const testId = 'snippet-test';

	const setup = (
		context: FlexibleUiDataContext = {},
		props: React.ComponentProps<typeof Snippet> = {},
	) =>
		render(
			<IntlProvider locale="en">
				<FlexibleUiContext.Provider value={context}>
					<Snippet testId={testId} {...props} />
				</FlexibleUiContext.Provider>
			</IntlProvider>,
		);

	it('renders Snippet element', () => {
		const { queryByTestId } = setup({ snippet: snippetContent });
		const snippet = queryByTestId(testId);
		expect(snippet?.textContent).toBe(snippetContent);
		expect(snippet).toHaveStyleDeclaration('color', 'var(--ds-text, #172B4D)');
	});

	it('does not renders Snippet element without data context', () => {
		const { queryByTestId } = setup();
		expect(queryByTestId(testId)).not.toBeInTheDocument();
	});

	describe('content and message', () => {
		it('renders override content', () => {
			const { queryByTestId } = setup(undefined, { content: overrideContent });
			const snippet = queryByTestId(testId);
			expect(snippet?.textContent).toBe(overrideContent);
		});

		it('renders intl message', () => {
			const { queryByTestId } = setup(undefined, {
				message: { descriptor: messages.actions },
			});
			const snippet = queryByTestId(testId);
			expect(snippet?.textContent).toBe(messages.actions.defaultMessage);
		});

		it('renders intl message as priority', () => {
			const { queryByTestId } = setup(
				{ snippet: snippetContent },
				{
					content: overrideContent,
					message: { descriptor: messages.actions },
				},
			);
			const snippet = queryByTestId(testId);

			expect(snippet?.textContent).toBe(messages.actions.defaultMessage);
		});

		it('renders override content as second priority', () => {
			const { queryByTestId } = setup({ snippet: snippetContent }, { content: overrideContent });
			const snippet = queryByTestId(testId);
			expect(snippet?.textContent).toBe(overrideContent);
		});
	});

	describe('maxLines', () => {
		it('renders Snippet element with default maxLines', () => {
			const { queryByTestId } = setup({ snippet: snippetContent });
			const snippet = queryByTestId(testId);
			expect(snippet).toHaveStyleDeclaration('-webkit-line-clamp', '3');
		});

		it('renders Snippet element with provided maxLines', () => {
			const { queryByTestId } = setup({ snippet: snippetContent }, { maxLines: 1 });
			const snippet = queryByTestId(testId);
			expect(snippet).toHaveStyleDeclaration('-webkit-line-clamp', '1');
		});
	});

	describe('overrideCss', () => {
		const defaultColor = 'var(--ds-text, #172B4D)';
		it('renders Snippet element with default styles', () => {
			const { queryByTestId } = setup({ snippet: snippetContent });
			const snippet = queryByTestId(testId);
			expect(snippet).toHaveStyleDeclaration('color', defaultColor);
		});

		it('renders Snippet element with provided styles', () => {
			const { queryByTestId } = setup(
				{ snippet: snippetContent },
				{
					overrideCss: css({
						margin: token('space.1000', '80px'),
					}),
				},
			);
			const snippet = queryByTestId(testId);
			expect(snippet).toHaveStyleDeclaration('color', defaultColor);
			expect(snippet).toHaveStyleDeclaration('margin', 'var(--ds-space-1000, 80px)');
		});

		it('renders Snippet element with override styles', () => {
			const { queryByTestId } = setup(
				{ snippet: snippetContent },
				{
					overrideCss: css({
						color: 'white',
					}),
				},
			);
			const snippet = queryByTestId(testId);
			expect(snippet).toHaveStyleDeclaration('color', 'white');
		});
	});
});
