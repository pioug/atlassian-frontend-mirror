import React from 'react';

import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import CommentAction, { type CommentActionItemProps } from '../../action-item';

// eslint-disable-next-line @atlassian/a11y/require-jest-coverage
describe('@atlaskit comments', () => {
	describe('CommentAction', () => {
		describe('exports', () => {
			it('the CommentAction component', () => {
				expect(CommentAction).not.toBe(undefined);
			});
		});

		describe('construction', () => {
			const user = userEvent.setup();

			afterEach(() => {
				jest.resetAllMocks();
			});

			it('should be able to create a component', async () => {
				render(<CommentAction>Reply</CommentAction>);

				const buttons = await screen.findAllByRole('button');

				expect(buttons).toHaveLength(1);
			});

			it('should render a Button containing the children', () => {
				const children = <span>children</span>;
				render(<CommentAction>{children}</CommentAction>);
				const button = screen.getByRole('button', { name: 'children' });

				expect(button).toBeInTheDocument();
			});

			it('should pass onClick, onFocus, and onMouseOver functions to button via props', async () => {
				const onClickMock = jest.fn();
				const onHoverMock = jest.fn();
				const onFocusMock = jest.fn();

				const props: CommentActionItemProps = {
					onClick: onClickMock,
					onFocus: onFocusMock,
					onMouseOver: onHoverMock,
				};
				render(<CommentAction {...props}>Reply</CommentAction>);

				const button = screen.getByRole('button');

				await user.click(button);
				expect(onClickMock).toHaveBeenCalledTimes(1);
				expect(onHoverMock).toHaveBeenCalledTimes(1);

				fireEvent.focus(button);
				expect(onFocusMock).toHaveBeenCalledTimes(1);
			});

			it('should disable button if isDisabled prop set to true', async () => {
				const onClickMock = jest.fn();
				render(
					<CommentAction isDisabled={true} onClick={onClickMock}>
						Reply
					</CommentAction>,
				);

				const button = screen.getByRole('button');

				await user.click(button);
				expect(onClickMock).not.toHaveBeenCalled();
				expect(button).toBeDisabled();
			});
		});
	});
});

describe('CommentAction with analytics', () => {
	beforeEach(() => {
		jest.spyOn(global.console, 'warn');
		jest.spyOn(global.console, 'error');
	});
	afterEach(() => {
		// @ts-ignore - Property 'mockRestore' does not exist
		global.console.warn.mockRestore();
		// @ts-ignore - Property 'mockRestore' does not exist
		global.console.error.mockRestore();
	});

	it('should mount without errors', () => {
		render(<CommentAction>Reply</CommentAction>);
		expect(console.warn).not.toHaveBeenCalled();
		expect(console.error).not.toHaveBeenCalled();
	});
});
