import React from 'react';

import { fireEvent, render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';

import { failGate, passGate } from '@atlassian/feature-flags-test-utils/mock-gates';

import TextArea from '../../text-area';
import type { TextAreaProps } from '../../types';

const inputMotionGate = 'platform-dst-motion-uplift-input';
const inputTransition =
	'var(--ds-input,background-color border-color box-shadow .15s cubic-bezier(.4,1,.6,1))';
const legacyTransition = 'background-color .2s ease-in-out,border-color .2s ease-in-out';

// eslint-disable-next-line @atlassian/a11y/require-jest-coverage
describe('TextArea', () => {
	const testId = 'testId';

	const createTextArea = (props: TextAreaProps = {}) => (
		<label htmlFor="name">
			Name
			<TextArea testId={testId} {...props} />
		</label>
	);
	describe('TextArea props', () => {
		describe('isDisabled prop', () => {
			it('should sets textarea as disabled', () => {
				render(createTextArea({ isDisabled: true }));
				const textarea = screen.getByTestId(testId) as HTMLTextAreaElement;
				expect(textarea).toBeDisabled();
			});

			it('should not set textarea as disabled', () => {
				render(createTextArea());
				const textarea = screen.getByTestId(testId) as HTMLTextAreaElement;
				expect(textarea).toBeEnabled();
			});
		});

		describe('isReadOnly prop', () => {
			it('should sets textarea as readonly', () => {
				render(createTextArea({ isReadOnly: true }));
				const textarea = screen.getByTestId(testId) as HTMLTextAreaElement;
				expect(textarea.readOnly).toBe(true);
			});

			it('should not set textarea as readonly', () => {
				render(createTextArea());
				const textarea = screen.getByTestId(testId) as HTMLTextAreaElement;
				expect(textarea.readOnly).toBe(false);
			});
		});

		describe('isRequired prop', () => {
			it('should set textarea as required', () => {
				render(createTextArea({ isRequired: true }));
				const textarea = screen.getByTestId(testId) as HTMLTextAreaElement;
				expect(textarea).toBeRequired();
			});
			it('should not set textarea as required', () => {
				render(createTextArea());
				const textarea = screen.getByTestId(testId) as HTMLTextAreaElement;
				expect(textarea).not.toBeRequired();
			});
		});

		describe('value prop', () => {
			it('should set textarea value', () => {
				const value = 'value';
				render(createTextArea({ value }));
				const textarea = screen.getByTestId(testId) as HTMLTextAreaElement;
				expect(textarea.value).toBe(value);
			});
		});

		describe('defaultValue prop', () => {
			it('should set textarea defaultValue', () => {
				const defaultValue = 'value';
				render(createTextArea({ defaultValue }));
				const textarea = screen.getByTestId(testId) as HTMLTextAreaElement;
				expect(textarea.defaultValue).toBe(defaultValue);
			});
		});

		describe('spellCheck prop', () => {
			it('should enable textarea spellcheck', () => {
				render(createTextArea({ spellCheck: true }));
				const textarea = screen.getByTestId(testId) as HTMLTextAreaElement;
				expect(textarea).toHaveAttribute('spellcheck', 'true');
			});

			it('should not enable textarea spellcheck', () => {
				render(createTextArea({ spellCheck: false }));
				const textarea = screen.getByTestId(testId) as HTMLTextAreaElement;
				expect(textarea).toHaveAttribute('spellcheck', 'false');
			});
		});

		describe('placeholder prop', () => {
			it('textarea have passed text in placeholder attribute', () => {
				const placeholder = 'placeholder';
				render(createTextArea({ placeholder }));
				const textarea = screen.getByTestId(testId) as HTMLTextAreaElement;
				expect(textarea).toHaveAttribute('placeholder', placeholder);
			});
		});

		describe('name prop', () => {
			it('textarea have passed text in name attribute', () => {
				const name = 'name';
				render(createTextArea({ name }));
				const textarea = screen.getByTestId(testId) as HTMLTextAreaElement;
				expect(textarea).toHaveAttribute('name', name);
			});
		});
	});

	describe('TextArea input change', () => {
		it('onChange should be called when input value changes', async () => {
			const user = userEvent.setup();
			const spy = jest.fn();
			render(createTextArea({ onChange: spy }));
			const textarea = screen.getByTestId(testId) as HTMLTextAreaElement;
			await user.type(textarea, 'foo');
			expect(spy).toHaveBeenCalledTimes(3);
		});

		it('onChange should be called when input value changes for resize vertical textarea', async () => {
			const user = userEvent.setup();
			const spy = jest.fn();
			render(
				createTextArea({
					onChange: spy,
					resize: 'vertical',
				}),
			);
			const textarea = screen.getByTestId(testId) as HTMLTextAreaElement;
			await user.type(textarea, 'foo');
			expect(spy).toHaveBeenCalledTimes(3);
		});
	});

	describe('TextArea input focus', () => {
		it('onFocus should be called when input gets focus', () => {
			const spy = jest.fn();
			render(createTextArea({ onFocus: spy }));
			const textarea = screen.getByTestId(testId) as HTMLTextAreaElement;
			fireEvent.focus(textarea);
			expect(spy).toHaveBeenCalledTimes(1);
		});
	});

	describe('TextArea input blur', () => {
		it('onBlur should be called when input gets blur', () => {
			const spy = jest.fn();
			render(createTextArea({ onBlur: spy }));
			const textarea = screen.getByTestId(testId) as HTMLTextAreaElement;
			fireEvent.blur(textarea);
			expect(spy).toHaveBeenCalledTimes(1);
		});
	});

	describe('props', () => {
		it('should pass all the extra props passed down to hidden input', () => {
			const value = 'value';
			// @ts-ignore JSX allows data props
			render(createTextArea({ 'data-foo': value }));
			const textarea = screen.getByTestId(testId) as HTMLTextAreaElement;
			expect(textarea).toHaveAttribute('data-foo', value);
		});

		it('should use ref prop when resize is smart', () => {
			const spy = jest.fn();
			render(createTextArea({ resize: 'smart', ref: spy }));
			expect(spy).toHaveBeenCalledTimes(1);
		});

		it('should use ref prop when resize is not smart', () => {
			const spy = jest.fn();
			render(createTextArea({ resize: 'vertical', ref: spy }));
			expect(spy).toHaveBeenCalledTimes(1);
		});
	});

	describe('motion', () => {
		it('uses the input motion token for rest and focus when the input motion gate is on', () => {
			passGate(inputMotionGate);
			render(createTextArea());

			const textarea = screen.getByTestId(testId);
			expect(textarea).toHaveCompiledCss('transition', inputTransition);
			expect(textarea).toHaveCompiledCss('border-width', 'var(--ds-border-width,1px)');

			fireEvent.focus(textarea);
			expect(textarea).toHaveCompiledCss('transition', inputTransition);

			fireEvent.blur(textarea);
			expect(textarea).toHaveCompiledCss('transition', inputTransition);
		});

		it('uses the input motion token when the input becomes invalid', () => {
			passGate(inputMotionGate);
			const { rerender } = render(createTextArea());

			const textarea = screen.getByTestId(testId);
			fireEvent.focus(textarea);
			expect(textarea).toHaveCompiledCss('transition', inputTransition);

			rerender(createTextArea({ isInvalid: true }));
			expect(textarea).toHaveCompiledCss('transition', inputTransition);
			expect(textarea).toHaveCompiledCss('border-width', 'var(--ds-border-width,1px)');

			rerender(createTextArea());
			expect(textarea).toHaveCompiledCss('transition', inputTransition);
		});

		it('preserves the legacy transition when the input motion gate is off', () => {
			failGate(inputMotionGate);
			render(createTextArea());

			const textarea = screen.getByTestId(testId);
			expect(textarea).toHaveCompiledCss('transition', legacyTransition);
		});

		it('retains non-spatial input transitions under reduced motion', () => {
			passGate(inputMotionGate);
			render(createTextArea());

			const textarea = screen.getByTestId(testId);
			expect(textarea).toHaveCompiledCss('transition', inputTransition);
			expect(textarea).not.toHaveCompiledCss('transition', 'none', {
				media: '(prefers-reduced-motion: reduce)',
			});
			expect(textarea).not.toHaveCompiledCss('transition-duration', '0s', {
				media: '(prefers-reduced-motion: reduce)',
			});
		});

		it.each<[string, TextAreaProps]>([
			['disabled', { isDisabled: true }],
			['read-only', { isReadOnly: true }],
		])('does not apply interactive motion to %s inputs', (_, props) => {
			passGate(inputMotionGate);
			render(createTextArea(props));

			const textarea = screen.getByTestId(testId);
			expect(textarea).not.toHaveCompiledCss('transition', inputTransition);
		});
	});
});
