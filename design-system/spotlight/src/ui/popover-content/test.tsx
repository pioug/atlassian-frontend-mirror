import React from 'react';

import { fireEvent, render, screen } from '@testing-library/react';

import { Text } from '@atlaskit/primitives/compiled';
import { ffTest } from '@atlassian/feature-flags-test-utils';

import {
	PopoverContent,
	PopoverProvider,
	PopoverTarget,
	SpotlightActions,
	SpotlightBody,
	SpotlightCard,
	SpotlightControls,
	SpotlightDismissControl,
	SpotlightFooter,
	SpotlightHeader,
	SpotlightHeadline,
	SpotlightPrimaryAction,
	SpotlightSecondaryAction,
} from '../../index';

var mockPopoverProps: jest.Mock;

jest.mock('@atlaskit/top-layer/popover', () => {
	const React = require('react');
	mockPopoverProps = jest.fn();

	return {
		Popover: React.forwardRef(
			(
				{
					children,
					isOpen,
					labelledBy,
					mode,
					role,
					testId,
					onClose,
				}: {
					children: React.ReactNode;
					isOpen: boolean;
					labelledBy?: string;
					mode?: string;
					role?: string;
					testId?: string;
					onClose?: unknown;
				},
				ref: React.Ref<HTMLDivElement>,
			) => {
				mockPopoverProps({ isOpen, labelledBy, mode, role, testId, onClose });

				return React.createElement(
					'div',
					{
						ref,
						role,
						'aria-labelledby': labelledBy,
						'data-testid': testId,
						'data-popover-mode': mode,
						'data-popover-open': String(isOpen),
					},
					children,
				);
			},
		),
	};
});

describe('PopoverContent', () => {
	beforeEach(() => {
		mockPopoverProps.mockClear();
	});

	it('captures and report a11y violations', async () => {
		const { container } = render(
			<PopoverProvider>
				<PopoverTarget>Target</PopoverTarget>
				<PopoverContent
					dismiss={() => undefined}
					testId="spotlight-popover-content"
					placement="bottom-center"
				>
					<SpotlightCard>
						<SpotlightHeader>
							<SpotlightHeadline testId="spotlight-heading">Headline</SpotlightHeadline>
							<SpotlightControls>
								<SpotlightDismissControl />
							</SpotlightControls>
						</SpotlightHeader>
						<SpotlightBody testId="spotlight-body">
							<Text>Brief and direct textual content to elaborate on the intent.</Text>
						</SpotlightBody>
						<SpotlightFooter>
							<SpotlightActions>
								<SpotlightSecondaryAction>Back</SpotlightSecondaryAction>
								<SpotlightPrimaryAction>Done</SpotlightPrimaryAction>
							</SpotlightActions>
						</SpotlightFooter>
					</SpotlightCard>
				</PopoverContent>
			</PopoverProvider>,
		);

		await expect(container).toBeAccessible();
		expect(screen.getByTestId('spotlight-popover-content')).toHaveAccessibleName('Headline');
	});

	ffTest.on(
		'platform-dst-top-layer',
		'with top-layer positioning enabled',
		() => {
			it('renders a manual top-layer popover with dialog role', () => {
				// Visual placement wiring (target ↔ popover positioning) is
				// covered by the `AllPlacements` and `Offset` visual-regression
				// snapshots in `__tests__/vr-tests/index.vr.tsx` (with
				// `platform-dst-top-layer: true`). The placement map itself is
				// unit-tested in `placement-map.test.tsx`. Here we only assert
				// the configuration that VR cannot observe — `mode='manual'`
				// (top-layer stack semantics) and `role='dialog'` (a11y).
				render(
					<PopoverProvider>
						<PopoverTarget>
							<div data-testid="target">Target</div>
						</PopoverTarget>
						<PopoverContent
							dismiss={() => undefined}
							testId="spotlight-popover-content"
							placement="bottom-end"
						>
							<SpotlightCard testId="spotlight-card">
								<SpotlightHeader>
									<SpotlightHeadline>Headline</SpotlightHeadline>
								</SpotlightHeader>
								<SpotlightBody>
									<Text>Content</Text>
								</SpotlightBody>
							</SpotlightCard>
						</PopoverContent>
					</PopoverProvider>,
				);

				expect(screen.getByTestId('spotlight-popover-content')).toHaveAttribute(
					'data-popover-mode',
					'manual',
				);
				expect(screen.getByTestId('spotlight-popover-content')).toHaveAttribute(
					'data-popover-open',
					'true',
				);
				expect(mockPopoverProps).toHaveBeenLastCalledWith(
					expect.objectContaining({
						mode: 'manual',
						onClose: undefined,
						role: 'dialog',
					}),
				);
			});

			it('dismisses on Escape with a synthetic keyboard event', () => {
				const mockDismiss = jest.fn();

				render(
					<PopoverProvider>
						<PopoverTarget>Target</PopoverTarget>
						<PopoverContent
							dismiss={mockDismiss}
							testId="spotlight-popover-content"
							placement="bottom-center"
						>
							<SpotlightCard>
								<SpotlightHeader>
									<SpotlightHeadline>Headline</SpotlightHeadline>
								</SpotlightHeader>
							</SpotlightCard>
						</PopoverContent>
					</PopoverProvider>,
				);

				fireEvent.keyDown(document, { key: 'Escape' });

				expect(mockDismiss).toHaveBeenCalledWith(
					expect.objectContaining({
						key: 'Escape',
						type: 'keydown',
					}),
				);
			});

			it('dismisses on outside click and respects shouldDismissOnClickOutside', () => {
				const mockDismiss = jest.fn();
				const { rerender } = render(
					<PopoverProvider>
						<PopoverTarget>Target</PopoverTarget>
						<PopoverContent
							dismiss={mockDismiss}
							testId="spotlight-popover-content"
							placement="bottom-center"
						>
							<SpotlightCard>
								<SpotlightHeader>
									<SpotlightHeadline>Headline</SpotlightHeadline>
								</SpotlightHeader>
							</SpotlightCard>
						</PopoverContent>
					</PopoverProvider>,
				);

				fireEvent.click(document.body);
				expect(mockDismiss).toHaveBeenCalledWith(expect.objectContaining({ type: 'click' }));

				mockDismiss.mockClear();

				rerender(
					<PopoverProvider>
						<PopoverTarget>Target</PopoverTarget>
						<PopoverContent
							dismiss={mockDismiss}
							testId="spotlight-popover-content"
							placement="bottom-center"
							shouldDismissOnClickOutside={false}
						>
							<SpotlightCard>
								<SpotlightHeader>
									<SpotlightHeadline>Headline</SpotlightHeadline>
								</SpotlightHeader>
							</SpotlightCard>
						</PopoverContent>
					</PopoverProvider>,
				);

				fireEvent.click(document.body);
				expect(mockDismiss).not.toHaveBeenCalled();
			});

			it('does not dismiss when clicking inside the top-layer popover', () => {
				const mockDismiss = jest.fn();

				render(
					<PopoverProvider>
						<PopoverTarget>Target</PopoverTarget>
						<PopoverContent
							dismiss={mockDismiss}
							testId="spotlight-popover-content"
							placement="bottom-center"
						>
							<SpotlightCard>
								<SpotlightHeader>
									<SpotlightHeadline>Headline</SpotlightHeadline>
								</SpotlightHeader>
							</SpotlightCard>
						</PopoverContent>
					</PopoverProvider>,
				);

				fireEvent.click(screen.getByTestId('spotlight-popover-content'));

				expect(mockDismiss).not.toHaveBeenCalled();
			});
		},
	);

	describe('shouldDismissOnClickOutside', () => {
		beforeEach(() => {
			jest.clearAllMocks();
		});

		afterEach(() => {
			// Clean up any DOM elements that might have been added
			document.querySelectorAll('[data-test-outside-element]').forEach((el) => {
				el.remove();
			});
		});

		it('should dismiss popover when clicking outside by default (shouldDismissOnClickOutside=true)', () => {
			const mockDismiss = jest.fn();

			render(
				<PopoverProvider>
					<PopoverTarget>
						<div data-testid="target">Target</div>
					</PopoverTarget>
					<PopoverContent
						dismiss={mockDismiss}
						testId="spotlight-popover-content"
						placement="bottom-center"
						shouldDismissOnClickOutside={true}
					>
						<SpotlightCard testId="spotlight-card">
							<SpotlightHeader>
								<SpotlightHeadline>Headline</SpotlightHeadline>
							</SpotlightHeader>
							<SpotlightBody>
								<Text>Content</Text>
							</SpotlightBody>
						</SpotlightCard>
					</PopoverContent>
				</PopoverProvider>,
			);

			// Create an element outside the popover
			const outsideElement = document.createElement('div');
			outsideElement.setAttribute('data-test-outside-element', 'true');
			document.body.appendChild(outsideElement);

			// Click outside the popover
			fireEvent.mouseUp(outsideElement);

			// Should call dismiss
			expect(mockDismiss).toHaveBeenCalledTimes(1);
			expect(mockDismiss).toHaveBeenCalledWith(
				expect.objectContaining({
					type: 'mouseup',
					target: outsideElement,
				}),
			);
		});

		it('should dismiss popover when clicking outside with default prop behavior (prop not specified)', () => {
			const mockDismiss = jest.fn();

			render(
				<PopoverProvider>
					<PopoverTarget>
						<div data-testid="target">Target</div>
					</PopoverTarget>
					<PopoverContent
						dismiss={mockDismiss}
						testId="spotlight-popover-content"
						placement="bottom-center"
					// shouldDismissOnClickOutside not specified - should default to true
					>
						<SpotlightCard testId="spotlight-card">
							<SpotlightHeader>
								<SpotlightHeadline>Headline</SpotlightHeadline>
							</SpotlightHeader>
							<SpotlightBody>
								<Text>Content</Text>
							</SpotlightBody>
						</SpotlightCard>
					</PopoverContent>
				</PopoverProvider>,
			);

			// Create an element outside the popover
			const outsideElement = document.createElement('div');
			outsideElement.setAttribute('data-test-outside-element', 'true');
			document.body.appendChild(outsideElement);

			// Click outside the popover
			fireEvent.mouseUp(outsideElement);

			// Should call dismiss (default behavior)
			expect(mockDismiss).toHaveBeenCalledTimes(1);
			expect(mockDismiss).toHaveBeenCalledWith(
				expect.objectContaining({
					type: 'mouseup',
					target: outsideElement,
				}),
			);
		});

		it('should NOT dismiss popover when clicking outside if shouldDismissOnClickOutside=false', () => {
			const mockDismiss = jest.fn();

			render(
				<PopoverProvider>
					<PopoverTarget>
						<div data-testid="target">Target</div>
					</PopoverTarget>
					<PopoverContent
						dismiss={mockDismiss}
						testId="spotlight-popover-content"
						placement="bottom-center"
						shouldDismissOnClickOutside={false}
					>
						<SpotlightCard testId="spotlight-card">
							<SpotlightHeader>
								<SpotlightHeadline>Headline</SpotlightHeadline>
							</SpotlightHeader>
							<SpotlightBody>
								<Text>Content</Text>
							</SpotlightBody>
						</SpotlightCard>
					</PopoverContent>
				</PopoverProvider>,
			);

			// Create an element outside the popover
			const outsideElement = document.createElement('div');
			outsideElement.setAttribute('data-test-outside-element', 'true');
			document.body.appendChild(outsideElement);

			// Click outside the popover
			fireEvent.mouseUp(outsideElement);

			// Should NOT call dismiss
			expect(mockDismiss).not.toHaveBeenCalled();
		});

		it('should NOT dismiss popover when clicking outside multiple times if shouldDismissOnClickOutside=false', () => {
			const mockDismiss = jest.fn();

			render(
				<PopoverProvider>
					<PopoverTarget>
						<div data-testid="target">Target</div>
					</PopoverTarget>
					<PopoverContent
						dismiss={mockDismiss}
						testId="spotlight-popover-content"
						placement="bottom-center"
						shouldDismissOnClickOutside={false}
					>
						<SpotlightCard testId="spotlight-card">
							<SpotlightHeader>
								<SpotlightHeadline>Headline</SpotlightHeadline>
							</SpotlightHeader>
							<SpotlightBody>
								<Text>Content</Text>
							</SpotlightBody>
						</SpotlightCard>
					</PopoverContent>
				</PopoverProvider>,
			);

			// Create multiple elements outside the popover
			const outsideElement1 = document.createElement('div');
			const outsideElement2 = document.createElement('div');
			outsideElement1.setAttribute('data-test-outside-element', 'true');
			outsideElement2.setAttribute('data-test-outside-element', 'true');
			document.body.appendChild(outsideElement1);
			document.body.appendChild(outsideElement2);

			// Click outside the popover multiple times
			fireEvent.mouseUp(outsideElement1);
			fireEvent.mouseUp(outsideElement2);
			fireEvent.mouseUp(document.body);

			// Should NOT call dismiss for any of the clicks
			expect(mockDismiss).not.toHaveBeenCalled();
		});

		it('should still allow other dismiss methods when shouldDismissOnClickOutside=false', () => {
			const mockDismiss = jest.fn();

			render(
				<PopoverProvider>
					<PopoverTarget>
						<div data-testid="target">Target</div>
					</PopoverTarget>
					<PopoverContent
						dismiss={mockDismiss}
						testId="spotlight-popover-content"
						placement="bottom-center"
						shouldDismissOnClickOutside={false}
					>
						<SpotlightCard testId="spotlight-card">
							<SpotlightHeader>
								<SpotlightHeadline>Headline</SpotlightHeadline>
								<SpotlightControls>
									<SpotlightDismissControl testId="dismiss-control" />
								</SpotlightControls>
							</SpotlightHeader>
							<SpotlightBody>
								<Text>Content</Text>
							</SpotlightBody>
							<SpotlightFooter>
								<SpotlightActions>
									<SpotlightPrimaryAction testId="primary-action">Done</SpotlightPrimaryAction>
								</SpotlightActions>
							</SpotlightFooter>
						</SpotlightCard>
					</PopoverContent>
				</PopoverProvider>,
			);

			// Create an element outside the popover
			const outsideElement = document.createElement('div');
			outsideElement.setAttribute('data-test-outside-element', 'true');
			document.body.appendChild(outsideElement);

			// Click outside the popover - should NOT dismiss
			fireEvent.mouseUp(outsideElement);
			expect(mockDismiss).not.toHaveBeenCalled();

			// Click the dismiss control - should dismiss
			const dismissControl = screen.getByTestId('dismiss-control');
			fireEvent.click(dismissControl);
			expect(mockDismiss).toHaveBeenCalledTimes(1);

			// Reset mock for next test
			mockDismiss.mockClear();

			// Test Escape key - should dismiss
			fireEvent.keyDown(document, { key: 'Escape', code: 'Escape' });
			expect(mockDismiss).toHaveBeenCalledTimes(1);
		});
	});
});
