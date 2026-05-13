import React from 'react';

import { act, render, screen } from '@atlassian/testing-library';

import { Popup } from '../../src/entry-points/popup';

/**
 * Helper to find the popover element in the rendered output.
 * The polyfill sets `data-popover-open` when showPopover() is called.
 * Tests must pass testId="popover" on Popup.Content for this to work.
 */
function getPopoverElement(): HTMLElement {
	return screen.getByTestId('popover');
}

describe('Popup compound component', () => {
	it('should be accessible', async () => {
		const { container } = render(
			<Popup placement={{ edge: 'end' }} onClose={() => {}}>
				<Popup.Trigger>
					<button type="button">Trigger</button>
				</Popup.Trigger>
				<Popup.Content role="dialog" label="Test popover" testId="popover">
					Content
				</Popup.Content>
			</Popup>,
		);
		await expect(container).toBeAccessible();
	});

	it('should be accessible when open', async () => {
		const { container } = render(
			<Popup placement={{ edge: 'end' }} onClose={() => {}}>
				<Popup.Trigger>
					<button type="button">Trigger</button>
				</Popup.Trigger>
				<Popup.Content role="dialog" label="Test popover" isOpen={true} testId="popover">
					Content
				</Popup.Content>
			</Popup>,
		);
		await expect(container).toBeAccessible();
	});

	it('sets aria-haspopup="menu" on trigger when content has role="menu"', () => {
		render(
			<Popup placement={{ edge: 'end' }} onClose={() => {}}>
				<Popup.Trigger>
					<button type="button">Trigger</button>
				</Popup.Trigger>
				<Popup.Content role="menu" label="Menu" testId="popover">
					<button role="menuitem">Item</button>
				</Popup.Content>
			</Popup>,
		);

		const trigger = screen.getByRole('button', { name: 'Trigger' });
		expect(trigger).toHaveAttribute('aria-haspopup', 'menu');
	});

	it('sets aria-haspopup="dialog" on trigger when content has role="dialog"', () => {
		render(
			<Popup placement={{ edge: 'end' }} onClose={() => {}}>
				<Popup.Trigger>
					<button type="button">Trigger</button>
				</Popup.Trigger>
				<Popup.Content role="dialog" label="Dialog" testId="popover">
					Content
				</Popup.Content>
			</Popup>,
		);

		const trigger = screen.getByRole('button', { name: 'Trigger' });
		expect(trigger).toHaveAttribute('aria-haspopup', 'dialog');
	});

	it('sets aria-haspopup="listbox" on trigger when content has role="listbox"', () => {
		render(
			<Popup placement={{ edge: 'end' }} onClose={() => {}}>
				<Popup.Trigger>
					<button type="button">Trigger</button>
				</Popup.Trigger>
				<Popup.Content role="listbox" label="Listbox" testId="popover">
					<div role="option" aria-selected={false}>
						Option 1
					</div>
				</Popup.Content>
			</Popup>,
		);

		const trigger = screen.getByRole('button', { name: 'Trigger' });
		expect(trigger).toHaveAttribute('aria-haspopup', 'listbox');
	});

	it('does not open popover on mount inside compound (browser manages via togglePopover)', () => {
		render(
			<Popup placement={{ edge: 'end' }} onClose={() => {}}>
				<Popup.Trigger>
					<button type="button">Trigger</button>
				</Popup.Trigger>
				<Popup.Content role="dialog" label="Test popover" testId="popover">
					Content
				</Popup.Content>
			</Popup>,
		);

		// Inside the compound, ctx.isOpen starts false. The browser manages
		// visibility via togglePopover() from the trigger — PopupContent
		// does not auto-show on mount.
		const popoverEl = getPopoverElement();
		expect(popoverEl).not.toHaveAttribute('data-popover-open');
	});

	// Skipped: JSDOM does not support ToggleEvent (no newState property),
	// so the context handler never sets isOpen=true from a toggle event.
	// This path is covered by browser (Playwright) tests.
	// The isOpen prop tests below cover the equivalent showPopover() lifecycle.

	it('calls hidePopover() when Popup.Content unmounts', () => {
		const { unmount } = render(
			<Popup placement={{ edge: 'end' }} onClose={() => {}}>
				<Popup.Trigger>
					<button type="button">Trigger</button>
				</Popup.Trigger>
				<Popup.Content role="dialog" label="Test popover" isOpen={true} testId="popover">
					Content
				</Popup.Content>
			</Popup>,
		);

		const popoverEl = getPopoverElement();
		expect(popoverEl).toHaveAttribute('data-popover-open');

		unmount();

		expect(popoverEl).not.toHaveAttribute('data-popover-open');
	});
});

describe('Popup.Trigger', () => {
	it('opens popover when trigger is clicked and popup is closed', () => {
		render(
			<Popup placement={{ edge: 'end' }} onClose={() => {}}>
				<Popup.Trigger>
					<button type="button">Trigger</button>
				</Popup.Trigger>
				<Popup.Content role="dialog" label="Test" testId="popover">
					Content
				</Popup.Content>
			</Popup>,
		);

		const popoverEl = getPopoverElement();
		expect(popoverEl).not.toHaveAttribute('data-popover-open');

		const button = screen.getByRole('button', { name: 'Trigger' });
		act(() => {
			button.click();
		});

		expect(popoverEl).toHaveAttribute('data-popover-open');
	});

	it('preserves original onClick handler on the child', () => {
		const onClick = jest.fn();

		render(
			<Popup placement={{ edge: 'end' }} onClose={() => {}}>
				<Popup.Trigger>
					<button type="button" onClick={onClick}>
						Trigger
					</button>
				</Popup.Trigger>
				<Popup.Content role="dialog" label="Test" testId="popover">
					Content
				</Popup.Content>
			</Popup>,
		);

		const button = screen.getByRole('button', { name: 'Trigger' });
		act(() => {
			button.click();
		});

		expect(onClick).toHaveBeenCalledTimes(1);
	});
});

describe('Popup.Content isOpen prop', () => {
	it('opens popover when isOpen transitions to true', () => {
		const { rerender } = render(
			<Popup placement={{ edge: 'end' }} onClose={() => {}}>
				<Popup.Trigger>
					<button type="button">Trigger</button>
				</Popup.Trigger>
				<Popup.Content role="dialog" label="Test" isOpen={false} testId="popover">
					Content
				</Popup.Content>
			</Popup>,
		);

		const popoverEl = getPopoverElement();
		expect(popoverEl).not.toHaveAttribute('data-popover-open');

		rerender(
			<Popup placement={{ edge: 'end' }} onClose={() => {}}>
				<Popup.Trigger>
					<button type="button">Trigger</button>
				</Popup.Trigger>
				<Popup.Content role="dialog" label="Test" isOpen={true} testId="popover">
					Content
				</Popup.Content>
			</Popup>,
		);

		expect(popoverEl).toHaveAttribute('data-popover-open');
	});

	it('closes popover when isOpen transitions to false', () => {
		const { rerender } = render(
			<Popup placement={{ edge: 'end' }} onClose={() => {}}>
				<Popup.Trigger>
					<button type="button">Trigger</button>
				</Popup.Trigger>
				<Popup.Content role="dialog" label="Test" isOpen={true} testId="popover">
					Content
				</Popup.Content>
			</Popup>,
		);

		const popoverEl = getPopoverElement();
		expect(popoverEl).toHaveAttribute('data-popover-open');

		rerender(
			<Popup placement={{ edge: 'end' }} onClose={() => {}}>
				<Popup.Trigger>
					<button type="button">Trigger</button>
				</Popup.Trigger>
				<Popup.Content role="dialog" label="Test" isOpen={false} testId="popover">
					Content
				</Popup.Content>
			</Popup>,
		);

		expect(popoverEl).not.toHaveAttribute('data-popover-open');
	});

	it('does not open popover on mount when isOpen is false', () => {
		render(
			<Popup placement={{ edge: 'end' }} onClose={() => {}}>
				<Popup.Trigger>
					<button type="button">Trigger</button>
				</Popup.Trigger>
				<Popup.Content role="dialog" label="Test" isOpen={false} testId="popover">
					Content
				</Popup.Content>
			</Popup>,
		);

		const popoverEl = getPopoverElement();
		expect(popoverEl).not.toHaveAttribute('data-popover-open');
	});

	it('opens popover on mount when isOpen is true', () => {
		render(
			<Popup placement={{ edge: 'end' }} onClose={() => {}}>
				<Popup.Trigger>
					<button type="button">Trigger</button>
				</Popup.Trigger>
				<Popup.Content role="dialog" label="Test" isOpen={true} testId="popover">
					Content
				</Popup.Content>
			</Popup>,
		);

		const popoverEl = getPopoverElement();
		expect(popoverEl).toHaveAttribute('data-popover-open');
	});
});
