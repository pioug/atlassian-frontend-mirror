import React from 'react';

import { matchers } from '@emotion/jest';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import CommentField, { type CommentFieldProps } from '../../field';

expect.extend(matchers);

describe('@atlaskit comments', () => {
	describe('CommentField', () => {
		describe('exports', () => {
			it('the CommentField component', () => {
				expect(CommentField).not.toBe(undefined);
			});
		});

		describe('construction', () => {
			it('should be able to create a component', () => {
				render(<CommentField testId="comment-field" />);

				expect(screen.getByTestId('comment-field')).toBeInTheDocument();
			});

			describe('if href provided', () => {
				it('should render a link', () => {
					const children = <span>children</span>;
					const href = '/test-href';
					render(<CommentField href={href}>{children}</CommentField>);

					const link = screen.getByRole('link');

					expect(link).toBeInTheDocument();
					expect(link).toHaveAttribute('href', href);
					expect(screen.getByText('children')).toBeInTheDocument();
				});

				it('should render link with author styles', () => {
					render(
						<CommentField href="#" hasAuthor>
							Comment
						</CommentField>,
					);

					expect(screen.getByRole('link')).toHaveStyleRule(
						'font-weight',
						'var(--ds-font-weight-medium, 500)',
					);
				});
			});

			describe('if href not provided', () => {
				it('should render a span', () => {
					const children = <p>children</p>;
					const { container } = render(<CommentField>{children}</CommentField>);

					expect(container.querySelector('span')).toBeInTheDocument();
					expect(screen.queryByRole('link')).not.toBeInTheDocument();
					expect(screen.getByText('children')).toBeInTheDocument();
				});

				it('should render span with author styles', () => {
					render(<CommentField hasAuthor testId="comment-field" />);

					expect(screen.getByTestId('comment-field')).toHaveStyleRule(
						'font-weight',
						'var(--ds-font-weight-medium, 500)',
					);
				});
			});
		});

		describe('if onClick, onFocus, and onMouseOver props provided', () => {
			afterEach(() => {
				jest.resetAllMocks();
			});

			it('should pass onClick, onFocus, and onMouseOver functions to link via props', async () => {
				const onClickMock = jest.fn();
				const onHoverMock = jest.fn();
				const onFocusMock = jest.fn();

				const props: CommentFieldProps = {
					onClick: onClickMock,
					onFocus: onFocusMock,
					onMouseOver: onHoverMock,
					href: '#',
				};
				render(<CommentField {...props}>Reply</CommentField>);

				const link = screen.getByRole('link');
				const user = userEvent.setup();

				await user.click(link);
				expect(onClickMock).toHaveBeenCalledTimes(1);
				expect(onHoverMock).toHaveBeenCalledTimes(1);

				jest.clearAllMocks();
				fireEvent.focus(link);
				expect(onFocusMock).toHaveBeenCalledTimes(1);
			});
		});
	});
});
