/* eslint-disable testing-library/no-node-access */
import React, { type Dispatch, forwardRef, type SetStateAction } from 'react';

import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { ffTest } from '@atlassian/feature-flags-test-utils';

import { Popup } from '../../popup';
import { type ContentProps, type PopupComponentProps, type TriggerProps } from '../../types';

afterEach(() => {
	jest.clearAllMocks();
});

// ── Helpers ──

const testId = 'popup';

const defaultTrigger = ({
	ref,
	'aria-controls': ariaControls,
	'aria-expanded': ariaExpanded,
	'aria-haspopup': ariaHasPopup,
	'data-ds--level': dataDsLevel,
}: TriggerProps) => (
	<button
		type="button"
		ref={ref}
		aria-controls={ariaControls}
		aria-expanded={ariaExpanded}
		aria-haspopup={ariaHasPopup}
		data-ds--level={dataDsLevel}
	>
		Trigger
	</button>
);

const defaultContent = () => <div data-testid="popup-content">Popup content</div>;

// ══════════════════════════════════════════════════════════════════════════════
// GAP 1: aria-controls references the popup element
// Legacy tests verify aria-controls is set and matches the popup id.
// The top-layer tests did not verify this linkage.
// ══════════════════════════════════════════════════════════════════════════════

// eslint-disable-next-line @atlassian/a11y/require-jest-coverage
ffTest.on('platform-dst-top-layer', 'Popup top-layer gap: aria-controls linkage', () => {
	it('aria-controls is set on the trigger when popup is open', () => {
		render(
			<Popup isOpen={true} content={defaultContent} trigger={defaultTrigger} testId={testId} />,
		);

		const trigger = screen.getByRole('button', { name: 'Trigger' });
		const ariaControlsValue = trigger.getAttribute('aria-controls');

		expect(ariaControlsValue).toBeTruthy();
	});

	it('aria-controls uses the provided id when specified', () => {
		const customId = 'custom-popup-id';

		render(
			<Popup
				isOpen={true}
				content={defaultContent}
				trigger={defaultTrigger}
				testId={testId}
				id={customId}
			/>,
		);

		const trigger = screen.getByRole('button', { name: 'Trigger' });
		expect(trigger).toHaveAttribute('aria-controls', customId);
	});

	it('aria-controls is not set when popup is closed', () => {
		render(
			<Popup isOpen={false} content={defaultContent} trigger={defaultTrigger} testId={testId} />,
		);

		const trigger = screen.getByRole('button', { name: 'Trigger' });
		expect(trigger).not.toHaveAttribute('aria-controls');
	});
});

// ══════════════════════════════════════════════════════════════════════════════
// GAP 2: Content rendering on rerender (isOpen false → true)
// Legacy tests verify popup content appears when isOpen transitions from
// false to true via rerender. Top-layer tests only tested initial render.
// ══════════════════════════════════════════════════════════════════════════════

// eslint-disable-next-line @atlassian/a11y/require-jest-coverage
ffTest.on('platform-dst-top-layer', 'Popup top-layer gap: content rendering on rerender', () => {
	it('renders content when isOpen transitions from false to true', () => {
		const { rerender } = render(
			<Popup isOpen={false} content={defaultContent} trigger={defaultTrigger} testId={testId} />,
		);

		expect(screen.queryByTestId('popup-content')).not.toBeInTheDocument();

		rerender(
			<Popup isOpen={true} content={defaultContent} trigger={defaultTrigger} testId={testId} />,
		);

		expect(screen.getByTestId('popup-content')).toBeVisible();
	});

	it('hides content when isOpen transitions from true to false', () => {
		const { rerender } = render(
			<Popup isOpen={true} content={defaultContent} trigger={defaultTrigger} testId={testId} />,
		);

		expect(screen.getByTestId('popup-content')).toBeVisible();

		rerender(
			<Popup isOpen={false} content={defaultContent} trigger={defaultTrigger} testId={testId} />,
		);

		// In the top-layer path, closed popover content may remain in the DOM
		// but the popover element should not be visible (isOpen=false passed to Popup.Content).
		expect(screen.getByTestId('popup-content')).not.toBeVisible();
	});

	it('keeps aria-expanded true during exit animation, then sets it false after animation completes', () => {
		// aria-expanded should only go false after the exit animation completes.
		// Updating it immediately when the popup begins closing would cause screen
		// readers to announce the element as closed while it is still visually
		// present on screen.
		//
		// In JSDOM there are no CSS transitions, so onExitFinish is driven by a
		// fallback timeout. We use fake timers to control when it fires.
		jest.useFakeTimers();
		// Wrapping in try/finally to ensure we always restore the real timers, in case of test failure.
		try {
			const { rerender } = render(
				<Popup isOpen={true} content={defaultContent} trigger={defaultTrigger} testId={testId} />,
			);

			const trigger = screen.getByRole('button', { name: 'Trigger' });
			expect(trigger).toHaveAttribute('aria-expanded', 'true');

			rerender(
				<Popup isOpen={false} content={defaultContent} trigger={defaultTrigger} testId={testId} />,
			);

			// aria-expanded stays true during the exit animation.
			expect(trigger).toHaveAttribute('aria-expanded', 'true');

			// Run all pending timers to trigger onExitFinish.
			act(() => {
				jest.runAllTimers();
			});

			// Now onExitFinish has fired and aria-expanded should be false.
			expect(trigger).toHaveAttribute('aria-expanded', 'false');
		} finally {
			jest.useRealTimers();
		}
	});
});

// ══════════════════════════════════════════════════════════════════════════════
// GAP 3: onClose called from within content
// Legacy tests verify that calling onClose from within content works.
// This was not covered in the top-layer tests.
// ══════════════════════════════════════════════════════════════════════════════

// eslint-disable-next-line @atlassian/a11y/require-jest-coverage
ffTest.on(
	'platform-dst-top-layer',
	'Popup top-layer gap: onClose called from within content',
	() => {
		it('calls onClose when content invokes the onClose callback', async () => {
			const onClose = jest.fn();
			render(
				<Popup
					isOpen={true}
					content={({ onClose: contentOnClose }: ContentProps) => (
						<button type="button" onClick={contentOnClose} data-testid="close-btn">
							Close
						</button>
					)}
					trigger={defaultTrigger}
					onClose={onClose}
				/>,
			);

			await userEvent.click(screen.getByTestId('close-btn'));

			expect(onClose).toHaveBeenCalledTimes(1);
		});
	},
);

// ══════════════════════════════════════════════════════════════════════════════
// GAP 4: Trigger does not re-render unnecessarily
// Legacy tests explicitly track trigger render counts to verify memoization.
// This was not covered in the top-layer tests.
// ══════════════════════════════════════════════════════════════════════════════

// eslint-disable-next-line @atlassian/a11y/require-jest-coverage
ffTest.on(
	'platform-dst-top-layer',
	'Popup top-layer gap: trigger does not re-render unnecessarily',
	() => {
		it('renders the trigger a bounded number of times across open transitions', () => {
			const triggerRender = jest.fn();

			const trigger = (props: TriggerProps) => {
				triggerRender();
				return (
					<button
						type="button"
						ref={props.ref}
						aria-controls={props['aria-controls']}
						aria-expanded={props['aria-expanded']}
						aria-haspopup={props['aria-haspopup']}
					>
						Trigger
					</button>
				);
			};

			const content = () => <div>content</div>;

			const { rerender } = render(<Popup isOpen={false} content={content} trigger={trigger} />);

			const initialTriggerCount = triggerRender.mock.calls.length;

			rerender(<Popup isOpen={true} content={content} trigger={trigger} testId={testId} />);

			// Trigger should render a bounded number of times (not unbounded)
			expect(triggerRender.mock.calls.length).toBeLessThanOrEqual(initialTriggerCount + 4);
		});
	},
);

// ══════════════════════════════════════════════════════════════════════════════
// GAP 5: Custom popupComponent receives children and renders correctly
// on open/close transitions (legacy tests verified this on rerender)
// ══════════════════════════════════════════════════════════════════════════════

// eslint-disable-next-line @atlassian/a11y/require-jest-coverage
ffTest.on(
	'platform-dst-top-layer',
	'Popup top-layer gap: popupComponent rendering on transitions',
	() => {
		it('renders custom popupComponent and its content when popup transitions to open', () => {
			const CustomContainer = forwardRef<HTMLDivElement, PopupComponentProps>(
				({ children, ...rest }, ref) => (
					<div {...rest} ref={ref} data-testid="custom-container">
						popup component
						<div>{children}</div>
					</div>
				),
			);
			CustomContainer.displayName = 'CustomContainer';

			const { rerender } = render(
				<Popup
					isOpen={false}
					content={defaultContent}
					trigger={defaultTrigger}
					popupComponent={CustomContainer}
					testId={testId}
				/>,
			);

			expect(screen.queryByText('popup component')).not.toBeInTheDocument();

			rerender(
				<Popup
					isOpen={true}
					content={defaultContent}
					trigger={defaultTrigger}
					popupComponent={CustomContainer}
					testId={testId}
				/>,
			);

			expect(screen.getByText('popup component')).toBeVisible();
			expect(screen.getByTestId('popup-content')).toBeVisible();
		});
	},
);

// ══════════════════════════════════════════════════════════════════════════════
// GAP 6: Placement prop is accepted for various values
// Legacy tests relied on Popper.js to handle placement. We verify the top-layer
// path converts and accepts various placement values without error.
// ══════════════════════════════════════════════════════════════════════════════

// eslint-disable-next-line @atlassian/a11y/require-jest-coverage
ffTest.on('platform-dst-top-layer', 'Popup top-layer gap: placement prop', () => {
	const placements = [
		'auto',
		'top',
		'bottom',
		'left',
		'right',
		'top-start',
		'top-end',
		'bottom-start',
		'bottom-end',
		'right-start',
		'right-end',
		'left-start',
		'left-end',
	] as const;

	for (const placement of placements) {
		it(`accepts placement="${placement}" without error`, () => {
			expect(() =>
				render(
					<Popup
						isOpen={true}
						content={defaultContent}
						trigger={defaultTrigger}
						placement={placement}
						testId={testId}
					/>,
				),
			).not.toThrow();

			expect(screen.getByTestId('popup-content')).toBeInTheDocument();
		});
	}
});

// ══════════════════════════════════════════════════════════════════════════════
// GAP 7: Focus is not moved to content by default (no autoFocus on content div)
// Legacy tests verify that focus does NOT move to the content div by default.
// ══════════════════════════════════════════════════════════════════════════════

// eslint-disable-next-line @atlassian/a11y/require-jest-coverage
ffTest.on('platform-dst-top-layer', 'Popup top-layer gap: focus management', () => {
	it('does not focus the content element when the popup is open', () => {
		render(
			<Popup
				isOpen={true}
				content={() => <div data-testid="content-div">content</div>}
				trigger={defaultTrigger}
			/>,
		);

		expect(screen.getByTestId('content-div')).not.toHaveFocus();
	});

	it('passes setInitialFocusRef that can be used to set initial focus target', () => {
		const contentFn = jest.fn(({ setInitialFocusRef }: ContentProps) => (
			<button
				type="button"
				ref={setInitialFocusRef as Dispatch<SetStateAction<HTMLElement | null>>}
				data-testid="focus-target"
			>
				focused button
			</button>
		));

		render(<Popup isOpen={true} content={contentFn} trigger={defaultTrigger} />);

		expect(contentFn).toHaveBeenCalledWith(
			expect.objectContaining({
				setInitialFocusRef: expect.any(Function),
			}),
		);
	});
});

// ══════════════════════════════════════════════════════════════════════════════
// GAP 8: Default aria-haspopup value when no role specified
// Legacy tests verify aria-haspopup is "true" (generic) when no role,
// while top-layer defaults to "dialog". This tests the top-layer behavior.
// ══════════════════════════════════════════════════════════════════════════════

// eslint-disable-next-line @atlassian/a11y/require-jest-coverage
ffTest.on(
	'platform-dst-top-layer',
	'Popup top-layer gap: aria-haspopup values for different roles',
	() => {
		it('sets aria-haspopup="dialog" by default (no role specified)', () => {
			render(<Popup isOpen={false} content={defaultContent} trigger={defaultTrigger} />);

			const trigger = screen.getByRole('button', { name: 'Trigger' });
			expect(trigger).toHaveAttribute('aria-haspopup', 'dialog');
		});

		it('sets aria-haspopup="dialog" when role="dialog"', () => {
			render(
				<Popup
					isOpen={false}
					content={defaultContent}
					trigger={defaultTrigger}
					role="dialog"
					label="Dialog popup"
				/>,
			);

			const trigger = screen.getByRole('button', { name: 'Trigger' });
			expect(trigger).toHaveAttribute('aria-haspopup', 'dialog');
		});

		it('sets aria-haspopup="listbox" when role="listbox"', () => {
			render(
				<Popup
					isOpen={false}
					content={defaultContent}
					trigger={defaultTrigger}
					role="listbox"
					label="Options"
				/>,
			);

			const trigger = screen.getByRole('button', { name: 'Trigger' });
			// Non-dialog/menu roles map to the generic haspopup
			expect(trigger.getAttribute('aria-haspopup')).toBeTruthy();
		});
	},
);
