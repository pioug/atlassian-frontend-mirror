import React from 'react';

import { render, screen } from '@testing-library/react';

import { ErrorMessage, HelperMessage, MessageWrapper, ValidMessage } from '@atlaskit/form';
import { ffTest } from '@atlassian/feature-flags-test-utils';

const props = {
	testId: 'testId',
	children: ['test'],
};

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
				expect(screen.getByRole('img', { name: 'success' })).toBeInTheDocument();
			});
		});
	});

	ffTest.on(
		'platform_dst_form_screenreader_message_fix',
		'feature flag enabled - delayed rendering',
		() => {
			describe('without wrapper', () => {
				it('should render content after delay', async () => {
					render(<ErrorMessage testId="error-test">Error Test</ErrorMessage>);

					// Use findByTestId as message is rendered after timeout
					await screen.findByTestId('error-test');
				});

				it('should have aria-live attribute when not wrapped', () => {
					render(<ErrorMessage testId="error-test">Error Test</ErrorMessage>);
					expect(screen.getByTestId('error-test')).toHaveAttribute('aria-live', 'polite');
				});
			});

			describe('with wrapper', () => {
				it('should render content immediately when wrapped', () => {
					render(
						<MessageWrapper>
							<ErrorMessage testId="error-test">Error Test</ErrorMessage>
						</MessageWrapper>,
					);
					expect(screen.getByTestId('error-test')).toHaveTextContent('Error Test');
				});

				it('should not have aria-live attribute on child when wrapped', () => {
					render(
						<MessageWrapper>
							<ErrorMessage testId="error-test">Error Test</ErrorMessage>
						</MessageWrapper>,
					);
					expect(screen.getByTestId('error-test')).not.toHaveAttribute('aria-live');
				});
			});

			describe('all message types', () => {
				[ErrorMessage, ValidMessage, HelperMessage].forEach((Component) => {
					it(`${Component.name} should delay rendering when feature flag is enabled`, async () => {
						render(<Component testId={`${Component.name}-test`}>Test Message</Component>);

						// Use findByTestId as message is rendered after timeout
						await screen.findByTestId(`${Component.name}-test`);
					});
				});
			});
		},
	);

	ffTest.off(
		'platform_dst_form_screenreader_message_fix',
		'feature flag disabled - immediate rendering',
		() => {
			describe('without wrapper', () => {
				it('should render content immediately', () => {
					render(<ErrorMessage testId="error-test">Error Test</ErrorMessage>);
					expect(screen.getByTestId('error-test')).toHaveTextContent('Error Test');
				});

				it('should have aria-live attribute when not wrapped (legacy behavior)', () => {
					render(<ErrorMessage testId="error-test">Error Test</ErrorMessage>);
					expect(screen.getByTestId('error-test')).toHaveAttribute('aria-live', 'polite');
				});
			});

			describe('with wrapper', () => {
				it('should render content immediately when wrapped (legacy)', () => {
					render(
						<MessageWrapper>
							<ErrorMessage testId="error-test">Error Test</ErrorMessage>
						</MessageWrapper>,
					);
					expect(screen.getByTestId('error-test')).toHaveTextContent('Error Test');
				});

				it('should not have aria-live attribute on child when wrapped (legacy)', () => {
					render(
						<MessageWrapper>
							<ErrorMessage testId="error-test">Error Test</ErrorMessage>
						</MessageWrapper>,
					);
					expect(screen.getByTestId('error-test')).not.toHaveAttribute('aria-live');
				});
			});

			describe('all message types', () => {
				[ErrorMessage, ValidMessage, HelperMessage].forEach((Component) => {
					it(`${Component.name} should render immediately when feature flag is disabled`, () => {
						render(<Component testId={`${Component.name}-test`}>Test Message</Component>);
						expect(screen.getByTestId(`${Component.name}-test`)).toHaveTextContent('Test Message');
					});
				});
			});
		},
	);
});
