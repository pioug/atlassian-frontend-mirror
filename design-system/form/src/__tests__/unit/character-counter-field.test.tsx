import React from 'react';

import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import Button from '@atlaskit/button/new';
import TextArea from '@atlaskit/textarea';
import TextField from '@atlaskit/textfield';

import Form, { CharacterCounterField } from '../../index';

describe('CharacterCounterField', () => {
	const user = userEvent.setup();

	describe('maxCharacters validation', () => {
		it('should not show error when under the maximum', async () => {
			const onSubmit = jest.fn();
			render(
				<Form onSubmit={onSubmit}>
					<CharacterCounterField
						name="description"
						label="Description"
						maxCharacters={50}
						testId="character-field"
					>
						{({ fieldProps }) => <TextField {...fieldProps} testId="text-field" />}
					</CharacterCounterField>
					<Button type="submit" testId="submit">
						Submit
					</Button>
				</Form>,
			);

			const input = screen.getByTestId('text-field');
			await user.type(input, 'Valid text');
			await user.click(screen.getByTestId('submit'));

			expect(onSubmit).toHaveBeenCalledWith(
				expect.objectContaining({ description: 'Valid text' }),
				expect.any(Object),
				expect.any(Function),
			);
		});

		it('should show error when exceeding the maximum', async () => {
			render(
				<Form onSubmit={jest.fn()}>
					<CharacterCounterField
						name="description"
						label="Description"
						maxCharacters={10}
						testId="character-field"
					>
						{({ fieldProps }) => <TextField {...fieldProps} testId="text-field" />}
					</CharacterCounterField>
					<Button type="submit" testId="submit">
						Submit
					</Button>
				</Form>,
			);

			const input = screen.getByTestId('text-field');
			await user.type(input, 'This is way too long');
			fireEvent.blur(input);

			// Should display character counter error
			expect(screen.getByTestId('character-field-character-counter')).toBeInTheDocument();
			expect(screen.getByText('10 characters too many')).toBeInTheDocument();
		});

		it('should display correct count for characters over maximum', async () => {
			render(
				<Form onSubmit={jest.fn()}>
					<CharacterCounterField
						name="description"
						label="Description"
						maxCharacters={10}
						testId="character-field"
					>
						{({ fieldProps }) => <TextField {...fieldProps} testId="text-field" />}
					</CharacterCounterField>
				</Form>,
			);

			const input = screen.getByTestId('text-field');
			// Type 15 characters (5 over the limit of 10)
			await user.type(input, 'This is 15 char');

			expect(screen.getByText('5 characters too many')).toBeInTheDocument();
		});

		it('should use custom overMaximumMessage when provided', async () => {
			const customMessage = 'You exceeded the limit!';
			render(
				<Form onSubmit={jest.fn()}>
					<CharacterCounterField
						name="description"
						label="Description"
						maxCharacters={10}
						overMaximumMessage={customMessage}
						testId="character-field"
					>
						{({ fieldProps }) => <TextField {...fieldProps} testId="text-field" />}
					</CharacterCounterField>
				</Form>,
			);

			const input = screen.getByTestId('text-field');
			await user.type(input, 'This is way too long');

			expect(screen.getByText(customMessage)).toBeInTheDocument();
		});

		it('should show remaining characters when under maximum', async () => {
			render(
				<Form onSubmit={jest.fn()}>
					<CharacterCounterField
						name="description"
						label="Description"
						maxCharacters={50}
						testId="character-field"
					>
						{({ fieldProps }) => <TextField {...fieldProps} testId="text-field" />}
					</CharacterCounterField>
				</Form>,
			);

			const input = screen.getByTestId('text-field');
			// Type 10 characters (40 remaining out of 50)
			await user.type(input, 'Ten chars!');

			expect(screen.getByText('40 characters remaining')).toBeInTheDocument();
		});

		it('should use custom underMaximumMessage when provided', async () => {
			const customMessage = 'You have space left';
			render(
				<Form onSubmit={jest.fn()}>
					<CharacterCounterField
						name="description"
						label="Description"
						maxCharacters={50}
						underMaximumMessage={customMessage}
						testId="character-field"
					>
						{({ fieldProps }) => <TextField {...fieldProps} testId="text-field" />}
					</CharacterCounterField>
				</Form>,
			);

			const input = screen.getByTestId('text-field');
			await user.type(input, 'Some text');

			expect(screen.getByText(customMessage)).toBeInTheDocument();
		});
	});

	describe('minCharacters validation', () => {
		it('should show error when under the minimum', async () => {
			render(
				<Form onSubmit={jest.fn()}>
					<CharacterCounterField
						name="description"
						label="Description"
						minCharacters={10}
						testId="character-field"
					>
						{({ fieldProps }) => <TextField {...fieldProps} testId="text-field" />}
					</CharacterCounterField>
				</Form>,
			);

			const input = screen.getByTestId('text-field');
			await user.type(input, 'Short');
			fireEvent.blur(input);

			// Should display character counter error
			expect(screen.getByTestId('character-field-character-counter')).toBeInTheDocument();
			expect(screen.getByText(/more characters needed/)).toBeInTheDocument();
		});

		it('should display correct count for minimum characters needed', async () => {
			render(
				<Form onSubmit={jest.fn()}>
					<CharacterCounterField
						name="description"
						label="Description"
						minCharacters={20}
						testId="character-field"
					>
						{({ fieldProps }) => <TextField {...fieldProps} testId="text-field" />}
					</CharacterCounterField>
				</Form>,
			);

			const input = screen.getByTestId('text-field');
			// Type 10 characters (need 10 more)
			await user.type(input, 'Ten chars!');

			expect(screen.getByText('10 more characters needed')).toBeInTheDocument();
		});

		it('should use custom underMinimumMessage when provided', async () => {
			const customMessage = 'Please write more!';
			render(
				<Form onSubmit={jest.fn()}>
					<CharacterCounterField
						name="description"
						label="Description"
						minCharacters={20}
						underMinimumMessage={customMessage}
						testId="character-field"
					>
						{({ fieldProps }) => <TextField {...fieldProps} testId="text-field" />}
					</CharacterCounterField>
				</Form>,
			);

			const input = screen.getByTestId('text-field');
			await user.type(input, 'Short');

			expect(screen.getByText(customMessage)).toBeInTheDocument();
		});

		it('should not show character counter when minimum is met and no maximum is set', async () => {
			render(
				<Form onSubmit={jest.fn()}>
					<CharacterCounterField
						name="description"
						label="Description"
						minCharacters={5}
						testId="character-field"
					>
						{({ fieldProps }) => <TextField {...fieldProps} testId="text-field" />}
					</CharacterCounterField>
				</Form>,
			);

			const input = screen.getByTestId('text-field');
			await user.type(input, 'Valid text that meets minimum');

			// Character counter should not be shown when minimum is met and no maximum is set
			expect(screen.queryByTestId('character-field-character-counter')).not.toBeInTheDocument();
		});
	});

	describe('minCharacters and maxCharacters together', () => {
		it('should validate both min and max limits', async () => {
			const onSubmit = jest.fn();
			render(
				<Form onSubmit={onSubmit}>
					<CharacterCounterField
						name="description"
						label="Description"
						minCharacters={5}
						maxCharacters={20}
						testId="character-field"
					>
						{({ fieldProps }) => <TextField {...fieldProps} testId="text-field" />}
					</CharacterCounterField>
					<Button type="submit" testId="submit">
						Submit
					</Button>
				</Form>,
			);

			const input = screen.getByTestId('text-field');

			// Test below minimum
			await user.type(input, 'Hi');
			expect(screen.getByText(/more characters needed/)).toBeInTheDocument();

			// Clear and test within range
			await user.clear(input);
			await user.type(input, 'Valid text');
			expect(screen.getByText(/remaining/)).toBeInTheDocument();

			// Test above maximum
			await user.clear(input);
			await user.type(input, 'This is way too long for the limit');
			expect(screen.getByText(/too many/)).toBeInTheDocument();
		});

		it('should prioritize showing too long error over too short', async () => {
			render(
				<Form onSubmit={jest.fn()}>
					<CharacterCounterField
						name="description"
						label="Description"
						minCharacters={5}
						maxCharacters={10}
						testId="character-field"
					>
						{({ fieldProps }) => <TextField {...fieldProps} testId="text-field" />}
					</CharacterCounterField>
				</Form>,
			);

			const input = screen.getByTestId('text-field');
			// Type more than max (which also might be more than min)
			await user.type(input, 'Way too long text');

			// Should show "too many" message, not "needed" message
			expect(screen.getByText(/too many/)).toBeInTheDocument();
			expect(screen.queryByText(/more characters needed/)).not.toBeInTheDocument();
		});
	});

	describe('custom validation', () => {
		it('should combine custom validation with character count validation', async () => {
			const customValidate = jest.fn((value) => {
				if (value === 'forbidden') {
					return 'This word is not allowed';
				}
				return undefined;
			});

			render(
				<Form onSubmit={jest.fn()}>
					<CharacterCounterField
						name="description"
						label="Description"
						maxCharacters={50}
						validate={customValidate}
						testId="character-field"
					>
						{({ fieldProps, error }) => (
							<>
								<TextField {...fieldProps} testId="text-field" />
								{error && error !== '__TOO_SHORT__' && error !== '__TOO_LONG__' && (
									<div data-testid="custom-error">{error}</div>
								)}
							</>
						)}
					</CharacterCounterField>
				</Form>,
			);

			const input = screen.getByTestId('text-field');
			await user.type(input, 'forbidden');
			fireEvent.blur(input);

			await waitFor(() => {
				expect(customValidate).toHaveBeenCalled();
			});

			const customError = await screen.findByTestId('custom-error');
			expect(customError).toHaveTextContent('This word is not allowed');
		});

		it('should prioritize custom validation over character count validation', async () => {
			render(
				<Form onSubmit={jest.fn()}>
					<CharacterCounterField
						name="description"
						label="Description"
						maxCharacters={10}
						validate={() => 'Custom error'}
						testId="character-field"
					>
						{({ fieldProps, error }) => (
							<>
								<TextField {...fieldProps} testId="text-field" />
								{error && error !== '__TOO_SHORT__' && error !== '__TOO_LONG__' && (
									<div data-testid="external-error">{error}</div>
								)}
							</>
						)}
					</CharacterCounterField>
				</Form>,
			);

			const input = screen.getByTestId('text-field');
			await user.type(input, 'Way too long text');
			fireEvent.blur(input);

			// Custom error should be shown
			const externalError = await screen.findByTestId('external-error');
			expect(externalError).toHaveTextContent('Custom error');

			// Character counter should not be shown when there's an external error
			expect(screen.queryByTestId('character-field-character-counter')).not.toBeInTheDocument();
		});

		it('should show character counter when custom validation passes', async () => {
			render(
				<Form onSubmit={jest.fn()}>
					<CharacterCounterField
						name="description"
						label="Description"
						maxCharacters={50}
						validate={(value) => (value === 'bad' ? 'Invalid value' : undefined)}
						testId="character-field"
					>
						{({ fieldProps, error }) => (
							<>
								<TextField {...fieldProps} testId="text-field" />
								{error && error !== '__TOO_SHORT__' && error !== '__TOO_LONG__' && (
									<div data-testid="custom-error">{error}</div>
								)}
							</>
						)}
					</CharacterCounterField>
				</Form>,
			);

			const input = screen.getByTestId('text-field');
			await user.type(input, 'good value');

			// Character counter should be visible
			expect(screen.getByTestId('character-field-character-counter')).toBeInTheDocument();
			expect(screen.getByText(/remaining/)).toBeInTheDocument();
		});
	});

	describe('helperMessage', () => {
		it('should display helper message when provided', () => {
			const helperText = 'Please provide a description';
			render(
				<Form onSubmit={jest.fn()}>
					<CharacterCounterField
						name="description"
						label="Description"
						maxCharacters={50}
						helperMessage={helperText}
						testId="character-field"
					>
						{({ fieldProps }) => <TextField {...fieldProps} testId="text-field" />}
					</CharacterCounterField>
				</Form>,
			);

			expect(screen.getByText(helperText)).toBeInTheDocument();
			expect(screen.getByTestId('character-field-helper')).toBeInTheDocument();
		});
	});

	describe('accessibility', () => {
		it('should add character counter to aria-describedby', async () => {
			render(
				<Form onSubmit={jest.fn()}>
					<CharacterCounterField
						name="description"
						label="Description"
						id="description-field"
						maxCharacters={50}
						testId="character-field"
					>
						{({ fieldProps }) => <TextField {...fieldProps} testId="text-field" />}
					</CharacterCounterField>
				</Form>,
			);

			const input = screen.getByTestId('text-field');

			expect(input).toHaveAttribute(
				'aria-describedby',
				expect.stringContaining('description-field-character-counter'),
			);
		});

		it('should not add character counter to aria-describedby when external error exists', async () => {
			render(
				<Form onSubmit={jest.fn()}>
					<CharacterCounterField
						name="description"
						label="Description"
						id="description-field"
						maxCharacters={50}
						validate={() => 'External error'}
						testId="character-field"
					>
						{({ fieldProps }) => <TextField {...fieldProps} testId="text-field" />}
					</CharacterCounterField>
				</Form>,
			);

			const input = screen.getByTestId('text-field');
			fireEvent.blur(input);

			await waitFor(() => {
				const ariaDescribedby = input.getAttribute('aria-describedby');
				expect(ariaDescribedby).not.toContain('description-field-character-counter');
			});

			const ariaDescribedby = input.getAttribute('aria-describedby');
			expect(ariaDescribedby).toContain('description-field-error');
		});
	});

	describe('TextArea support', () => {
		it('should work with TextArea component', async () => {
			render(
				<Form onSubmit={jest.fn()}>
					<CharacterCounterField<string, HTMLTextAreaElement>
						name="bio"
						label="Biography"
						minCharacters={10}
						maxCharacters={200}
						testId="character-field"
					>
						{({ fieldProps }) => <TextArea {...fieldProps} testId="text-area" />}
					</CharacterCounterField>
				</Form>,
			);

			const textarea = screen.getByTestId('text-area');
			await user.type(textarea, 'Short');

			expect(screen.getByText(/more characters needed/)).toBeInTheDocument();

			await user.clear(textarea);
			await user.type(textarea, 'This is a sufficiently long biography text');

			expect(screen.getByText(/remaining/)).toBeInTheDocument();
		});
	});

	describe('error display priority', () => {
		it('should hide character counter when external validation error exists', async () => {
			render(
				<Form onSubmit={jest.fn()}>
					<CharacterCounterField
						name="description"
						label="Description"
						maxCharacters={50}
						validate={(value) => (value === 'error' ? 'External error message' : undefined)}
						testId="character-field"
					>
						{({ fieldProps, error }) => (
							<>
								<TextField {...fieldProps} testId="text-field" />
								{error && error !== '__TOO_SHORT__' && error !== '__TOO_LONG__' && (
									<div data-testid="external-error">{error}</div>
								)}
							</>
						)}
					</CharacterCounterField>
				</Form>,
			);

			const input = screen.getByTestId('text-field');
			await user.type(input, 'error');
			fireEvent.blur(input);

			// External error should be shown
			await screen.findByTestId('external-error');

			// Character counter should be hidden
			expect(screen.queryByTestId('character-field-character-counter')).not.toBeInTheDocument();
		});

		it('should show character counter error when no external error exists', async () => {
			render(
				<Form onSubmit={jest.fn()}>
					<CharacterCounterField
						name="description"
						label="Description"
						maxCharacters={10}
						validate={(value) => (value === 'error' ? 'External error message' : undefined)}
						testId="character-field"
					>
						{({ fieldProps }) => <TextField {...fieldProps} testId="text-field" />}
					</CharacterCounterField>
				</Form>,
			);

			const input = screen.getByTestId('text-field');
			await user.type(input, 'This is way too long');

			// Character counter error should be shown
			expect(screen.getByTestId('character-field-character-counter')).toBeInTheDocument();
			expect(screen.getByText(/too many/)).toBeInTheDocument();
		});
	});
});
