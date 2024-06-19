import React from 'react';

import { render, screen } from '@testing-library/react';

import { LOADING_LABEL } from '../../../new-button/variants/shared/constants';
import type { AdditionalButtonVariantProps } from '../../../new-button/variants/types';
import variants from '../../../utils/variants';
import testEventBlocking from '../_util/test-event-blocking';

const testId = 'button';

variants.forEach(({ name, Component, elementType }) => {
	describe(`Loading ${name}`, () => {
		if (elementType === HTMLButtonElement) {
			testEventBlocking<AdditionalButtonVariantProps>(Component, { isLoading: true });

			it('should render a loading spinner when `isLoading` prop is true', () => {
				const { rerender } = render(<Component testId={testId}>Hello</Component>);

				expect(screen.queryByTestId(`${testId}--loading-spinner-wrapper`)).not.toBeInTheDocument();

				rerender(
					<Component testId={testId} isLoading>
						Hello
					</Component>,
				);

				expect(screen.getByTestId(`${testId}--loading-spinner-wrapper`)).toBeInTheDocument();
			});

			it('should be disabled', async () => {
				render(
					<Component testId={testId} isLoading>
						Label
					</Component>,
				);

				const button = screen.getByTestId(testId);
				expect(button).toBeDisabled();
			});

			it('is not focusable', () => {
				render(
					<Component testId="button" isLoading>
						Hello
					</Component>,
				);

				const button = screen.getByTestId('button');
				button.focus();

				expect(button).not.toHaveFocus();
			});

			describe('loading labels', () => {
				describe('should render loading labels when `isLoading` is true', () => {
					it('to `children` as visually hidden text', () => {
						render(
							<Component testId={testId} isLoading>
								Label
							</Component>,
						);

						const button = screen.getByTestId(testId);
						expect(button).toHaveAccessibleName(`Label ${LOADING_LABEL}`);

						// Check for visually hidden styles
						const hiddenText = screen.getByText(LOADING_LABEL);
						expect(hiddenText).toHaveStyleDeclaration('width', '1px');
						expect(hiddenText).toHaveStyleDeclaration('height', '1px');
						expect(hiddenText).toHaveStyleDeclaration('position', 'absolute');
						expect(hiddenText).toHaveStyleDeclaration('clip', 'rect(1px, 1px, 1px, 1px)');
					});
					// IconButton does not accept `aria-label`, it uses `label` instead
					if (name !== 'IconButton') {
						it('to `aria-label`', () => {
							render(
								// @ts-ignore - TS is unaware this isn't applying to IconButton
								<Component testId={testId} isLoading aria-label="Jira">
									Hello
								</Component>,
							);

							const button = screen.getByTestId(testId);
							expect(button).toHaveAccessibleName(`Jira ${LOADING_LABEL}`);
						});
					}
					it('to `aria-labelledby`', () => {
						render(
							<>
								<div id="the-label">Confluence</div>
								<Component testId={testId} isLoading aria-labelledby="the-label">
									Hello
								</Component>
							</>,
						);

						const button = screen.getByTestId(testId);
						expect(button).toHaveAccessibleName(`Confluence ${LOADING_LABEL}`);
					});

					// IconButton does not accept `aria-label`, it uses `label` instead
					if (name !== 'IconButton') {
						it('to `aria-labelledby` when `children` has content and `aria-label` is also set', () => {
							render(
								<>
									<div id="the-label">Loom</div>
									{/* @ts-ignore - TS is unaware this isn't applying to IconButton */}
									<Component
										testId={testId}
										isLoading
										aria-label="Jira"
										aria-labelledby="the-label"
									>
										Hello
									</Component>
								</>,
							);

							const button = screen.getByTestId(testId);
							expect(button).toHaveAccessibleName(`Loom ${LOADING_LABEL}`);

							// The label should be added as visually hidden text, with an ID used by `aria-labelledby`
							expect(button).toHaveTextContent(LOADING_LABEL);

							// Check for visually hidden styles
							const hiddenText = screen.getByText(LOADING_LABEL);
							expect(hiddenText).toHaveStyleDeclaration('width', '1px');
							expect(hiddenText).toHaveStyleDeclaration('height', '1px');
							expect(hiddenText).toHaveStyleDeclaration('position', 'absolute');
							expect(hiddenText).toHaveStyleDeclaration('clip', 'rect(1px, 1px, 1px, 1px)');

							// Ensure label has not been added elsewhere
							expect(button).not.toHaveAttribute('aria-label', `Foo ${LOADING_LABEL}`);
						});
					}
				});

				describe('should not render loading labels when `isLoading` is not true', () => {
					it('to `children`', () => {
						render(<Component testId={testId}>Label</Component>);

						const button = screen.getByTestId(testId);
						expect(button).toHaveAccessibleName('Label');
					});
					// IconButton does not accept `aria-label`, it uses `label` instead
					if (name !== 'IconButton') {
						it('to `aria-label`', () => {
							render(
								// @ts-expect-error - TS is unaware this isn't applying to IconButton
								<Component testId={testId} aria-label="Jira" />,
							);

							const button = screen.getByTestId(testId);
							expect(button).toHaveAccessibleName('Jira');
						});
					}
					it('to `aria-labelledby`', () => {
						render(
							<>
								<div id="the-label">Confluence</div>
								<Component testId={testId} aria-labelledby="the-label">
									Hello
								</Component>
							</>,
						);

						const button = screen.getByTestId(testId);
						expect(button).toHaveAccessibleName('Confluence');
					});
				});
			});
		} else if (elementType === HTMLAnchorElement) {
			it('should never render a loading spinner for anchor elements', async () => {
				const { rerender } = render(<Component testId={testId}>Hello</Component>);

				{
					const spinner = screen.queryByTestId(`${testId}--loading-spinner-wrapper`);
					expect(spinner).not.toBeInTheDocument();
				}

				rerender(
					<Component testId={testId} isLoading>
						Hello
					</Component>,
				);

				{
					const spinner = screen.queryByTestId(`${testId}--loading-spinner-wrapper`);
					expect(spinner).not.toBeInTheDocument();
				}
			});
		}
	});
});
