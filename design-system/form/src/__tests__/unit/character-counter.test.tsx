import React, { useState } from 'react';

import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import TextField from '@atlaskit/textfield';

import CharacterCounter from '../../character-counter';

// eslint-disable-next-line @atlassian/a11y/require-jest-coverage
describe('CharacterCounter', () => {
	const user = userEvent.setup();

	describe('message generation', () => {
		it('should display remaining characters when under maximum', () => {
			render(
				<CharacterCounter currentValue="Hello" maxCharacters={50} testId="character-counter" />,
			);

			expect(screen.getByText('45 characters remaining')).toBeInTheDocument();
		});

		it('should display characters too many when over maximum', () => {
			render(
				<CharacterCounter
					currentValue="This is a very long text that exceeds the limit"
					maxCharacters={10}
					testId="character-counter"
				/>,
			);

			expect(screen.getByText('37 characters too many')).toBeInTheDocument();
		});

		it('should display minimum characters required when under minimum', () => {
			render(<CharacterCounter currentValue="Hi" minCharacters={10} testId="character-counter" />);

			expect(screen.getByText('8 more characters needed')).toBeInTheDocument();
		});

		it('should not render when minimum is met and no maximum is set', () => {
			render(
				<CharacterCounter currentValue="Valid text" minCharacters={5} testId="character-counter" />,
			);

			expect(screen.queryByTestId('character-counter')).not.toBeInTheDocument();
		});

		it('should display remaining characters when both min and max are set and value is valid', () => {
			render(
				<CharacterCounter
					currentValue="Valid text"
					minCharacters={5}
					maxCharacters={50}
					testId="character-counter"
				/>,
			);

			expect(screen.getByText('40 characters remaining')).toBeInTheDocument();
		});
	});

	describe('pluralization', () => {
		it('should use singular "character" for 1 character remaining', () => {
			render(
				<CharacterCounter currentValue="123456789" maxCharacters={10} testId="character-counter" />,
			);

			expect(screen.getByText('1 character remaining')).toBeInTheDocument();
		});

		it('should use plural "characters" for multiple characters remaining', () => {
			render(
				<CharacterCounter currentValue="12345678" maxCharacters={10} testId="character-counter" />,
			);

			expect(screen.getByText('2 characters remaining')).toBeInTheDocument();
		});

		it('should use singular "character" when 1 character too many', () => {
			render(
				<CharacterCounter
					currentValue="12345678901"
					maxCharacters={10}
					testId="character-counter"
				/>,
			);

			expect(screen.getByText('1 character too many')).toBeInTheDocument();
		});

		it('should use plural "characters" when multiple characters too many', () => {
			render(
				<CharacterCounter
					currentValue="123456789012"
					maxCharacters={10}
					testId="character-counter"
				/>,
			);

			expect(screen.getByText('2 characters too many')).toBeInTheDocument();
		});

		it('should use singular "character" when 1 character needed for minimum', () => {
			render(
				<CharacterCounter currentValue="123456789" minCharacters={10} testId="character-counter" />,
			);

			expect(screen.getByText('1 more character needed')).toBeInTheDocument();
		});

		it('should use plural "characters" when multiple characters needed for minimum', () => {
			render(
				<CharacterCounter currentValue="12345678" minCharacters={10} testId="character-counter" />,
			);

			expect(screen.getByText('2 more characters needed')).toBeInTheDocument();
		});
	});

	describe('custom messages', () => {
		it('should use custom overMaximumMessage when provided', () => {
			const customMessage = 'You have exceeded the character limit!';
			render(
				<CharacterCounter
					currentValue="This is way too long"
					maxCharacters={10}
					overMaximumMessage={customMessage}
					testId="character-counter"
				/>,
			);

			expect(screen.getByText(customMessage)).toBeInTheDocument();
			expect(screen.queryByText('too many')).not.toBeInTheDocument();
		});

		it('should use custom underMaximumMessage when provided', () => {
			const customMessage = 'You have space left';
			render(
				<CharacterCounter
					currentValue="Hello"
					maxCharacters={50}
					underMaximumMessage={customMessage}
					testId="character-counter"
				/>,
			);

			expect(screen.getByText(customMessage)).toBeInTheDocument();
			expect(screen.queryByText('remaining')).not.toBeInTheDocument();
		});

		it('should use custom underMinimumMessage when provided', () => {
			const customMessage = 'Please write at least 10 more characters';
			render(
				<CharacterCounter
					currentValue="Hi"
					minCharacters={10}
					underMinimumMessage={customMessage}
					testId="character-counter"
				/>,
			);

			expect(screen.getByText(customMessage)).toBeInTheDocument();
			expect(screen.queryByText('more characters needed')).not.toBeInTheDocument();
		});

		it('should support i18n formatted messages', () => {
			const formatMessage = (min: number) => `Necesitas al menos ${min} caracteres más`;
			render(
				<CharacterCounter
					currentValue="Hola"
					minCharacters={10}
					underMinimumMessage={formatMessage(6)}
					testId="character-counter"
				/>,
			);

			expect(screen.getByText('Necesitas al menos 6 caracteres más')).toBeInTheDocument();
		});
	});

	describe('shouldShowAsError prop', () => {
		it('should show error styling when shouldShowAsError is true and over maximum', () => {
			render(
				<CharacterCounter
					currentValue="This is way too long"
					maxCharacters={10}
					shouldShowAsError={true}
					testId="character-counter"
				/>,
			);

			const counterElement = screen.getByTestId('character-counter');
			// Error icon should be present
			const svg = within(counterElement).getByRole('img', { hidden: true });
			expect(svg).toBeInTheDocument();
		});

		it('should show error styling when shouldShowAsError is true and under minimum', () => {
			render(
				<CharacterCounter
					currentValue="Hi"
					minCharacters={10}
					shouldShowAsError={true}
					testId="character-counter"
				/>,
			);

			const counterElement = screen.getByTestId('character-counter');
			// Error icon should be present
			const svg = within(counterElement).getByRole('img', { hidden: true });
			expect(svg).toBeInTheDocument();
		});

		it('should not show error styling when shouldShowAsError is false even when over maximum', () => {
			render(
				<CharacterCounter
					currentValue="This is way too long"
					maxCharacters={10}
					shouldShowAsError={false}
					testId="character-counter"
				/>,
			);

			const counterElement = screen.getByTestId('character-counter');
			// Error icon should not be present
			expect(within(counterElement).queryByRole('img', { hidden: true })).not.toBeInTheDocument();
		});

		it('should not show error styling when shouldShowAsError is false even when under minimum', () => {
			render(
				<CharacterCounter
					currentValue="Hi"
					minCharacters={10}
					shouldShowAsError={false}
					testId="character-counter"
				/>,
			);

			const counterElement = screen.getByTestId('character-counter');
			// Error icon should not be present
			expect(within(counterElement).queryByRole('img', { hidden: true })).not.toBeInTheDocument();
		});

		it('should not show error styling when within limits', () => {
			render(
				<CharacterCounter
					currentValue="Valid"
					minCharacters={2}
					maxCharacters={10}
					shouldShowAsError={true}
					testId="character-counter"
				/>,
			);

			const counterElement = screen.getByTestId('character-counter');
			// Error icon should not be present when within limits
			expect(within(counterElement).queryByRole('img', { hidden: true })).not.toBeInTheDocument();
		});

		it('should default to showing error styling when not specified', () => {
			render(
				<CharacterCounter
					currentValue="This is way too long"
					maxCharacters={10}
					testId="character-counter"
				/>,
			);

			const counterElement = screen.getByTestId('character-counter');
			// Error icon should be present by default
			const svg = within(counterElement).getByRole('img', { hidden: true });
			expect(svg).toBeInTheDocument();
		});
	});

	describe('empty and undefined values', () => {
		it('should handle empty string as zero length', () => {
			render(<CharacterCounter currentValue="" maxCharacters={50} testId="character-counter" />);

			expect(screen.getByText('50 characters remaining')).toBeInTheDocument();
		});

		it('should handle undefined value as zero length', () => {
			render(
				<CharacterCounter currentValue={undefined} maxCharacters={50} testId="character-counter" />,
			);

			expect(screen.getByText('50 characters remaining')).toBeInTheDocument();
		});

		it('should handle undefined value with minimum character requirement', () => {
			render(
				<CharacterCounter currentValue={undefined} minCharacters={10} testId="character-counter" />,
			);

			expect(screen.getByText('10 more characters needed')).toBeInTheDocument();
		});
	});

	describe('validation priority', () => {
		it('should prioritize showing over maximum message when both min and max are violated', () => {
			render(
				<CharacterCounter
					currentValue="This text is way too long for the maximum limit"
					minCharacters={5}
					maxCharacters={10}
					testId="character-counter"
				/>,
			);

			expect(screen.getByText('37 characters too many')).toBeInTheDocument();
			expect(screen.queryByText(/.* more characters needed/)).not.toBeInTheDocument();
		});

		it('should show under minimum message when only minimum is violated', () => {
			render(
				<CharacterCounter
					currentValue="Hi"
					minCharacters={10}
					maxCharacters={50}
					testId="character-counter"
				/>,
			);

			expect(screen.getByText('8 more characters needed')).toBeInTheDocument();
			expect(screen.queryByText(/characters too many/)).not.toBeInTheDocument();
		});
	});

	describe('accessibility', () => {
		it('should have proper id when inputId is provided', () => {
			render(
				<CharacterCounter
					currentValue="Hello"
					maxCharacters={50}
					inputId="my-input"
					testId="character-counter"
				/>,
			);

			const textElement = screen.getByText('45 characters remaining');
			expect(textElement).toHaveAttribute('id', 'my-input-character-counter');
		});

		it('should not have id when inputId is not provided', () => {
			render(
				<CharacterCounter currentValue="Hello" maxCharacters={50} testId="character-counter" />,
			);

			const textElement = screen.getByText('45 characters remaining');
			expect(textElement).not.toHaveAttribute('id');
		});

		it('should debounce aria-live announcements', async () => {
			const { container } = render(
				<CharacterCounter currentValue="Hello" maxCharacters={50} testId="character-counter" />,
			);

			// eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
			const ariaLiveElement = container.querySelector('[aria-live="polite"]');
			expect(ariaLiveElement).toBeInTheDocument();

			// Initial announcement should be empty (debounced)
			expect(ariaLiveElement).toHaveTextContent('');

			// After debounce period (1 second), announcement should update
			await waitFor(
				() => {
					expect(ariaLiveElement).toHaveTextContent('45 characters remaining');
				},
				{ timeout: 1500 },
			);
		});
	});

	describe('standalone usage with TextField', () => {
		// Component that demonstrates standalone usage
		const StandaloneCharacterCounterExample = ({
			maxChars = 50,
			minChars,
		}: {
			maxChars?: number;
			minChars?: number;
		}) => {
			const [value, setValue] = useState('');
			const inputId = 'standalone-input';

			const isTooShort = minChars !== undefined && value.length < minChars;
			const isTooLong = maxChars !== undefined && value.length > maxChars;
			const hasError = isTooShort || isTooLong;

			return (
				<div>
					<label htmlFor={inputId}>Description</label>
					<TextField
						id={inputId}
						value={value}
						onChange={(e) => setValue(e.currentTarget.value)}
						aria-describedby={`${inputId}-character-counter`}
						testId="standalone-text-field"
					/>
					<CharacterCounter
						currentValue={value}
						maxCharacters={maxChars}
						minCharacters={minChars}
						inputId={inputId}
						shouldShowAsError={hasError}
						testId="standalone-counter"
					/>
				</div>
			);
		};

		it('should work with TextField via inputId prop', async () => {
			render(<StandaloneCharacterCounterExample maxChars={50} />);

			const input = screen.getByTestId('standalone-text-field');

			// Initially shows all characters remaining
			expect(screen.getByText('50 characters remaining')).toBeInTheDocument();

			// Type some text
			await user.type(input, 'Hello World');

			// Should update the count
			expect(screen.getByText('39 characters remaining')).toBeInTheDocument();
		});

		it('should associate with TextField via aria-describedby', () => {
			render(<StandaloneCharacterCounterExample maxChars={50} />);

			const input = screen.getByTestId('standalone-text-field');
			expect(input).toHaveAttribute('aria-describedby', 'standalone-input-character-counter');

			const counterText = screen.getByText('50 characters remaining');
			expect(counterText).toHaveAttribute('id', 'standalone-input-character-counter');
		});

		it('should update in real-time as user types', async () => {
			render(<StandaloneCharacterCounterExample maxChars={20} />);

			const input = screen.getByTestId('standalone-text-field');

			await user.type(input, 'Test');
			expect(screen.getByText('16 characters remaining')).toBeInTheDocument();

			await user.type(input, ' text');
			expect(screen.getByText('11 characters remaining')).toBeInTheDocument();
		});

		it('should show error state when exceeding maximum in standalone mode', async () => {
			render(<StandaloneCharacterCounterExample maxChars={10} />);

			const input = screen.getByTestId('standalone-text-field');
			await user.type(input, 'This is way too long');

			expect(screen.getByText('10 characters too many')).toBeInTheDocument();

			// Error icon should be present
			const counterElement = screen.getByTestId('standalone-counter');
			const svg = within(counterElement).getByRole('img', { hidden: true });
			expect(svg).toBeInTheDocument();
		});

		it('should show error state when under minimum in standalone mode', async () => {
			render(<StandaloneCharacterCounterExample maxChars={50} minChars={10} />);

			const input = screen.getByTestId('standalone-text-field');
			await user.type(input, 'Short');

			expect(screen.getByText('5 more characters needed')).toBeInTheDocument();

			// Error icon should be present
			const counterElement = screen.getByTestId('standalone-counter');
			const svg = within(counterElement).getByRole('img', { hidden: true });
			expect(svg).toBeInTheDocument();
		});

		it('should not show error styling when within limits in standalone mode', async () => {
			render(<StandaloneCharacterCounterExample maxChars={50} minChars={5} />);

			const input = screen.getByTestId('standalone-text-field');
			await user.type(input, 'Valid text');

			expect(screen.getByText('40 characters remaining')).toBeInTheDocument();

			// Error icon should not be present
			const counterElement = screen.getByTestId('standalone-counter');
			expect(within(counterElement).queryByRole('img', { hidden: true })).not.toBeInTheDocument();
		});

		it('should handle clearing input in standalone mode', async () => {
			render(<StandaloneCharacterCounterExample maxChars={50} />);

			const input = screen.getByTestId('standalone-text-field');

			await user.type(input, 'Some text');
			expect(screen.getByText('41 characters remaining')).toBeInTheDocument();

			await user.clear(input);
			expect(screen.getByText('50 characters remaining')).toBeInTheDocument();
		});

		it('should debounce aria-live announcements during typing', async () => {
			const { container } = render(<StandaloneCharacterCounterExample maxChars={50} />);

			const input = screen.getByTestId('standalone-text-field');
			// eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
			const ariaLiveElement = container.querySelector('[aria-live="polite"]');
			expect(ariaLiveElement).toBeInTheDocument();

			// Initial announcement should be empty
			expect(ariaLiveElement).toHaveTextContent('');

			// Type "Hello" - this simulates rapid user typing
			await user.type(input, 'Hello');

			// Immediately after typing, announcement should still be empty (debounced)
			expect(ariaLiveElement).toHaveTextContent('');

			// After debounce period (1 second), announcement should update
			await waitFor(
				() => {
					expect(ariaLiveElement).toHaveTextContent('45 characters remaining');
				},
				{ timeout: 1500 },
			);
		});
	});

	describe('edge cases', () => {
		it('should handle exactly at maximum limit', () => {
			render(
				<CharacterCounter
					currentValue="1234567890"
					maxCharacters={10}
					testId="character-counter"
				/>,
			);

			expect(screen.getByText('0 characters remaining')).toBeInTheDocument();
		});

		it('should handle exactly at minimum limit', () => {
			render(
				<CharacterCounter
					currentValue="1234567890"
					minCharacters={10}
					maxCharacters={50}
					testId="character-counter"
				/>,
			);

			expect(screen.getByText('40 characters remaining')).toBeInTheDocument();
			expect(screen.queryByText('required')).not.toBeInTheDocument();
		});

		it('should handle very long text exceeding maximum by many characters', () => {
			const longText = 'a'.repeat(100);
			render(
				<CharacterCounter currentValue={longText} maxCharacters={10} testId="character-counter" />,
			);

			expect(screen.getByText('90 characters too many')).toBeInTheDocument();
		});

		it('should handle only maxCharacters prop (no minCharacters)', () => {
			render(
				<CharacterCounter currentValue="Hello" maxCharacters={50} testId="character-counter" />,
			);

			expect(screen.getByText('45 characters remaining')).toBeInTheDocument();
		});

		it('should handle only minCharacters prop (no maxCharacters)', () => {
			render(<CharacterCounter currentValue="Hi" minCharacters={10} testId="character-counter" />);

			expect(screen.getByText('8 more characters needed')).toBeInTheDocument();
		});

		it('should not render when no limits are provided and value is valid', () => {
			render(<CharacterCounter currentValue="Hello" testId="character-counter" />);

			expect(screen.queryByTestId('character-counter')).not.toBeInTheDocument();
		});

		it('should handle zero as maximum characters', () => {
			render(<CharacterCounter currentValue="a" maxCharacters={0} testId="character-counter" />);

			expect(screen.getByText('1 character too many')).toBeInTheDocument();
		});

		it('should handle zero as minimum characters', () => {
			render(
				<CharacterCounter
					currentValue="Hello"
					minCharacters={0}
					maxCharacters={50}
					testId="character-counter"
				/>,
			);

			expect(screen.getByText('45 characters remaining')).toBeInTheDocument();
		});
	});
});
