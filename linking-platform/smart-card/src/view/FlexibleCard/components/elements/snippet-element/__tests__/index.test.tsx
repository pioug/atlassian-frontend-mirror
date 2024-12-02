import React from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css } from '@emotion/react';
import { render, screen } from '@testing-library/react';
import { IntlProvider } from 'react-intl-next';

import { token } from '@atlaskit/tokens';

import { messages } from '../../../../../../messages';
import { FlexibleUiContext } from '../../../../../../state/flexible-ui-context';
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
		render(
			<IntlProvider locale="en">
				<FlexibleUiContext.Provider value={context}>
					<Snippet testId={testId} {...props} />
				</FlexibleUiContext.Provider>
			</IntlProvider>,
		);

	it('renders Snippet element', () => {
		setup({ snippet: snippetContent });
		const snippet = screen.queryByTestId(testId);
		expect(snippet).toHaveTextContent(snippetContent);
		expect(snippet).toHaveStyleDeclaration('color', 'var(--ds-text, #172B4D)');
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
			expect(snippet).toHaveStyleDeclaration('-webkit-line-clamp', '3');
		});

		it('renders Snippet element with provided maxLines', () => {
			setup({ snippet: snippetContent }, { maxLines: 1 });
			const snippet = screen.queryByTestId(testId);
			expect(snippet).toHaveStyleDeclaration('-webkit-line-clamp', '1');
		});
	});

	describe('overrideCss', () => {
		const defaultColor = 'var(--ds-text, #172B4D)';
		it('renders Snippet element with default styles', () => {
			setup({ snippet: snippetContent });
			const snippet = screen.queryByTestId(testId);
			expect(snippet).toHaveStyleDeclaration('color', defaultColor);
		});

		it('renders Snippet element with provided styles', () => {
			setup(
				{ snippet: snippetContent },
				{
					overrideCss: css({
						margin: token('space.1000', '80px'),
					}),
				},
			);
			const snippet = screen.queryByTestId(testId);
			expect(snippet).toHaveStyleDeclaration('color', defaultColor);
			expect(snippet).toHaveStyleDeclaration('margin', 'var(--ds-space-1000, 80px)');
		});

		it('renders Snippet element with override styles', () => {
			setup(
				{ snippet: snippetContent },
				{
					overrideCss: css({
						color: 'white',
					}),
				},
			);
			const snippet = screen.queryByTestId(testId);
			expect(snippet).toHaveStyleDeclaration('color', 'white');
		});
	});
});
