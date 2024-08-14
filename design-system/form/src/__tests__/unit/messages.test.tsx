import React from 'react';

import { render, screen } from '@testing-library/react';

import { ErrorMessage, HelperMessage, MessageWrapper, ValidMessage } from '@atlaskit/form';

const props = {
	testId: 'testId',
	children: ['test'],
};

describe('Messages', () => {
	describe('wrapper', () => {
		it('should be a have an aria-live attribute', () => {
			render(
				<MessageWrapper>
					<ErrorMessage testId="error-test">Error Test</ErrorMessage>
				</MessageWrapper>,
			);
			expect(screen.getByTestId('message-wrapper')).toHaveAttribute('aria-live', 'polite');
		});

		it("should not contain a child 'aria-live' attribute", () => {
			render(
				<MessageWrapper>
					<ErrorMessage testId="error-test">Error Test</ErrorMessage>
				</MessageWrapper>,
			);
			expect(screen.getByTestId('error-test')).not.toHaveAttribute('aria-live', 'polite');
		});
	});

	it("With no wrapper, error message should render 'aria-live' attribute", () => {
		render(<ErrorMessage {...props} key={0} testId="error-test" />);
		expect(screen.getByTestId('error-test')).toHaveAttribute('aria-live', 'polite');
	});

	describe('validation', () => {
		[ErrorMessage].forEach((Component, index) => {
			it(`${Component.name} should render an error`, () => {
				render(<Component {...props} key={index} />);
				expect(screen.getByRole('img', { name: 'error' })).toBeInTheDocument();
			});
		});
		[HelperMessage].forEach((Component, index) => {
			it(`${Component.name} should not render an error`, () => {
				render(<Component {...props} key={index} />);
				expect(screen.queryByRole('img', { name: 'error' })).not.toBeInTheDocument();
				expect(screen.queryByRole('img', { name: 'success' })).not.toBeInTheDocument();
			});
		});
		[ValidMessage].forEach((Component, index) => {
			it(`${Component.name} should not render an error`, () => {
				render(<Component {...props} key={index} />);
				expect(screen.queryByRole('img', { name: 'error' })).not.toBeInTheDocument();
				expect(screen.queryByRole('img', { name: 'success' })).toBeInTheDocument();
			});
		});
	});
});
