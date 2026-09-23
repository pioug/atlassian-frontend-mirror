import React from 'react';

import { fireEvent, render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';

import __noop from '@atlaskit/ds-lib/noop';
import { failGate, passGate } from '@atlassian/feature-flags-test-utils/mock-gates';

import Textfield from '../../text-field';
import { type TextfieldProps } from '../../types';

const inputMotionGate = 'platform-dst-motion-uplift-input';
const inputTransition =
	'var(--ds-input,background-color border-color box-shadow .15s cubic-bezier(.4,1,.6,1))';
const legacyTransition = 'background-color .2s ease-in-out,border-color .2s ease-in-out';

// eslint-disable-next-line @atlassian/a11y/require-jest-coverage
describe('Textfield', () => {
	const testId = 'test';

	type TextfieldPropsWithRef = TextfieldProps & { ref?: any };

	const createTextfield = (props: TextfieldPropsWithRef = {}) => (
		<label htmlFor="name">
			Name
			<Textfield id="name" testId={testId} {...props} />
		</label>
	);

	it('should show defaults', () => {
		render(createTextfield());
		const input = screen.getByTestId(testId);
		expect(input).toBeInTheDocument();
		expect(input).toBeInstanceOf(HTMLInputElement);
	});

	describe('Properties', () => {
		describe('Child Elements', () => {
			const beforeTestId = 'beforeElement';
			const afterTestId = 'afterElement';

			it('should render before element', () => {
				render(
					createTextfield({
						elemBeforeInput: <span data-testid={beforeTestId}>Before Element</span>,
					}),
				);
				const before = screen.getByTestId(beforeTestId);
				expect(before).toHaveTextContent('Before Element');
			});
			it('should render after element', () => {
				render(
					createTextfield({
						elemAfterInput: <span data-testid={afterTestId}>After Element</span>,
					}),
				);
				const after = screen.getByTestId(afterTestId);
				expect(after).toHaveTextContent('After Element');
			});
			it('should render before & after element', () => {
				render(
					createTextfield({
						elemBeforeInput: <span data-testid={beforeTestId}>Before Element</span>,
						elemAfterInput: <span data-testid={afterTestId}>After Element</span>,
					}),
				);

				const before = screen.getByTestId(beforeTestId);
				expect(before).toHaveTextContent('Before Element');
				const after = screen.getByTestId(afterTestId);
				expect(after).toHaveTextContent('After Element');
			});
		});

		describe('isDisabled', () => {
			it('should make input disabled', () => {
				render(createTextfield({ isDisabled: true }));
				const input = screen.getByTestId(testId);
				expect(input).toBeDisabled();
			});
		});

		describe('isInvalid', () => {
			it('should give input invalid styling if invalid', () => {
				render(createTextfield({ isInvalid: true }));
				const container = screen.getByTestId('test-container');
				const input = screen.getByTestId(testId);
				expect(container).toHaveAttribute('data-invalid', 'true');
				expect(input).toHaveAttribute('aria-invalid', 'true');
			});
		});

		describe('isReadOnly', () => {
			it('should make input readOnly', () => {
				render(createTextfield({ isReadOnly: true }));
				const input = screen.getByTestId(testId);
				expect(input).toHaveAttribute('readonly');
			});
		});

		describe('isRequired', () => {
			it('should make input required', () => {
				render(createTextfield({ isRequired: true }));
				const input = screen.getByTestId(testId);
				expect(input).toBeRequired();
			});
		});

		describe('name', () => {
			it('should set input name', () => {
				const name = 'testName';
				render(createTextfield({ name }));
				const input = screen.getByTestId(testId);
				expect(input).toHaveAttribute('name', name);
			});
		});

		describe('appearance', () => {
			it('should have a solid border when appearance is not none', () => {
				render(createTextfield());
				const textFieldContainer = screen.getByRole('presentation');
				expect(textFieldContainer).toHaveCompiledCss('border-style', 'solid');
			});

			it('should have no border when appearance is none', () => {
				render(createTextfield({ appearance: 'none' }));
				const textFieldContainer = screen.getByRole('presentation');
				expect(textFieldContainer).toHaveCompiledCss('border-style', 'none');
			});
		});

		describe('width', () => {
			const widthProps = [
				{ width: '', maxWidth: '100%' },
				{ width: 'xsmall', maxWidth: '80px' },
				{ width: 'small', maxWidth: '160px' },
				{ width: 'medium', maxWidth: '240px' },
				{ width: 'large', maxWidth: '320px' },
				{ width: 'xlarge', maxWidth: '480px' },
				{ width: '600', maxWidth: '600px' },
			];
			widthProps.forEach((widthProp) => {
				const { width, maxWidth } = widthProp;
				it(`max-width should be ${maxWidth} when width prop is ${
					!width ? 'not passed' : width
				}`, () => {
					render(createTextfield({ width }));
					const textFieldContainer = screen.getByRole('presentation');
					expect(textFieldContainer).toHaveStyle(`max-width: ${maxWidth}`);
				});
			});
		});

		describe('native input props', () => {
			it('should pass through any native input props to the input', () => {
				const nativeProps = {
					type: 'text',
					name: 'test',
					placeholder: 'test placeholder',
					maxLength: 8,
					min: 1,
					max: 8,
					autoComplete: 'on',
					form: 'test-form',
					pattern: '/.+/',
				};
				render(createTextfield(nativeProps));
				const textField = screen.getByTestId(testId);
				expect(textField).toHaveAttribute('type', nativeProps.type);
				expect(textField).toHaveAttribute('name', nativeProps.name);
				expect(textField).toHaveAttribute('placeholder', nativeProps.placeholder);
				expect(textField).toHaveAttribute('maxLength', nativeProps.maxLength.toString());
				expect(textField).toHaveAttribute('min', nativeProps.min.toString());
				expect(textField).toHaveAttribute('max', nativeProps.max.toString());
				expect(textField).toHaveAttribute('autocomplete', nativeProps.autoComplete);
				expect(textField).toHaveAttribute('pattern', nativeProps.pattern);
			});
		});

		describe('native input events', () => {
			const options = { target: { value: 'foo' } };
			const keyOptions = { key: 'Enter', code: 13, charCode: 13 };
			const nativeEvents = [
				{ prop: 'onChange', fireFunc: fireEvent.change, options },
				{ prop: 'onBlur', fireFunc: fireEvent.blur },
				{ prop: 'onFocus', fireFunc: fireEvent.focus },
				{ prop: 'onMouseDown', fireFunc: fireEvent.mouseDown },
				{
					prop: 'onKeyDown',
					fireFunc: fireEvent.keyDown,
					options: keyOptions,
				},
				{
					prop: 'onKeyPress',
					fireFunc: fireEvent.keyPress,
					options: keyOptions,
				},
				{ prop: 'onKeyUp', fireFunc: fireEvent.keyUp, options },
			];
			nativeEvents.forEach((event) => {
				it(`${event.prop}`, () => {
					const eventSpy = jest.fn();
					render(createTextfield({ [event.prop]: eventSpy }));
					const input = screen.getByTestId(testId) as HTMLInputElement;
					expect(eventSpy).toHaveBeenCalledTimes(0);
					event.fireFunc(input, event.options);
					expect(eventSpy).toHaveBeenCalledTimes(1);
				});
			});
		});

		describe('defaultValue', () => {
			it('should pass defaultValue to value on render', () => {
				render(createTextfield({ defaultValue: 'test default value' }));
				const input = screen.getByTestId(testId);
				expect(input).toHaveValue('test default value');
			});
		});

		describe('value', () => {
			it('should have value="test value"', () => {
				render(createTextfield({ onChange: __noop, value: 'test value' }));
				const input = screen.getByTestId(testId);
				expect(input).toHaveValue('test value');
			});
		});

		describe('onChange', () => {
			it('should update input value when called', async () => {
				const user = userEvent.setup();
				const spy = jest.fn();
				render(createTextfield({ onChange: spy }));
				const input = screen.getByTestId(testId) as HTMLInputElement;
				await user.type(input, 'foo');
				expect(input).toHaveValue('foo');
			});
		});

		describe('ref', () => {
			it('textfield ref should be an input', () => {
				let ref;
				render(
					createTextfield({
						ref: (input: HTMLInputElement | null) => {
							ref = input;
						},
					}),
				);
				expect(ref).toBeInstanceOf(HTMLInputElement);
			});
		});
	});

	describe('data-attributes', () => {
		it('text-field container & input styles should have corresponding data-attributes', () => {
			render(createTextfield({ isInvalid: true }));
			const container = screen.getByTestId(`${testId}-container`);
			expect(container).toHaveAttribute('data-ds--text-field--container', 'true');
			const input = screen.getByTestId(testId);
			expect(input).toHaveAttribute('data-ds--text-field--input', 'true');
		});
	});

	describe('motion', () => {
		it('uses the input motion token for rest and focus when the input motion gate is on', () => {
			passGate(inputMotionGate);
			render(createTextfield());

			const container = screen.getByTestId(`${testId}-container`);
			const input = screen.getByTestId(testId);
			expect(container).toHaveCompiledCss('transition', inputTransition);
			expect(container).toHaveCompiledCss('border-width', 'var(--ds-border-width,1px)');

			fireEvent.focus(input);
			expect(container).toHaveCompiledCss('transition', inputTransition);

			fireEvent.blur(input);
			expect(container).toHaveCompiledCss('transition', inputTransition);
		});

		it('uses the input motion token when the input becomes invalid', () => {
			passGate(inputMotionGate);
			const { rerender } = render(createTextfield());

			const container = screen.getByTestId(`${testId}-container`);
			const input = screen.getByTestId(testId);
			fireEvent.focus(input);
			expect(container).toHaveCompiledCss('transition', inputTransition);

			rerender(createTextfield({ isInvalid: true }));
			expect(container).toHaveCompiledCss('transition', inputTransition);
			expect(container).toHaveCompiledCss('border-width', 'var(--ds-border-width,1px)');

			rerender(createTextfield());
			expect(container).toHaveCompiledCss('transition', inputTransition);
		});

		it('preserves the legacy transition when the input motion gate is off', () => {
			failGate(inputMotionGate);
			render(createTextfield());

			const container = screen.getByTestId(`${testId}-container`);
			expect(container).toHaveCompiledCss('transition', legacyTransition);
		});

		it('does not rerender on focus or blur when the input motion gate is off', () => {
			failGate(inputMotionGate);
			const onRender = jest.fn();
			render(
				<React.Profiler id="textfield" onRender={onRender}>
					{createTextfield()}
				</React.Profiler>,
			);

			const input = screen.getByTestId(testId);
			onRender.mockClear();
			fireEvent.focus(input);
			fireEvent.blur(input);

			expect(onRender).not.toHaveBeenCalled();
		});

		it('retains non-spatial input transitions under reduced motion', () => {
			passGate(inputMotionGate);
			render(createTextfield());

			const container = screen.getByTestId(`${testId}-container`);
			expect(container).toHaveCompiledCss('transition', inputTransition);
			expect(container).not.toHaveCompiledCss('transition', 'none', {
				media: '(prefers-reduced-motion: reduce)',
			});
			expect(container).not.toHaveCompiledCss('transition-duration', '0s', {
				media: '(prefers-reduced-motion: reduce)',
			});
		});

		it.each<[string, TextfieldProps]>([
			['disabled', { isDisabled: true }],
			['read-only', { isReadOnly: true }],
		])('does not apply interactive motion to %s inputs', (_, props) => {
			passGate(inputMotionGate);
			render(createTextfield(props));

			const container = screen.getByTestId(`${testId}-container`);
			expect(container).not.toHaveCompiledCss('transition', inputTransition);
		});
	});
});
