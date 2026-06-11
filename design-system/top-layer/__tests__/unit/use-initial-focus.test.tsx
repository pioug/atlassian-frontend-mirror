import React from 'react';

import { render, screen } from '@atlassian/testing-library';

import { slideAndFade } from '../../src/entry-points/animations';
import { Popover } from '../../src/entry-points/popover';

// JSDOM does not implement CSS transitions, so the animated path's `entering -> open`
// settle only fires via the safety-net `setTimeout(durationMs + 50)`. By NOT advancing
// any timers below we keep the popover stuck in `entering` for the duration of the test
// and prove that initial focus runs without waiting for the settle.

const animation = slideAndFade();

type TTestPopoverProps = {
	isOpen: boolean;
	isAnimated?: boolean;
};

function TestMenuPopover({ isOpen, isAnimated = false }: TTestPopoverProps) {
	return (
		<Popover
			isOpen={isOpen}
			role="menu"
			label="test-menu"
			animate={isAnimated ? animation : undefined}
		>
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

		// Animated path: phase is `entering` right now. The settle timeout has NOT
		// been advanced, so if focus only fired on `phase === 'open'` this would
		// fail. The fix moves focus on the transition out of `'closed'`.
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
					<Popover
						isOpen={isOpen}
						role="listbox"
						label="non-text-input-listbox"
						id={popupId}
					>
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
					<Popover
						isOpen={isOpen}
						role="listbox"
						label="contenteditable-listbox"
						id={popupId}
					>
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
				Object.defineProperty(
					HTMLElement.prototype,
					'isContentEditable',
					originalDescriptor,
				);
			} else {
				// eslint-disable-next-line @typescript-eslint/no-dynamic-delete
				delete (HTMLElement.prototype as unknown as Record<string, unknown>)
					.isContentEditable;
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
