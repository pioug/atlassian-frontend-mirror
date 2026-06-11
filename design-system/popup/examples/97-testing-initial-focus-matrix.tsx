import React, { useState } from 'react';

import Button from '@atlaskit/button/new';
import Popup from '@atlaskit/popup';
import Textfield from '@atlaskit/textfield';

/**
 * Test fixture: exercises the initial-focus matrix that `top-layer/useInitialFocus`
 * is responsible for, expressed through the public `Popup` API.
 *
 * Each scenario has its own trigger so a test can open one in isolation and
 * assert which element receives focus.
 *
 * Scenarios:
 *
 * - `dialog-popup`: button trigger, popup with `role="dialog"`.
 *   Expectation: focus moves to the first focusable inside the popup.
 *
 * - `no-role-popup`: button trigger, popup with no `role`.
 *   Expectation: focus stays on the trigger button (no popup role means
 *   no focus management).
 *
 * - `combobox-controls-popup`: combobox `<input>` trigger whose `aria-controls`
 *   matches a `role="listbox"` popup.
 *   Expectation: focus stays on the combobox input.
 *
 * - `unrelated-combobox`: a `role="combobox"` input lives elsewhere on the
 *   page and is focused, but the popup is opened from a separate button and
 *   the combobox does not control it.
 *   Expectation: focus moves into the popup's first option.
 *
 * - `external-combobox-controls`: a `role="combobox"` input lives OUTSIDE
 *   the popup element (as in `react-select`-style menus that portal the
 *   menu separately from the textbox) and its `aria-controls` references
 *   the popup id.
 *   Expectation: focus stays on the external combobox input (focus is
 *   not moved into the listbox).
 *
 * See: `platform/packages/design-system/top-layer/notes/architecture/focus.md`.
 */
export default function TestingInitialFocusMatrix(): React.ReactNode {
	const [openDialogPopup, setOpenDialogPopup] = useState(false);
	const [openNoRolePopup, setOpenNoRolePopup] = useState(false);
	const [openComboboxControls, setOpenComboboxControls] = useState(false);
	const [openUnrelatedComboboxPopup, setOpenUnrelatedComboboxPopup] = useState(false);
	const [openExternalComboboxPopup, setOpenExternalComboboxPopup] = useState(false);

	return (
		<div>
			<section>
				<h3>dialog popup</h3>
				<Popup
					isOpen={openDialogPopup}
					onClose={() => setOpenDialogPopup(false)}
					role="dialog"
					id="initial-focus-dialog-popup"
					placement="bottom-start"
					content={() => (
						<div data-testid="dialog-popup-content">
							<Button testId="dialog-popup-first-button" onClick={() => {}}>
								First action
							</Button>
							<Button testId="dialog-popup-second-button" onClick={() => {}}>
								Second action
							</Button>
						</div>
					)}
					trigger={(triggerProps) => (
						<Button
							{...triggerProps}
							testId="dialog-popup-trigger"
							onClick={() => setOpenDialogPopup((prev) => !prev)}
						>
							Open dialog popup
						</Button>
					)}
				/>
			</section>

			<section>
				<h3>no-role popup</h3>
				<Popup
					isOpen={openNoRolePopup}
					onClose={() => setOpenNoRolePopup(false)}
					id="initial-focus-no-role-popup"
					placement="bottom-start"
					content={() => (
						<div data-testid="no-role-popup-content">
							<Button testId="no-role-popup-first-button" onClick={() => {}}>
								First action
							</Button>
						</div>
					)}
					trigger={(triggerProps) => (
						<Button
							{...triggerProps}
							testId="no-role-popup-trigger"
							onClick={() => setOpenNoRolePopup((prev) => !prev)}
						>
							Open no-role popup
						</Button>
					)}
				/>
			</section>

			<section>
				<h3>combobox controls listbox popup</h3>
				<Popup
					isOpen={openComboboxControls}
					onClose={() => setOpenComboboxControls(false)}
					role="listbox"
					id="initial-focus-combobox-listbox"
					placement="bottom-start"
					content={() => (
						<div data-testid="combobox-controls-popup-content">
							<div
								role="option"
								aria-selected={false}
								tabIndex={-1}
								data-testid="combobox-controls-option-1"
							>
								Option 1
							</div>
							<div
								role="option"
								aria-selected={false}
								tabIndex={-1}
								data-testid="combobox-controls-option-2"
							>
								Option 2
							</div>
						</div>
					)}
					trigger={(triggerProps) => (
						<Textfield
							{...triggerProps}
							role="combobox"
							aria-autocomplete="list"
							aria-controls="initial-focus-combobox-listbox"
							aria-expanded={openComboboxControls}
							aria-label="Combobox controls popup"
							testId="combobox-controls-input"
							onFocus={() => setOpenComboboxControls(true)}
						/>
					)}
				/>
			</section>

			<section>
				<h3>unrelated combobox + listbox popup</h3>
				{/*
				 * Unrelated combobox: its aria-controls deliberately points at a
				 * sibling element (not the popup below) so the carve-out in
				 * top-layer/useInitialFocus does not apply. aria-expanded is
				 * always false because this combobox is not the one opening the
				 * popup.
				 */}
				<div id="unrelated-combobox-results" hidden />
				<Textfield
					role="combobox"
					aria-autocomplete="list"
					aria-controls="unrelated-combobox-results"
					aria-expanded={false}
					aria-label="Unrelated combobox"
					testId="unrelated-combobox-input"
				/>
				<Popup
					isOpen={openUnrelatedComboboxPopup}
					onClose={() => setOpenUnrelatedComboboxPopup(false)}
					role="listbox"
					id="initial-focus-unrelated-combobox-listbox"
					placement="bottom-start"
					content={() => (
						<div data-testid="unrelated-combobox-popup-content">
							<div
								role="option"
								aria-selected={false}
								tabIndex={-1}
								data-testid="unrelated-combobox-option-1"
							>
								Option A
							</div>
							<div
								role="option"
								aria-selected={false}
								tabIndex={-1}
								data-testid="unrelated-combobox-option-2"
							>
								Option B
							</div>
						</div>
					)}
					trigger={(triggerProps) => (
						<Button
							{...triggerProps}
							testId="unrelated-combobox-popup-trigger"
							onClick={() => setOpenUnrelatedComboboxPopup((prev) => !prev)}
						>
							Open listbox popup
						</Button>
					)}
				/>
			</section>

			<section>
				<h3>external combobox controls listbox popup (react-select pattern)</h3>
				{/*
				 * External combobox: the combobox `<input>` is rendered OUTSIDE
				 * the popup element. Its `aria-controls` references the popup
				 * id, mirroring how libraries like react-select wire up a
				 * portaled menu. Initial focus must stay on the external
				 * combobox; the listbox surfaces the active option via
				 * `aria-activedescendant` (not modelled here).
				 */}
				<Textfield
					role="combobox"
					aria-autocomplete="list"
					aria-controls="initial-focus-external-combobox-listbox"
					aria-expanded={openExternalComboboxPopup}
					aria-label="External combobox controls popup"
					testId="external-combobox-input"
					onFocus={() => setOpenExternalComboboxPopup(true)}
				/>
				<Popup
					isOpen={openExternalComboboxPopup}
					onClose={() => setOpenExternalComboboxPopup(false)}
					role="listbox"
					id="initial-focus-external-combobox-listbox"
					placement="bottom-start"
					content={() => (
						<div data-testid="external-combobox-popup-content">
							<div
								role="option"
								aria-selected={false}
								tabIndex={-1}
								data-testid="external-combobox-option-1"
							>
								Option 1
							</div>
							<div
								role="option"
								aria-selected={false}
								tabIndex={-1}
								data-testid="external-combobox-option-2"
							>
								Option 2
							</div>
						</div>
					)}
					trigger={(triggerProps) => (
						// The real combobox is the external Textfield above. This span is only a
						// positioning anchor for the popup, so hide it from assistive tech to avoid
						// axe flagging the inherited aria-expanded/aria-haspopup on a generic element.
						<span
							{...triggerProps}
							aria-hidden="true"
							data-testid="external-combobox-popup-anchor"
						/>
					)}
				/>
			</section>
		</div>
	);
}
