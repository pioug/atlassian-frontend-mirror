import React from 'react';

import { createEvent, fireEvent, render, screen } from '@testing-library/react';

import { asMock } from '@atlaskit/link-test-helpers/jest';
import { browser } from '@atlaskit/linking-common/user-agent';
import { skipAutoA11yFile } from '@atlassian/a11y-jest-testing';

import { testIds, TextInput, type TextInputProps } from './index';

// This file exposes one or more accessibility violations. Testing is currently skipped but violations need to
// be fixed in a timely manner or result in escalation. Once all violations have been fixed, you can remove
// the next line and associated import. For more information, see go/afm-a11y-tooling:jest
skipAutoA11yFile();

jest.mock('@atlaskit/linking-common/user-agent', () => ({
	browser: jest.fn(() => ({
		mac: false,
	})),
}));

describe('TextInput', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	const setup = (props?: Partial<TextInputProps>) => {
		render(<TextInput testId="link-url" name="test" value="" {...props} />);

		return {
			input: screen.getByRole('textbox'),
		};
	};

	it('should call `onKeyDown` when a key is pressed', () => {
		const onKeyDown = jest.fn();
		const { input } = setup({ onKeyDown });

		const event = createEvent.keyDown(input, {
			bubbles: true,
			cancelable: true,
		});

		fireEvent(input, event);
		expect(onKeyDown).toHaveBeenCalled();
	});

	it('should not `preventDefault` on KeyDown event when key is pressed', () => {
		const { input } = setup();

		const event = createEvent.keyDown(input, {
			bubbles: true,
			cancelable: true,
		});

		fireEvent(input, event);
		expect(event.defaultPrevented).toBe(false);
	});

	describe('undo/redo', () => {
		describe('on win platform', () => {
			it('on ctrl+z calls `onUndo` handler', async () => {
				const onUndo = jest.fn();
				const { input } = setup({ onUndo });

				const event = createEvent.keyDown(input, {
					bubbles: true,
					cancelable: true,
					keyCode: 90,
					ctrlKey: true,
				});

				fireEvent(input, event);

				expect(onUndo).toHaveBeenCalled();
				expect(event.defaultPrevented).toBe(true);
			});

			it('on ctrl+y calls `onRedo` handler', async () => {
				const onRedo = jest.fn();
				const { input } = setup({ onRedo });

				const event = createEvent.keyDown(input, {
					bubbles: true,
					cancelable: true,
					keyCode: 89,
					ctrlKey: true,
				});

				fireEvent(input, event);

				expect(onRedo).toHaveBeenCalled();
				expect(event.defaultPrevented).toBe(true);
			});
		});

		describe('on mac platform', () => {
			beforeEach(() => {
				asMock(browser).mockReturnValue({ mac: true });
			});

			it('on cmd+z calls `onUndo` handler', async () => {
				const onUndo = jest.fn();
				const { input } = setup({ onUndo });

				const event = createEvent.keyDown(input, {
					bubbles: true,
					cancelable: true,
					keyCode: 90,
					metaKey: true,
				});

				fireEvent(input, event);

				expect(onUndo).toHaveBeenCalled();
				expect(event.defaultPrevented).toBe(true);
			});

			it('on cmd+shift+z calls onRedo handler', () => {
				const onRedo = jest.fn();
				const { input } = setup({ onRedo });

				const event = createEvent.keyDown(input, {
					bubbles: true,
					cancelable: true,
					keyCode: 90,
					shiftKey: true,
					metaKey: true,
				});

				fireEvent(input, event);

				expect(onRedo).toHaveBeenCalled();
				expect(event.defaultPrevented).toBe(true);
			});

			it('should not undo if cmd+z is pressed with shift', () => {
				const onUndo = jest.fn();
				const { input } = setup({ onUndo });

				const event = createEvent.keyDown(input, {
					bubbles: true,
					cancelable: true,
					keyCode: 90,
					shiftKey: true,
					metaKey: true,
				});

				fireEvent(input, event);

				expect(onUndo).not.toHaveBeenCalled();
				expect(event.defaultPrevented).toBe(false);
			});
		});
	});

	it('should not focus input if `autoFocus` prop is not provided', () => {
		const { input } = setup();

		expect(input).not.toHaveFocus();
	});

	it('should focus input if `autoFocus` prop set to true', () => {
		const { input } = setup({ autoFocus: true });

		expect(input).toHaveFocus();
	});

	it('should stop propagation of the event when clear button is activated', async () => {
		setup({ value: 'XYZ' });

		const clearButton = screen.getByTestId(testIds.clearUrlButton);
		clearButton.focus();

		const event = createEvent.click(clearButton, {
			bubbles: true,
			cancelable: true,
		});

		Object.assign(event, {
			stopPropagation: jest.fn(),
		});

		fireEvent(clearButton, event);
		expect(event.defaultPrevented).toBe(true);
		expect(event.stopPropagation).toHaveBeenCalled();
	});

	it('should capture and report a11y violations', async () => {
		const { container } = render(<TextInput testId="link-url" name="test" value="" label="test" />);
		await expect(container).toBeAccessible();
	});
});
