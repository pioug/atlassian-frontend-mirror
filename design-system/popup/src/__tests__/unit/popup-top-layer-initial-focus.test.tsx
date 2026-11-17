import React from 'react';

import Select from '@atlaskit/select/default';
import Textfield from '@atlaskit/textfield/text-field';
import { passGate } from '@atlassian/feature-flags-test-utils/mock-gates';
import { screen } from '@atlassian/testing-library/screen';
import { act, render } from '@atlassian/testing-library/testing-library/react';

import { Popup } from '../../popup';
import { type DialogContentProps, type PopupProps, type TriggerProps } from '../../types';

/**
 * Smoke tests: the focus patterns that consumers check in their own jsdom tests work with the top
 * layer. The popover shows before its content effects run (`autoFocus`, ref callbacks, layout
 * effects), so a content `focus()` call works. The focus timing tests run in a browser
 * (`__tests__/playwright/top-layer-focus.spec.tsx`). See `@atlaskit/top-layer`
 * `notes/decisions/react-autofocus-and-focus-on-open.md`.
 */

/**
 * Waits for the work that the open or close starts after the commit: the popover's animation
 * settles in a promise microtask (jsdom has no animations).
 */
async function flushAsyncWork() {
	await act(async () => {
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

function RolelessPopup({ isOpen, content }: { isOpen: boolean; content: PopupProps['content'] }) {
	return <Popup isOpen={isOpen} onClose={jest.fn()} trigger={trigger} content={content} />;
}

function DialogPopup({
	isOpen,
	content,
}: {
	isOpen: boolean;
	content: (props: DialogContentProps) => React.ReactNode;
}) {
	return (
		<Popup
			isOpen={isOpen}
			onClose={jest.fn()}
			role="dialog"
			label="Card"
			trigger={trigger}
			content={content}
		/>
	);
}

/**
 * Renders the popup closed, focuses the trigger, then opens it, as a press on the trigger does.
 */
async function renderOpened(renderPopup: (isOpen: boolean) => React.ReactElement) {
	const view = render(renderPopup(false));
	act(() => {
		screen.getByRole('button', { name: 'Trigger' }).focus();
	});
	view.rerender(renderPopup(true));
	await flushAsyncWork();
	return view;
}

describe('Popup top-layer: `autoFocus` inside the content', () => {
	beforeEach(() => {
		passGate('platform-dst-top-layer');
	});

	it('should be accessible with an `autoFocus` field in an open popup', async () => {
		await renderOpened((isOpen) => (
			<DialogPopup isOpen={isOpen} content={() => <Textfield aria-label="Search" autoFocus />} />
		));

		await expect(document.body).toBeAccessible();
	});

	it('should focus a Textfield with `autoFocus` in a popup with no role', async () => {
		await renderOpened((isOpen) => (
			<RolelessPopup isOpen={isOpen} content={() => <Textfield aria-label="Search" autoFocus />} />
		));

		expect(screen.getByRole('textbox', { name: 'Search' })).toHaveFocus();
	});

	it('should focus a Textfield with `autoFocus` in a dialog popup, not its first focusable element', async () => {
		await renderOpened((isOpen) => (
			<DialogPopup
				isOpen={isOpen}
				content={() => (
					<div>
						<button type="button">Close</button>
						<Textfield aria-label="Search" autoFocus />
					</div>
				)}
			/>
		));

		expect(screen.getByRole('textbox', { name: 'Search' })).toHaveFocus();
	});

	it('should focus a Select with `autoFocus` in a popup with no role', async () => {
		await renderOpened((isOpen) => (
			<RolelessPopup
				isOpen={isOpen}
				content={() => (
					<Select
						inputId="project"
						aria-label="Project"
						autoFocus
						options={[{ label: 'One', value: 'one' }]}
					/>
				)}
			/>
		));

		expect(screen.getByRole('combobox', { name: 'Project' })).toHaveFocus();
	});

	it('should focus an element that a ref callback hands to `setInitialFocusRef`', async () => {
		await renderOpened((isOpen) => (
			<DialogPopup
				isOpen={isOpen}
				content={({ setInitialFocusRef }) => (
					<div>
						<button type="button">Close</button>
						<input aria-label="Raw" ref={setInitialFocusRef} />
					</div>
				)}
			/>
		));

		expect(screen.getByRole('textbox', { name: 'Raw' })).toHaveFocus();
	});

	it('should honour an imperative `focus()` in a ref callback during the open', async () => {
		const focusOnMount = (element: HTMLInputElement | null) => {
			element?.focus();
		};
		await renderOpened((isOpen) => (
			<RolelessPopup
				isOpen={isOpen}
				content={() => <input aria-label="Raw" ref={focusOnMount} />}
			/>
		));

		expect(screen.getByRole('textbox', { name: 'Raw' })).toHaveFocus();
	});
});
