import React from 'react';

import { render, screen } from '@testing-library/react';

import { FieldId } from '../../field-id-context';
import { ErrorMessage, HelperMessage, MessageWrapper, ValidMessage } from '../../index';

const props = {
	testId: 'testId',
	children: ['test'],
};

// eslint-disable-next-line @atlassian/a11y/require-jest-coverage
describe('Messages', () => {
	describe('wrapper', () => {
		it('should have an aria-live attribute', () => {
			render(
				<MessageWrapper>
					<ErrorMessage testId="error-test">Error Test</ErrorMessage>
				</MessageWrapper>,
			);
			expect(screen.getByTestId('message-wrapper')).toHaveAttribute('aria-live', 'polite');
		});

		it("should not contain a child 'aria-live' attribute on ErrorMessage", () => {
			render(
				<MessageWrapper>
					<ErrorMessage testId="error-test">Error Test</ErrorMessage>
				</MessageWrapper>,
			);
			expect(screen.getByTestId('error-test')).not.toHaveAttribute('aria-live');
		});

		it("should not contain a child 'aria-live' attribute on ValidMessage", () => {
			render(
				<MessageWrapper>
					<ValidMessage testId="valid-test">Valid Test</ValidMessage>
				</MessageWrapper>,
			);
			expect(screen.getByTestId('valid-test')).not.toHaveAttribute('aria-live');
		});

		it("should not contain a child 'aria-live' attribute on HelperMessage", () => {
			render(
				<MessageWrapper>
					<HelperMessage testId="helper-test">Helper Test</HelperMessage>
				</MessageWrapper>,
			);
			expect(screen.getByTestId('helper-test')).not.toHaveAttribute('aria-live');
		});
	});

	describe('aria-live without wrapper', () => {
		it("ErrorMessage should have 'aria-live' attribute", () => {
			render(<ErrorMessage {...props} testId="error-test" />);
			expect(screen.getByTestId('error-test')).toHaveAttribute('aria-live', 'polite');
		});

		it("ValidMessage should have 'aria-live' attribute", () => {
			render(<ValidMessage testId="valid-test">Valid Test</ValidMessage>);
			expect(screen.getByTestId('valid-test')).toHaveAttribute('aria-live', 'polite');
		});

		it("HelperMessage should have 'aria-live' attribute", () => {
			render(<HelperMessage testId="helper-test">Helper Test</HelperMessage>);
			expect(screen.getByTestId('helper-test')).toHaveAttribute('aria-live', 'polite');
		});
	});

	describe('icon rendering', () => {
		it('ErrorMessage should render an error icon', () => {
			render(<ErrorMessage {...props} />);
			expect(screen.getByRole('img', { name: 'error' })).toBeInTheDocument();
		});

		it('ValidMessage should render a success icon', () => {
			render(<ValidMessage {...props} />);
			expect(screen.getByRole('img', { name: 'success' })).toBeInTheDocument();
		});

		it('HelperMessage should not render any icon', () => {
			render(<HelperMessage {...props} />);
			expect(screen.queryByRole('img', { name: 'error' })).not.toBeInTheDocument();
			expect(screen.queryByRole('img', { name: 'success' })).not.toBeInTheDocument();
		});
	});

	describe('content rendering', () => {
		it('should render string content correctly', () => {
			render(<ErrorMessage testId="error-test">Simple string message</ErrorMessage>);
			expect(screen.getByTestId('error-test')).toHaveTextContent('Simple string message');
		});

		it('should render JSX content correctly', () => {
			render(
				<ErrorMessage testId="error-test">
					<strong>Bold</strong> message
				</ErrorMessage>,
			);
			expect(screen.getByTestId('error-test')).toHaveTextContent('Bold message');
			expect(screen.getByText('Bold')).toBeInTheDocument();
		});
	});

	describe('FieldId context integration', () => {
		it('ErrorMessage should have id with -error suffix when FieldId is provided', () => {
			render(
				<FieldId.Provider value="my-field">
					<ErrorMessage testId="error-test">Error message</ErrorMessage>
				</FieldId.Provider>,
			);
			expect(screen.getByTestId('error-test')).toHaveAttribute('id', 'my-field-error');
		});

		it('ValidMessage should have id with -valid suffix when FieldId is provided', () => {
			render(
				<FieldId.Provider value="my-field">
					<ValidMessage testId="valid-test">Valid message</ValidMessage>
				</FieldId.Provider>,
			);
			expect(screen.getByTestId('valid-test')).toHaveAttribute('id', 'my-field-valid');
		});

		it('HelperMessage should have id with -helper suffix when FieldId is provided', () => {
			render(
				<FieldId.Provider value="my-field">
					<HelperMessage testId="helper-test">Helper message</HelperMessage>
				</FieldId.Provider>,
			);
			expect(screen.getByTestId('helper-test')).toHaveAttribute('id', 'my-field-helper');
		});

		it('ErrorMessage should not have id attribute when FieldId is not provided', () => {
			render(<ErrorMessage testId="error-test">Error message</ErrorMessage>);
			expect(screen.getByTestId('error-test')).not.toHaveAttribute('id');
		});

		it('ValidMessage should not have id attribute when FieldId is not provided', () => {
			render(<ValidMessage testId="valid-test">Valid message</ValidMessage>);
			expect(screen.getByTestId('valid-test')).not.toHaveAttribute('id');
		});

		it('HelperMessage should not have id attribute when FieldId is not provided', () => {
			render(<HelperMessage testId="helper-test">Helper message</HelperMessage>);
			expect(screen.getByTestId('helper-test')).not.toHaveAttribute('id');
		});
	});

	describe('all message types render correctly', () => {
		[ErrorMessage, ValidMessage, HelperMessage].forEach((Component) => {
			it(`${Component.name} should render content immediately`, () => {
				render(<Component testId={`${Component.name}-test`}>Test Message</Component>);
				expect(screen.getByTestId(`${Component.name}-test`)).toHaveTextContent('Test Message');
			});
		});
	});
});
