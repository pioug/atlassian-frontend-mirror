import React from 'react';

import { bind } from 'bind-event-listener';

import { screen } from '@atlassian/testing-library/screen';
import { render } from '@atlassian/testing-library/testing-library/react';

import { Popover } from '../../src/popover/popover';

// JSDOM does not implement CSS animations. The test environment returns a pending
// animation, which keeps the popover in `entering` and proves that initial focus
// does not wait for animation settlement.

type TTestPopoverProps = {
	isOpen: boolean;
	isAnimated?: boolean;
};

function TestMenuPopover({ isOpen, isAnimated = false }: TTestPopoverProps) {
	return (
		<Popover isOpen={isOpen} role="menu" label="test-menu" shouldAnimate={isAnimated}>
			<button type="button" data-testid="first-item">
				First
			</button>
			<button type="button" data-testid="second-item">
				Second
			</button>
		</Popover>
	);
}

it('should capture and report a11y violations', async () => {
	const { container } = render(<TestMenuPopover isOpen={false} />);
	await expect(container).toBeAccessible();
});

describe('useInitialFocus (via Popover)', () => {
	it('focuses the first menu item synchronously when animation is disabled', () => {
		const { rerender } = render(<TestMenuPopover isOpen={false} />);

		rerender(<TestMenuPopover isOpen={true} />);

		// Non-animated path: phase goes `closed -> open` in the same commit, so
		// focus must land on the first item without any timer advancement.
		expect(screen.getByTestId('first-item')).toHaveFocus();
	});

	it('focuses the first menu item during the entering phase without waiting for transition end', () => {
		const { rerender } = render(<TestMenuPopover isOpen={false} isAnimated={true} />);

		rerender(<TestMenuPopover isOpen={true} isAnimated={true} />);

		// Animated path: phase is `entering` because the animation has not settled.
		// If focus only fired on `phase === 'open'` this would fail. The fix moves
		// focus on the transition out of `'closed'`.
		expect(screen.getByTestId('first-item')).toHaveFocus();
	});

	it('does not re-focus on subsequent renders within the same open cycle', () => {
		const { rerender } = render(<TestMenuPopover isOpen={false} isAnimated={true} />);

		rerender(<TestMenuPopover isOpen={true} isAnimated={true} />);

		const first = screen.getByTestId('first-item');
		const second = screen.getByTestId('second-item');
		expect(first).toHaveFocus();

		// User moves focus to the second item (simulating arrow-key navigation).
		second.focus();
		expect(second).toHaveFocus();

		// A re-render with the same `isOpen` must not snap focus back to the
		// first item. The `prevPhase` ref guard rejects transitions whose
		// previous phase was neither `closed` nor `exiting`.
		rerender(<TestMenuPopover isOpen={true} isAnimated={true} />);

		expect(second).toHaveFocus();
	});

	it('does not move focus into a menu popup controlled by a focused combobox trigger', () => {
		// WAI-ARIA APG Combobox Pattern: when a combobox controls its popup,
		// focus must remain on the textbox. Navigation through popup items
		// is proxied via the combobox (typically with `aria-activedescendant`).
		const popupId = 'combobox-menu-popup';
		function TestComboboxMenu({ isOpen }: { isOpen: boolean }) {
			return (
				<div>
					<input
						type="text"
						role="combobox"
						aria-controls={popupId}
						aria-expanded={isOpen}
						aria-haspopup="menu"
						data-testid="combobox-input"
					/>
					<Popover isOpen={isOpen} role="menu" label="combobox-menu" id={popupId}>
						<button type="button" data-testid="menu-item">
							Item
						</button>
					</Popover>
				</div>
			);
		}

		const { rerender } = render(<TestComboboxMenu isOpen={false} />);
		const input = screen.getByTestId('combobox-input');
		input.focus();
		expect(input).toHaveFocus();

		rerender(<TestComboboxMenu isOpen={true} />);

		// Focus must remain on the combobox textbox, not move to the menu item.
		expect(input).toHaveFocus();
		expect(screen.getByTestId('menu-item')).not.toHaveFocus();
	});

	it('does not move focus into a listbox popup controlled by a focused combobox trigger', () => {
		const popupId = 'combobox-listbox-popup';
		function TestComboboxListbox({ isOpen }: { isOpen: boolean }) {
			return (
				<div>
					<input
						type="text"
						role="combobox"
						aria-controls={popupId}
						aria-expanded={isOpen}
						aria-haspopup="listbox"
						data-testid="combobox-input"
					/>
					<Popover isOpen={isOpen} role="listbox" label="combobox-listbox" id={popupId}>
						<div role="option" aria-selected="false" tabIndex={-1} data-testid="option-1">
							One
						</div>
						<div role="option" aria-selected="true" tabIndex={-1} data-testid="option-2">
							Two
						</div>
					</Popover>
				</div>
			);
		}

		const { rerender } = render(<TestComboboxListbox isOpen={false} />);
		const input = screen.getByTestId('combobox-input');
		input.focus();
		expect(input).toHaveFocus();

		rerender(<TestComboboxListbox isOpen={true} />);

		// Even though option-2 is `aria-selected="true"`, focus must remain
		// on the textbox because the combobox owns this popup.
		expect(input).toHaveFocus();
		expect(screen.getByTestId('option-2')).not.toHaveFocus();
	});

	it('recognises a combobox whose aria-controls is a space-separated list including the popup id', () => {
		// `aria-controls` is an IDREFS attribute. A combobox may legitimately
		// control multiple elements (e.g. the popup AND a live status region),
		// and we must still treat the popup as combobox-owned.
		const popupId = 'multi-controls-popup';
		function TestMultiControlsCombobox({ isOpen }: { isOpen: boolean }) {
			return (
				<div>
					<input
						type="text"
						role="combobox"
						aria-controls={`${popupId} status-region`}
						aria-expanded={isOpen}
						aria-haspopup="menu"
						data-testid="combobox-input"
					/>
					<Popover isOpen={isOpen} role="menu" label="multi-controls-menu" id={popupId}>
						<button type="button" data-testid="menu-item">
							Item
						</button>
					</Popover>
				</div>
			);
		}

		const { rerender } = render(<TestMultiControlsCombobox isOpen={false} />);
		const input = screen.getByTestId('combobox-input');
		input.focus();

		rerender(<TestMultiControlsCombobox isOpen={true} />);

		expect(input).toHaveFocus();
		expect(screen.getByTestId('menu-item')).not.toHaveFocus();
	});

	it('still moves focus into a menu popup when the focused combobox controls a different popup', () => {
		// A combobox with `aria-controls` pointing at a different element id
		// must not suppress this popup's initial focus.
		function TestUnrelatedCombobox({ isOpen }: { isOpen: boolean }) {
			return (
				<div>
					<input
						type="text"
						role="combobox"
						aria-controls="some-other-popup"
						aria-expanded={isOpen}
						aria-haspopup="menu"
						data-testid="combobox-input"
					/>
					<Popover isOpen={isOpen} role="menu" label="unrelated-menu">
						<button type="button" data-testid="menu-item">
							Item
						</button>
					</Popover>
				</div>
			);
		}

		const { rerender } = render(<TestUnrelatedCombobox isOpen={false} />);
		const input = screen.getByTestId('combobox-input');
		input.focus();

		rerender(<TestUnrelatedCombobox isOpen={true} />);

		// Combobox controls a different popup, so this menu's initial focus
		// still applies.
		expect(screen.getByTestId('menu-item')).toHaveFocus();
	});

	it('does not move focus into a listbox owned by an external combobox via aria-owns (react-select pattern)', () => {
		// `react-select` portals the listbox separately from the textbox and
		// historically declares ownership via legacy `aria-owns`. The
		// combobox carve-out must honour this just like `aria-controls`.
		const popupId = 'external-listbox-popup';
		function TestExternalAriaOwnsCombobox({ isOpen }: { isOpen: boolean }) {
			return (
				<div>
					{/* No `role="combobox"` here on purpose: the predicate accepts
					 * text-like inputs declaring `aria-owns`, and adding both
					 * `aria-owns` AND `aria-controls` would muddy what this
					 * test is actually asserting (legacy `aria-owns` support).
					 */}
					<input type="text" aria-owns={popupId} data-testid="external-input" />
					<Popover isOpen={isOpen} role="listbox" label="external-listbox" id={popupId}>
						<div role="option" aria-selected="true" tabIndex={-1} data-testid="option-1">
							One
						</div>
					</Popover>
				</div>
			);
		}

		const { rerender } = render(<TestExternalAriaOwnsCombobox isOpen={false} />);
		const input = screen.getByTestId('external-input');
		input.focus();

		rerender(<TestExternalAriaOwnsCombobox isOpen={true} />);

		expect(input).toHaveFocus();
		expect(screen.getByTestId('option-1')).not.toHaveFocus();
	});

	it('does not move focus into a listbox owned by an external combobox whose aria-controls references a wrapper containing the popup', () => {
		// `react-select` style: the textbox declares `aria-controls` against
		// a wrapper id, and the listbox is rendered as a descendant of that
		// wrapper. The unified predicate must accept "IS or CONTAINS" matches,
		// not just strict id equality with the popup container.
		const wrapperId = 'external-listbox-wrapper';
		function TestExternalWrapperCombobox({ isOpen }: { isOpen: boolean }) {
			return (
				<div>
					<input
						type="text"
						role="combobox"
						aria-controls={wrapperId}
						aria-expanded={isOpen}
						aria-haspopup="listbox"
						data-testid="external-input"
					/>
					<div id={wrapperId}>
						<Popover isOpen={isOpen} role="listbox" label="external-wrapped-listbox">
							<div role="option" aria-selected="true" tabIndex={-1} data-testid="option-1">
								One
							</div>
						</Popover>
					</div>
				</div>
			);
		}

		const { rerender } = render(<TestExternalWrapperCombobox isOpen={false} />);
		const input = screen.getByTestId('external-input');
		input.focus();

		rerender(<TestExternalWrapperCombobox isOpen={true} />);

		expect(input).toHaveFocus();
		expect(screen.getByTestId('option-1')).not.toHaveFocus();
	});

	it('does not move focus into a listbox when the combobox aria-controls references a DESCENDANT of the popup (react-select Menu pattern)', () => {
		// `react-select` renders its `Menu` component inside a wrapper that
		// our `Popover` mounts; the actual `role="listbox"` lives on a
		// `MenuList` child rendered by react-select with id
		// `react-select-{id}-listbox`. The combobox input's `aria-controls`
		// points at that child id, not at the Popover host id.
		//
		// The carve-out must accept "popup container CONTAINS the referenced
		// element" in addition to "referenced element IS or CONTAINS the
		// popup container", or this real-world wrapper pattern would lose
		// the carve-out and react-select would receive a blur, slamming the
		// menu shut.
		const innerListboxId = 'react-select-instance-listbox';
		function TestExternalDescendantCombobox({ isOpen }: { isOpen: boolean }) {
			return (
				<div>
					<input
						type="text"
						role="combobox"
						aria-controls={innerListboxId}
						aria-expanded={isOpen}
						aria-haspopup="listbox"
						data-testid="external-input"
					/>
					<Popover isOpen={isOpen} role="listbox" label="external-descendant-listbox">
						<div id={innerListboxId}>
							<div role="option" aria-selected="true" tabIndex={-1} data-testid="option-1">
								One
							</div>
						</div>
					</Popover>
				</div>
			);
		}

		const { rerender } = render(<TestExternalDescendantCombobox isOpen={false} />);
		const input = screen.getByTestId('external-input');
		input.focus();

		rerender(<TestExternalDescendantCombobox isOpen={true} />);

		expect(input).toHaveFocus();
		expect(screen.getByTestId('option-1')).not.toHaveFocus();
	});

	it('does not move focus into a listbox owned by a focused plain text input declaring aria-controls (no role="combobox")', () => {
		// The unified predicate accepts text-like inputs even without a
		// `role="combobox"` annotation, because real-world combobox-style
		// textboxes are sometimes authored as plain `<input type="text">`
		// (or `type="search"`) with just `aria-controls`.
		const popupId = 'plain-input-listbox-popup';
		function TestPlainInputCombobox({ isOpen }: { isOpen: boolean }) {
			return (
				<div>
					{/* Plain text input with `aria-controls` but no `role="combobox"`:
					 * the unified predicate must still recognise this as a
					 * combobox-like textbox owning the popup. No `aria-expanded`
					 * because it is not a valid attribute on the implicit
					 * `textbox` role of a plain `<input>`.
					 */}
					<input type="search" aria-controls={popupId} data-testid="plain-input" />
					<Popover isOpen={isOpen} role="listbox" label="plain-input-listbox" id={popupId}>
						<div role="option" aria-selected="true" tabIndex={-1} data-testid="option-1">
							One
						</div>
					</Popover>
				</div>
			);
		}

		const { rerender } = render(<TestPlainInputCombobox isOpen={false} />);
		const input = screen.getByTestId('plain-input');
		input.focus();

		rerender(<TestPlainInputCombobox isOpen={true} />);

		expect(input).toHaveFocus();
		expect(screen.getByTestId('option-1')).not.toHaveFocus();
	});

	it('does not move focus into a menu popup owned by an EXTERNAL focused combobox (parity with listbox)', () => {
		// Regression guard: the previous implementation only covered the
		// in-popup combobox case for the `menu` role. An external combobox
		// driving a menu popup (e.g. a command-palette pattern) must now
		// also suppress initial focus movement.
		const popupId = 'external-combobox-menu-popup';
		function TestExternalComboboxMenu({ isOpen }: { isOpen: boolean }) {
			return (
				<div>
					<input
						type="text"
						role="combobox"
						aria-controls={popupId}
						aria-expanded={isOpen}
						aria-haspopup="menu"
						data-testid="external-input"
					/>
					<Popover isOpen={isOpen} role="menu" label="external-combobox-menu" id={popupId}>
						<button type="button" data-testid="menu-item">
							Item
						</button>
					</Popover>
				</div>
			);
		}

		const { rerender } = render(<TestExternalComboboxMenu isOpen={false} />);
		const input = screen.getByTestId('external-input');
		input.focus();

		rerender(<TestExternalComboboxMenu isOpen={true} />);

		expect(input).toHaveFocus();
		expect(screen.getByTestId('menu-item')).not.toHaveFocus();
	});

	it('still moves focus into a listbox when a focused NON-TEXT input declares aria-controls referencing the popup', () => {
		// Defence-in-depth: the external-combobox carve-out is gated on a
		// textbox-like element type filter. Non-text `<input>` types
		// (button, checkbox, submit, etc.) should never act as a combobox
		// textbox and must not suppress initial focus, even if they
		// declare `aria-controls` pointing at the popup.
		const popupId = 'non-text-input-listbox-popup';
		function TestNonTextInputCombobox({ isOpen }: { isOpen: boolean }) {
			return (
				<div>
					<input type="checkbox" aria-controls={popupId} data-testid="checkbox-input" />
					<Popover isOpen={isOpen} role="listbox" label="non-text-input-listbox" id={popupId}>
						<div role="option" aria-selected="true" tabIndex={-1} data-testid="option-1">
							One
						</div>
					</Popover>
				</div>
			);
		}

		const { rerender } = render(<TestNonTextInputCombobox isOpen={false} />);
		const checkbox = screen.getByTestId('checkbox-input');
		checkbox.focus();
		expect(checkbox).toHaveFocus();

		rerender(<TestNonTextInputCombobox isOpen={true} />);

		// Checkbox is not textbox-like, so the carve-out must not apply.
		// Initial focus should move into the listbox.
		expect(screen.getByTestId('option-1')).toHaveFocus();
	});

	it('does not move focus into a listbox owned by a focused TEXTAREA declaring aria-controls', () => {
		// Defence-in-depth: TEXTAREA is a valid textbox-like element and
		// must trigger the external-combobox carve-out.
		const popupId = 'textarea-listbox-popup';
		function TestTextareaCombobox({ isOpen }: { isOpen: boolean }) {
			return (
				<div>
					<textarea aria-controls={popupId} data-testid="textarea-input" />
					<Popover isOpen={isOpen} role="listbox" label="textarea-listbox" id={popupId}>
						<div role="option" aria-selected="true" tabIndex={-1} data-testid="option-1">
							One
						</div>
					</Popover>
				</div>
			);
		}

		const { rerender } = render(<TestTextareaCombobox isOpen={false} />);
		const textarea = screen.getByTestId('textarea-input');
		textarea.focus();

		rerender(<TestTextareaCombobox isOpen={true} />);

		expect(textarea).toHaveFocus();
		expect(screen.getByTestId('option-1')).not.toHaveFocus();
	});

	it('does not move focus into a listbox owned by a focused contentEditable element declaring aria-controls', () => {
		// Defence-in-depth: contentEditable hosts (rich-text editors and
		// some custom comboboxes) are textbox-like and must trigger the
		// external-combobox carve-out.
		//
		// JSDOM does not implement `HTMLElement.isContentEditable`
		// (always returns `false`), so we override it on the specific
		// element under test to mimic real-browser behaviour. The
		// `contentEditable` attribute is still set so the markup
		// matches what consumers would author.
		const popupId = 'contenteditable-listbox-popup';
		function TestContentEditableCombobox({ isOpen }: { isOpen: boolean }) {
			return (
				<div>
					{/* `contentEditable` is implicitly focusable, no
					 * `tabIndex` needed (and the a11y lint rule would
					 * reject `tabIndex` on a non-interactive element).
					 */}
					<div
						contentEditable
						suppressContentEditableWarning
						aria-controls={popupId}
						data-testid="editable-input"
					>
						editable
					</div>
					<Popover isOpen={isOpen} role="listbox" label="contenteditable-listbox" id={popupId}>
						<div role="option" aria-selected="true" tabIndex={-1} data-testid="option-1">
							One
						</div>
					</Popover>
				</div>
			);
		}

		// Patch the prototype-level getter so `el.isContentEditable`
		// reflects the `contenteditable` attribute (JSDOM omits this).
		const originalDescriptor = Object.getOwnPropertyDescriptor(
			HTMLElement.prototype,
			'isContentEditable',
		);
		Object.defineProperty(HTMLElement.prototype, 'isContentEditable', {
			configurable: true,
			get(this: HTMLElement) {
				return this.getAttribute('contenteditable') === 'true';
			},
		});

		try {
			const { rerender } = render(<TestContentEditableCombobox isOpen={false} />);
			const editable = screen.getByTestId('editable-input');
			editable.focus();

			rerender(<TestContentEditableCombobox isOpen={true} />);

			expect(editable).toHaveFocus();
			expect(screen.getByTestId('option-1')).not.toHaveFocus();
		} finally {
			if (originalDescriptor) {
				Object.defineProperty(HTMLElement.prototype, 'isContentEditable', originalDescriptor);
			} else {
				// eslint-disable-next-line @typescript-eslint/no-dynamic-delete
				delete (HTMLElement.prototype as unknown as Record<string, unknown>).isContentEditable;
			}
		}
	});

	it('still moves focus into a listbox when no element is focused (document.body active)', () => {
		// Sanity check: with nothing focused, the external-combobox
		// carve-out must not be triggered. Initial focus must move into
		// the listbox as normal.
		function TestNoActiveElement({ isOpen }: { isOpen: boolean }) {
			return (
				<Popover isOpen={isOpen} role="listbox" label="no-active-element-listbox">
					<div role="option" aria-selected="true" tabIndex={-1} data-testid="option-1">
						One
					</div>
				</Popover>
			);
		}

		const { rerender } = render(<TestNoActiveElement isOpen={false} />);
		// Make sure body is the active element (no element holds focus).
		// Focus the body explicitly rather than reading
		// `document.activeElement` directly (which the
		// `testing-library/no-node-access` rule flags).
		document.body.focus();

		rerender(<TestNoActiveElement isOpen={true} />);

		expect(screen.getByTestId('option-1')).toHaveFocus();
	});

	it('does not move focus into a dialog popup controlled by a focused combobox outside it', () => {
		const popupId = 'external-combobox-dialog-popup';
		function TestExternalComboboxDialog({ isOpen }: { isOpen: boolean }) {
			return (
				<div>
					<input
						type="text"
						role="combobox"
						aria-controls={popupId}
						aria-expanded={isOpen}
						aria-haspopup="dialog"
						data-testid="external-input"
					/>
					<Popover isOpen={isOpen} role="dialog" label="external-combobox-dialog" id={popupId}>
						<button type="button" data-testid="dialog-button">
							Result
						</button>
					</Popover>
				</div>
			);
		}

		const { rerender } = render(<TestExternalComboboxDialog isOpen={false} />);
		const input = screen.getByTestId('external-input');
		input.focus();

		rerender(<TestExternalComboboxDialog isOpen={true} />);

		expect(input).toHaveFocus();
		expect(screen.getByTestId('dialog-button')).not.toHaveFocus();
	});

	it('does not move focus into a dialog popup when an outside combobox controls an element inside it', () => {
		// The outside combobox's `aria-controls` points at a listbox inside the
		// dialog, not at the dialog itself. The combobox still controls the
		// dialog, so focus stays on it.
		function TestExternalComboboxInnerTarget({ isOpen }: { isOpen: boolean }) {
			return (
				<div>
					<input
						type="text"
						role="combobox"
						aria-controls="inner-results"
						aria-expanded={isOpen}
						aria-haspopup="dialog"
						data-testid="external-input"
					/>
					<Popover isOpen={isOpen} role="dialog" label="external-combobox-inner-target">
						<button type="button" data-testid="dialog-button">
							Filter
						</button>
						<div role="listbox" id="inner-results" aria-label="Results">
							<div role="option" aria-selected="false" tabIndex={-1}>
								One
							</div>
						</div>
					</Popover>
				</div>
			);
		}

		const { rerender } = render(<TestExternalComboboxInnerTarget isOpen={false} />);
		const input = screen.getByTestId('external-input');
		input.focus();

		rerender(<TestExternalComboboxInnerTarget isOpen={true} />);

		expect(input).toHaveFocus();
		expect(screen.getByTestId('dialog-button')).not.toHaveFocus();
	});

	it('still moves focus into a dialog popup that contains a focused combobox', () => {
		// The combobox and its listbox are both inside the dialog, so the
		// combobox does not control the dialog. The content focuses the
		// combobox in its own mount effect, which runs before Popover's.
		function InnerCombobox() {
			const ref = React.useRef<HTMLInputElement>(null);
			React.useEffect(() => {
				ref.current?.focus();
			}, []);
			return (
				<>
					<input
						ref={ref}
						type="text"
						role="combobox"
						aria-controls="inner-listbox"
						aria-expanded
						data-testid="inner-input"
					/>
					<div role="listbox" id="inner-listbox" aria-label="Options">
						<div role="option" aria-selected="false">
							One
						</div>
					</div>
				</>
			);
		}
		function TestDialogWithCombobox({ isOpen }: { isOpen: boolean }) {
			return (
				<Popover isOpen={isOpen} role="dialog" label="dialog-with-combobox">
					<button type="button" data-testid="first-button">
						First
					</button>
					<InnerCombobox />
				</Popover>
			);
		}

		const { rerender } = render(<TestDialogWithCombobox isOpen={false} />);

		rerender(<TestDialogWithCombobox isOpen={true} />);

		expect(screen.getByTestId('first-button')).toHaveFocus();
	});

	it('re-focuses the first menu item on exiting → entering reopen (Escape-then-reopen flow)', () => {
		// Animated path so the host element stays mounted in the `exiting`
		// phase while the user reopens. Without animation the phase would
		// settle to `closed` before the reopen and the regular fresh-open
		// branch would handle it.
		const { rerender } = render(<TestMenuPopover isOpen={false} isAnimated={true} />);

		rerender(<TestMenuPopover isOpen={true} isAnimated={true} />);

		const first = screen.getByTestId('first-item');
		expect(first).toHaveFocus();

		// Simulate the browser's native focus restoration on Escape /
		// hidePopover() / dialog.close(): focus moves out of the popup
		// before React renders the close.
		first.blur();
		expect(first).not.toHaveFocus();

		// Close intent → phase machine moves to `exiting`. The exit
		// transition has not settled (no timer advancement), so the host
		// element is still mounted.
		rerender(<TestMenuPopover isOpen={false} isAnimated={true} />);

		// User immediately reopens → phase machine jumps
		// `exiting → entering` without passing through `closed`. The
		// updated guard re-runs initial focus so the menu does not open
		// with focus stranded on the trigger.
		rerender(<TestMenuPopover isOpen={true} isAnimated={true} />);

		expect(screen.getByTestId('first-item')).toHaveFocus();
	});
});

describe('initialFocusRef (via Popover)', () => {
	function setAutofocusAttribute(node: HTMLElement | null) {
		node?.setAttribute('autofocus', '');
	}

	type TRefPopoverProps = {
		isOpen: boolean;
		isAnimated?: boolean;
		hasTarget?: boolean;
		hasNativeDefault?: boolean;
	};

	function TestDialogWithTarget({
		isOpen,
		isAnimated = false,
		hasTarget = true,
		hasNativeDefault = true,
	}: TRefPopoverProps) {
		const targetRef = React.useRef<HTMLButtonElement>(null);
		return (
			<Popover
				isOpen={isOpen}
				role="dialog"
				label="dialog-with-target"
				shouldAnimate={isAnimated}
				initialFocusRef={targetRef}
			>
				<div>
					<button type="button" data-testid="first-button">
						First
					</button>
					{/* The native attribute, not the JSX `autoFocus` prop: React 18 does
					 * not set the attribute, and calls `.focus()` itself on commit. */}
					{hasNativeDefault ? (
						<button type="button" data-testid="autofocus-button" ref={setAutofocusAttribute}>
							Autofocus
						</button>
					) : null}
					{hasTarget ? (
						<button type="button" data-testid="target-button" ref={targetRef}>
							Target
						</button>
					) : null}
				</div>
			</Popover>
		);
	}

	it('focuses the target instead of the [autofocus] element for a dialog', () => {
		const { rerender } = render(<TestDialogWithTarget isOpen={false} />);

		rerender(<TestDialogWithTarget isOpen={true} />);

		expect(screen.getByTestId('target-button')).toHaveFocus();
	});

	function getFocusedTestIdsDuring(action: () => void): Array<string | null> {
		const focusedTestIds: Array<string | null> = [];
		const unbind = bind(document, {
			type: 'focusin',
			listener: (event) => {
				focusedTestIds.push(
					event.target instanceof HTMLElement ? event.target.getAttribute('data-testid') : null,
				);
			},
		});
		try {
			action();
		} finally {
			unbind();
		}
		return focusedTestIds;
	}

	it('moves focus once, straight to the target, instead of to the role default', () => {
		const { rerender } = render(<TestDialogWithTarget isOpen={false} hasNativeDefault={false} />);

		const focusedTestIds = getFocusedTestIdsDuring(() => {
			rerender(<TestDialogWithTarget isOpen={true} hasNativeDefault={false} />);
		});

		expect(focusedTestIds).toEqual(['target-button']);
	});

	it('moves focus to the target after the native popover autofocus step', () => {
		// `showPopover()` focuses the first `[autofocus]` element itself (the popover
		// focusing steps), before any effect runs. The target then takes focus.
		const { rerender } = render(<TestDialogWithTarget isOpen={false} />);

		const focusedTestIds = getFocusedTestIdsDuring(() => {
			rerender(<TestDialogWithTarget isOpen={true} />);
		});

		expect(focusedTestIds).toEqual(['autofocus-button', 'target-button']);
	});

	it('focuses the role default when the ref holds no element', () => {
		const { rerender } = render(<TestDialogWithTarget isOpen={false} hasTarget={false} />);

		rerender(<TestDialogWithTarget isOpen={true} hasTarget={false} />);

		expect(screen.getByTestId('autofocus-button')).toHaveFocus();
	});

	it('focuses the role default when the ref holds an element that is not in the DOM', () => {
		const detached = document.createElement('button');
		function TestDetachedTarget({ isOpen }: { isOpen: boolean }) {
			const targetRef = React.useRef<HTMLElement>(detached);
			return (
				<Popover isOpen={isOpen} role="dialog" label="detached-target" initialFocusRef={targetRef}>
					<button type="button" data-testid="first-button">
						First
					</button>
				</Popover>
			);
		}

		const { rerender } = render(<TestDetachedTarget isOpen={false} />);

		rerender(<TestDetachedTarget isOpen={true} />);

		expect(screen.getByTestId('first-button')).toHaveFocus();
	});

	it('focuses the role default when the target is outside the popover', () => {
		function TestOutsideTarget({ isOpen }: { isOpen: boolean }) {
			const targetRef = React.useRef<HTMLButtonElement>(null);
			return (
				<div>
					<button type="button" data-testid="outside-button" ref={targetRef}>
						Outside
					</button>
					<Popover isOpen={isOpen} role="dialog" label="outside-target" initialFocusRef={targetRef}>
						<button type="button" data-testid="first-button">
							First
						</button>
					</Popover>
				</div>
			);
		}

		const { rerender } = render(<TestOutsideTarget isOpen={false} />);

		rerender(<TestOutsideTarget isOpen={true} />);

		expect(screen.getByTestId('first-button')).toHaveFocus();
	});

	it('focuses the target instead of the first menu item', () => {
		function TestMenuWithTarget({ isOpen }: { isOpen: boolean }) {
			const targetRef = React.useRef<HTMLButtonElement>(null);
			return (
				<Popover isOpen={isOpen} role="menu" label="menu-with-target" initialFocusRef={targetRef}>
					<div>
						<button type="button" data-testid="first-item">
							First
						</button>
						<button type="button" data-testid="target-item" ref={targetRef}>
							Target
						</button>
					</div>
				</Popover>
			);
		}

		const { rerender } = render(<TestMenuWithTarget isOpen={false} />);

		rerender(<TestMenuWithTarget isOpen={true} />);

		expect(screen.getByTestId('target-item')).toHaveFocus();
	});

	it('focuses the target instead of the selected listbox option', () => {
		function TestListboxWithTarget({ isOpen }: { isOpen: boolean }) {
			const targetRef = React.useRef<HTMLDivElement>(null);
			return (
				<Popover
					isOpen={isOpen}
					role="listbox"
					label="listbox-with-target"
					initialFocusRef={targetRef}
				>
					<div>
						<div role="option" aria-selected="true" tabIndex={-1} data-testid="selected-option">
							Selected
						</div>
						<div
							role="option"
							aria-selected="false"
							tabIndex={-1}
							data-testid="target-option"
							ref={targetRef}
						>
							Target
						</div>
					</div>
				</Popover>
			);
		}

		const { rerender } = render(<TestListboxWithTarget isOpen={false} />);

		rerender(<TestListboxWithTarget isOpen={true} />);

		expect(screen.getByTestId('target-option')).toHaveFocus();
	});

	it('keeps focus on a combobox outside that controls the dialog, even with a target', () => {
		const popupId = 'combobox-dialog-with-target';
		function TestComboboxDialogWithTarget({ isOpen }: { isOpen: boolean }) {
			const targetRef = React.useRef<HTMLButtonElement>(null);
			return (
				<div>
					<input
						type="text"
						role="combobox"
						aria-controls={popupId}
						aria-expanded={isOpen}
						aria-haspopup="dialog"
						data-testid="external-input"
					/>
					<Popover
						isOpen={isOpen}
						role="dialog"
						label="combobox-dialog-with-target"
						id={popupId}
						initialFocusRef={targetRef}
					>
						<button type="button" data-testid="target-button" ref={targetRef}>
							Target
						</button>
					</Popover>
				</div>
			);
		}

		const { rerender } = render(<TestComboboxDialogWithTarget isOpen={false} />);
		const input = screen.getByTestId('external-input');
		input.focus();

		rerender(<TestComboboxDialogWithTarget isOpen={true} />);

		// The combobox check decides whether focus moves. The target only
		// decides where.
		expect(input).toHaveFocus();
		expect(screen.getByTestId('target-button')).not.toHaveFocus();
	});

	it('does not re-focus the target on later renders in the same open cycle', () => {
		const { rerender } = render(<TestDialogWithTarget isOpen={false} />);

		rerender(<TestDialogWithTarget isOpen={true} />);
		expect(screen.getByTestId('target-button')).toHaveFocus();

		const first = screen.getByTestId('first-button');
		first.focus();

		rerender(<TestDialogWithTarget isOpen={true} />);

		expect(first).toHaveFocus();
	});

	it('focuses the target again on each open', () => {
		const { rerender } = render(<TestDialogWithTarget isOpen={false} />);

		rerender(<TestDialogWithTarget isOpen={true} />);
		expect(screen.getByTestId('target-button')).toHaveFocus();

		rerender(<TestDialogWithTarget isOpen={false} />);
		rerender(<TestDialogWithTarget isOpen={true} />);

		expect(screen.getByTestId('target-button')).toHaveFocus();
	});

	it('focuses the target again on exiting → entering reopen', () => {
		const { rerender } = render(<TestDialogWithTarget isOpen={false} isAnimated={true} />);

		rerender(<TestDialogWithTarget isOpen={true} isAnimated={true} />);
		const target = screen.getByTestId('target-button');
		expect(target).toHaveFocus();

		// Simulate the browser's native focus restoration on close.
		target.blur();

		// The exit animation has not settled, so the host stays mounted.
		rerender(<TestDialogWithTarget isOpen={false} isAnimated={true} />);
		rerender(<TestDialogWithTarget isOpen={true} isAnimated={true} />);

		expect(screen.getByTestId('target-button')).toHaveFocus();
	});

	it.each([
		{ name: 'no role', role: undefined },
		{ name: 'a tooltip', role: 'tooltip' as const },
	])('ignores the target with $name, so focus stays where it is', ({ role }) => {
		// The types reject this. The runtime role check still guards untyped callers.
		function TestRoleWithTarget({ isOpen }: { isOpen: boolean }) {
			const targetRef = React.useRef<HTMLButtonElement>(null);
			return (
				<div>
					<button type="button" data-testid="trigger">
						Trigger
					</button>
					<Popover isOpen={isOpen} role={role} initialFocusRef={targetRef as never}>
						<button type="button" data-testid="target-button" ref={targetRef}>
							Target
						</button>
					</Popover>
				</div>
			);
		}

		const { rerender } = render(<TestRoleWithTarget isOpen={false} />);
		const trigger = screen.getByTestId('trigger');
		trigger.focus();

		rerender(<TestRoleWithTarget isOpen={true} />);

		expect(trigger).toHaveFocus();
	});
});
