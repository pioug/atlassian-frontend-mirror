/* eslint-disable testing-library/no-node-access */

import React, { type Dispatch, type SetStateAction } from 'react';

import { bind } from 'bind-event-listener';
import { replaceRaf } from 'raf-stub';

import { ffTest } from '@atlassian/feature-flags-test-utils/test-runner';
import { screen } from '@atlassian/testing-library/screen';
import { act, render } from '@atlassian/testing-library/testing-library/react';
import { userEvent } from '@atlassian/testing-library/user-event';

import { Popup as ComposablePopup } from '../../compositional/popup';
import { PopupContent } from '../../compositional/popup-content';
import { PopupTrigger } from '../../compositional/popup-trigger';
import { Popup } from '../../popup';
import {
	type DialogContentProps,
	type DialogPopupProps,
	type PopupComponentProps,
	type TriggerProps,
} from '../../types';

// The legacy path moves focus in an animation frame. Step it by hand.
replaceRaf();

// Let the open settle: the legacy path's focus work, which runs in an
// animation frame, and the native `toggle` event.
async function settle() {
	await act(async () => {
		(requestAnimationFrame as unknown as { step: () => void }).step();
		// `focus-trap` applies its initial focus in a `setTimeout(…, 0)`.
		await new Promise((resolve) => setTimeout(resolve, 0));
	});
}

const trigger = ({
	ref,
	'aria-controls': ariaControls,
	'aria-expanded': ariaExpanded,
	'aria-haspopup': ariaHasPopup,
}: TriggerProps) => (
	<button
		type="button"
		ref={ref}
		aria-controls={ariaControls}
		aria-expanded={ariaExpanded}
		aria-haspopup={ariaHasPopup}
	>
		Trigger
	</button>
);

const contentWithButton = () => (
	<div>
		<button type="button">Inside</button>
	</div>
);

function ClassicPopup({
	isOpen,
	autoFocus,
	content = contentWithButton,
	popupRole,
	label = 'Card',
}: {
	isOpen: boolean;
	autoFocus?: boolean;
	content?: DialogPopupProps['content'];
	popupRole?: string;
	label?: string;
}) {
	return (
		<>
			<input aria-label="Outside" />
			{/* `content` may read the setter, so only the dialog role gets it. */}
			{popupRole === 'dialog' ? (
				<Popup
					isOpen={isOpen}
					trigger={trigger}
					content={content}
					role={popupRole}
					label={label}
					autoFocus={autoFocus}
				/>
			) : (
				<Popup
					isOpen={isOpen}
					trigger={trigger}
					content={contentWithButton}
					role={popupRole}
					label={popupRole ? label : undefined}
					autoFocus={autoFocus}
				/>
			)}
		</>
	);
}

function CompositionalPopup({
	isOpen,
	autoFocus,
	popupRole,
}: {
	isOpen: boolean;
	autoFocus?: boolean;
	popupRole?: 'dialog';
}) {
	return (
		<>
			<input aria-label="Outside" />
			<ComposablePopup isOpen={isOpen}>
				<PopupTrigger>
					{(triggerProps) => (
						<button type="button" {...triggerProps}>
							Trigger
						</button>
					)}
				</PopupTrigger>
				<PopupContent role={popupRole} label={popupRole ? 'Card' : undefined} autoFocus={autoFocus}>
					{contentWithButton}
				</PopupContent>
			</ComposablePopup>
		</>
	);
}

// With no role, the legacy path (flag off) and the top-layer path agree:
// `autoFocus={false}` keeps focus where it was.
// eslint-disable-next-line @atlassian/a11y/require-jest-coverage
ffTest.both('platform-dst-top-layer', 'Popup: autoFocus={false} without a role', () => {
	it('keeps focus on the trigger when the popup opens', async () => {
		const { rerender } = render(<ClassicPopup isOpen={false} autoFocus={false} />);
		screen.getByRole('button', { name: 'Trigger' }).focus();

		rerender(<ClassicPopup isOpen autoFocus={false} />);
		await settle();

		expect(screen.getByRole('button', { name: 'Trigger' })).toHaveFocus();
		expect(screen.getByRole('button', { name: 'Inside' })).not.toHaveFocus();
	});

	it('keeps focus on an element outside the popup when the popup opens', async () => {
		const { rerender } = render(<ClassicPopup isOpen={false} autoFocus={false} />);
		screen.getByRole('textbox', { name: 'Outside' }).focus();

		rerender(<ClassicPopup isOpen autoFocus={false} />);
		await settle();

		expect(screen.getByRole('textbox', { name: 'Outside' })).toHaveFocus();
	});

	it('does not focus the trigger when nothing had focus', async () => {
		const { rerender } = render(<ClassicPopup isOpen={false} autoFocus={false} />);

		rerender(<ClassicPopup isOpen autoFocus={false} />);
		await settle();

		expect(screen.getByRole('button', { name: 'Trigger' })).not.toHaveFocus();
		expect(screen.getByRole('button', { name: 'Inside' })).not.toHaveFocus();
	});

	it('still focuses the setInitialFocusRef target', async () => {
		const content = ({ setInitialFocusRef }: DialogContentProps) => (
			<div>
				<button type="button">Inside</button>
				<button
					type="button"
					ref={setInitialFocusRef as Dispatch<SetStateAction<HTMLElement | null>>}
				>
					Target
				</button>
			</div>
		);
		const { rerender } = render(
			<ClassicPopup isOpen={false} autoFocus={false} content={content} popupRole="dialog" />,
		);
		screen.getByRole('button', { name: 'Trigger' }).focus();

		rerender(<ClassicPopup isOpen autoFocus={false} content={content} popupRole="dialog" />);
		await settle();

		expect(screen.getByRole('button', { name: 'Target' })).toHaveFocus();
	});

	it('keeps focus with a role that does not move focus', async () => {
		const { rerender } = render(<ClassicPopup isOpen={false} autoFocus={false} popupRole="note" />);
		screen.getByRole('button', { name: 'Trigger' }).focus();

		rerender(<ClassicPopup isOpen autoFocus={false} popupRole="note" />);
		await settle();

		expect(screen.getByRole('button', { name: 'Trigger' })).toHaveFocus();
	});

	it('keeps focus on the trigger for the compositional API', async () => {
		const { rerender } = render(<CompositionalPopup isOpen={false} autoFocus={false} />);
		screen.getByRole('button', { name: 'Trigger' }).focus();

		rerender(<CompositionalPopup isOpen autoFocus={false} />);
		await settle();

		expect(screen.getByRole('button', { name: 'Trigger' })).toHaveFocus();
		expect(screen.getByRole('button', { name: 'Inside' })).not.toHaveFocus();
	});

	it('keeps focus outside the popup for the compositional API', async () => {
		const { rerender } = render(<CompositionalPopup isOpen={false} autoFocus={false} />);
		screen.getByRole('textbox', { name: 'Outside' }).focus();

		rerender(<CompositionalPopup isOpen autoFocus={false} />);
		await settle();

		expect(screen.getByRole('textbox', { name: 'Outside' })).toHaveFocus();
	});
});

// eslint-disable-next-line @atlassian/a11y/require-jest-coverage
ffTest.on('platform-dst-top-layer', 'Popup top-layer: no role never moves focus', () => {
	it('does not blur the trigger when the popup opens', async () => {
		const { rerender } = render(<ClassicPopup isOpen={false} autoFocus={false} />);
		const triggerButton = screen.getByRole('button', { name: 'Trigger' });
		triggerButton.focus();
		const onFocusOut = jest.fn();
		const unbind = bind(triggerButton, { type: 'focusout', listener: onFocusOut });

		rerender(<ClassicPopup isOpen autoFocus={false} />);
		await settle();
		unbind();

		expect(onFocusOut).not.toHaveBeenCalled();
		expect(triggerButton).toHaveFocus();
	});

	it('does not blur the trigger when the popup opens (compositional API)', async () => {
		const { rerender } = render(<CompositionalPopup isOpen={false} autoFocus={false} />);
		const triggerButton = screen.getByRole('button', { name: 'Trigger' });
		triggerButton.focus();
		const onFocusOut = jest.fn();
		const unbind = bind(triggerButton, { type: 'focusout', listener: onFocusOut });

		rerender(<CompositionalPopup isOpen autoFocus={false} />);
		await settle();
		unbind();

		expect(onFocusOut).not.toHaveBeenCalled();
		expect(triggerButton).toHaveFocus();
	});

	it('gives a custom popupComponent tabindex="-1" for any autoFocus, which adds no tab stop', async () => {
		const CustomContainer = React.forwardRef<HTMLDivElement, PopupComponentProps>(
			function CustomContainer(
				{ children, shouldFitViewport: _shouldFitViewport, xcss: _xcss, ...props },
				ref,
			) {
				return (
					<div {...props} ref={ref}>
						{children}
					</div>
				);
			},
		);
		const CustomPopup = ({ isOpen, autoFocus }: { isOpen: boolean; autoFocus?: boolean }) => (
			<Popup
				isOpen={isOpen}
				trigger={trigger}
				content={contentWithButton}
				autoFocus={autoFocus}
				popupComponent={CustomContainer}
				testId="popup"
			/>
		);
		const { rerender } = render(<CustomPopup isOpen autoFocus={false} />);
		await settle();
		expect(screen.getByTestId('popup')).toHaveAttribute('tabindex', '-1');

		rerender(<CustomPopup isOpen={false} />);
		rerender(<CustomPopup isOpen />);
		await settle();
		expect(screen.getByTestId('popup')).toHaveAttribute('tabindex', '-1');

		// Tab from the trigger skips the container and reaches its content.
		screen.getByRole('button', { name: 'Trigger' }).focus();
		await userEvent.tab();
		expect(screen.getByRole('button', { name: 'Inside' })).toHaveFocus();
	});

	it('does not move focus with the default autoFocus', async () => {
		const { rerender } = render(<ClassicPopup isOpen={false} />);
		screen.getByRole('button', { name: 'Trigger' }).focus();

		rerender(<ClassicPopup isOpen />);
		await settle();

		expect(screen.getByRole('button', { name: 'Trigger' })).toHaveFocus();
	});
});

// Role and focus go together: `autoFocus` has no effect on the top-layer path.
// eslint-disable-next-line @atlassian/a11y/require-jest-coverage
ffTest.on('platform-dst-top-layer', 'Popup top-layer: focus follows role', () => {
	it('moves focus into a dialog popup', async () => {
		const { rerender } = render(<ClassicPopup isOpen={false} popupRole="dialog" />);
		screen.getByRole('button', { name: 'Trigger' }).focus();

		rerender(<ClassicPopup isOpen popupRole="dialog" />);
		await settle();

		expect(screen.getByRole('button', { name: 'Inside' })).toHaveFocus();
	});

	it('moves focus into a dialog popup with autoFocus={false}', async () => {
		const { rerender } = render(
			<ClassicPopup isOpen={false} autoFocus={false} popupRole="dialog" />,
		);
		screen.getByRole('button', { name: 'Trigger' }).focus();

		rerender(<ClassicPopup isOpen autoFocus={false} popupRole="dialog" />);
		await settle();

		expect(screen.getByRole('button', { name: 'Inside' })).toHaveFocus();
	});

	it('moves focus into a dialog popup for the compositional API', async () => {
		const { rerender } = render(<CompositionalPopup isOpen={false} popupRole="dialog" />);
		screen.getByRole('button', { name: 'Trigger' }).focus();

		rerender(<CompositionalPopup isOpen popupRole="dialog" />);
		await settle();

		expect(screen.getByRole('button', { name: 'Inside' })).toHaveFocus();
	});

	it('moves focus into a dialog popup with autoFocus={false} for the compositional API', async () => {
		const { rerender } = render(
			<CompositionalPopup isOpen={false} autoFocus={false} popupRole="dialog" />,
		);
		screen.getByRole('button', { name: 'Trigger' }).focus();

		rerender(<CompositionalPopup isOpen autoFocus={false} popupRole="dialog" />);
		await settle();

		expect(screen.getByRole('button', { name: 'Inside' })).toHaveFocus();
	});

	it('keeps focus on a combobox trigger that controls a dialog popup', async () => {
		const comboboxTrigger = ({
			ref,
			'aria-controls': ariaControls,
			'aria-expanded': ariaExpanded,
		}: TriggerProps) => (
			<input
				ref={ref}
				role="combobox"
				aria-label="Search"
				aria-controls={ariaControls}
				aria-expanded={ariaExpanded}
				aria-haspopup="dialog"
			/>
		);
		const ComboboxPopup = ({ isOpen }: { isOpen: boolean }) => (
			<Popup
				isOpen={isOpen}
				trigger={comboboxTrigger}
				content={contentWithButton}
				role="dialog"
				label="Results"
				autoFocus={false}
			/>
		);
		const { rerender } = render(<ComboboxPopup isOpen={false} />);
		screen.getByRole('combobox', { name: 'Search' }).focus();

		rerender(<ComboboxPopup isOpen />);
		await settle();

		expect(screen.getByRole('combobox', { name: 'Search' })).toHaveFocus();
		expect(screen.getByRole('button', { name: 'Inside' })).not.toHaveFocus();
	});
});
