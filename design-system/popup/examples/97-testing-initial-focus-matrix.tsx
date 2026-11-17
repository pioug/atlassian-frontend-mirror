import React, {
	type Dispatch,
	type SetStateAction,
	useCallback,
	useEffect,
	useRef,
	useState,
} from 'react';

import Button from '@atlaskit/button/default/button';
import { Popup as ComposablePopup } from '@atlaskit/popup/compositional/popup';
import { PopupContent } from '@atlaskit/popup/compositional/popup-content';
import { PopupTrigger } from '@atlaskit/popup/compositional/popup-trigger';
import { Popup } from '@atlaskit/popup/popup';
import Textfield from '@atlaskit/textfield/text-field';

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
 * - `autofocus-dialog-popup`: a button trigger opens a `role="dialog"` popup
 *   that contains an `<input>` carrying the native HTML `autofocus`
 *   attribute. The first focusable in the popup is a button, but
 *   `getInitialFocusTarget` must prefer the `[autofocus]` element for the
 *   `dialog` role.
 *   Expectation: focus lands on the autofocus input, not the first button.
 *
 * - `selected-option-listbox-popup`: a button trigger opens a
 *   `role="listbox"` popup that contains two options where the second is
 *   `aria-selected="true"`. `getInitialFocusTarget` must prefer the
 *   selected option over the first option for the `listbox` role.
 *   Expectation: focus lands on the selected (second) option.
 *
 * - `auto-focus-disabled-popup`: a button trigger opens a `role="dialog"`
 *   popup configured with the `Popup` `autoFocus={false}` prop. On the
 *   top-layer path, `autoFocus` has no effect and the role decides.
 *   Expectation: focus lands on the first button.
 *
 * - `set-initial-focus-ref-popup`: a button trigger opens a `role="dialog"`
 *   popup whose content render prop wires `setInitialFocusRef` to the
 *   second button. The first button is the natural first focusable.
 *   Expectation: focus lands on the consumer-chosen second button, not
 *   the first focusable.
 *
 * Focus timing scenarios. The content loads a moment after the open, as an entry point does. The
 * popup moves focus only as it opens (see `@atlaskit/top-layer`
 * `notes/decisions/react-autofocus-and-focus-on-open.md`):
 *
 * - `late-target-popup`: a `setInitialFocusRef` target that mounts after the open. Top layer: focus
 *   stays on the first button. Legacy: the target takes focus.
 * - `effect-target-popup`: a target that the content sets in a `useEffect`. Focus stays on the first
 *   button.
 * - `disabled-initial-focus-popup`: `UNSAFE__disableInitialAutoFocus`, and content that focuses its
 *   own input once it loads. The open moves no focus, then the input takes it.
 * - `popup-content-late-target`: as `late-target-popup`, through `PopupContent`.
 *
 * See: `platform/packages/design-system/top-layer/notes/architecture/focus.md`.
 */

// Long enough for a test to check focus after the open, before the content loads.
const lateContentDelay = 500;

// `true` a moment after the content mounts, as when an entry point loads.
function useIsLoaded(): boolean {
	const [isLoaded, setIsLoaded] = useState(false);
	useEffect(() => {
		const timeoutId = setTimeout(() => setIsLoaded(true), lateContentDelay);
		return () => clearTimeout(timeoutId);
	}, []);
	return isLoaded;
}

function LateTargetContent({
	testId,
	setInitialFocusRef,
}: {
	testId: string;
	setInitialFocusRef: Dispatch<SetStateAction<HTMLElement | null>>;
}) {
	const isLoaded = useIsLoaded();
	return (
		<div data-testid={`${testId}-content`}>
			<Button testId={`${testId}-first-button`} onClick={() => {}}>
				First action
			</Button>
			{isLoaded && (
				<input
					aria-label="Late target"
					data-testid={`${testId}-target`}
					ref={setInitialFocusRef}
					type="text"
				/>
			)}
		</div>
	);
}

function EffectTargetContent({
	setInitialFocusRef,
}: {
	setInitialFocusRef: Dispatch<SetStateAction<HTMLElement | null>>;
}) {
	const ref = useRef<HTMLInputElement>(null);
	const [isTargetSet, setIsTargetSet] = useState(false);
	useEffect(() => {
		setInitialFocusRef(ref.current);
		setIsTargetSet(true);
	}, [setInitialFocusRef]);
	return (
		<div data-testid="effect-target-popup-content" data-is-target-set={isTargetSet}>
			<Button testId="effect-target-popup-first-button" onClick={() => {}}>
				First action
			</Button>
			<input
				aria-label="Effect target"
				data-testid="effect-target-popup-target"
				ref={ref}
				type="text"
			/>
		</div>
	);
}

function SelfFocusingInput() {
	const ref = useRef<HTMLInputElement>(null);
	useEffect(() => {
		ref.current?.focus();
	}, []);
	return (
		<input
			aria-label="Self focusing"
			data-testid="disabled-initial-focus-popup-target"
			ref={ref}
			type="text"
		/>
	);
}

function SelfFocusingContent() {
	const isLoaded = useIsLoaded();
	return (
		<div data-testid="disabled-initial-focus-popup-content">
			<Button testId="disabled-initial-focus-popup-first-button" onClick={() => {}}>
				First action
			</Button>
			{isLoaded && <SelfFocusingInput />}
		</div>
	);
}

function PopupContentLateTarget() {
	const [isOpen, setIsOpen] = useState(false);
	return (
		<ComposablePopup isOpen={isOpen}>
			<PopupTrigger>
				{(triggerProps) => (
					<Button
						{...triggerProps}
						testId="popup-content-late-target-trigger"
						onClick={() => setIsOpen((previous) => !previous)}
					>
						Open PopupContent with a late target
					</Button>
				)}
			</PopupTrigger>
			<PopupContent
				role="dialog"
				label="PopupContent with a late target"
				onClose={() => setIsOpen(false)}
				placement="bottom-start"
				shouldRenderToParent
			>
				{({ setInitialFocusRef }) => (
					<LateTargetContent
						testId="popup-content-late-target"
						setInitialFocusRef={setInitialFocusRef}
					/>
				)}
			</PopupContent>
		</ComposablePopup>
	);
}

export default function TestingInitialFocusMatrix(): React.ReactNode {
	const [openDialogPopup, setOpenDialogPopup] = useState(false);
	const [openNoRolePopup, setOpenNoRolePopup] = useState(false);
	const [openComboboxControls, setOpenComboboxControls] = useState(false);
	const [openUnrelatedComboboxPopup, setOpenUnrelatedComboboxPopup] = useState(false);
	const [openExternalComboboxPopup, setOpenExternalComboboxPopup] = useState(false);
	const [openAutofocusDialogPopup, setOpenAutofocusDialogPopup] = useState(false);
	const [openSelectedOptionListboxPopup, setOpenSelectedOptionListboxPopup] = useState(false);
	const [openAutoFocusDisabledPopup, setOpenAutoFocusDisabledPopup] = useState(false);
	const [openSetInitialFocusRefPopup, setOpenSetInitialFocusRefPopup] = useState(false);
	const [openLateTargetPopup, setOpenLateTargetPopup] = useState(false);
	const [openEffectTargetPopup, setOpenEffectTargetPopup] = useState(false);
	const [openDisabledInitialFocusPopup, setOpenDisabledInitialFocusPopup] = useState(false);

	// React 18 does not reflect the JSX `autoFocus` prop as the HTML
	// `autofocus` attribute. `getInitialFocusTarget` queries `[autofocus]`
	// against the DOM, so set the attribute imperatively via a ref callback.
	const setNativeAutofocus = useCallback((node: HTMLInputElement | null) => {
		if (node === null) {
			return;
		}
		node.setAttribute('autofocus', '');
	}, []);

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
					shouldRenderToParent
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
					shouldRenderToParent
				/>
			</section>

			<section>
				<h3>combobox controls listbox popup</h3>
				<Popup
					isOpen={openComboboxControls}
					onClose={() => setOpenComboboxControls(false)}
					role="listbox"
					label="Combobox controls listbox"
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
					shouldRenderToParent
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
					label="Unrelated combobox listbox"
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
					shouldRenderToParent
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
					label="External combobox listbox"
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
					shouldRenderToParent
				/>
			</section>

			<section>
				<h3>dialog popup with native [autofocus] element</h3>
				<Popup
					isOpen={openAutofocusDialogPopup}
					onClose={() => setOpenAutofocusDialogPopup(false)}
					role="dialog"
					id="initial-focus-autofocus-dialog-popup"
					placement="bottom-start"
					content={() => (
						<div data-testid="autofocus-dialog-popup-content">
							<Button testId="autofocus-dialog-popup-first-button" onClick={() => {}}>
								First action
							</Button>
							<label htmlFor="autofocus-dialog-popup-input">Name</label>
							<input
								id="autofocus-dialog-popup-input"
								data-testid="autofocus-dialog-popup-input"
								ref={setNativeAutofocus}
								type="text"
							/>
						</div>
					)}
					trigger={(triggerProps) => (
						<Button
							{...triggerProps}
							testId="autofocus-dialog-popup-trigger"
							onClick={() => setOpenAutofocusDialogPopup((prev) => !prev)}
						>
							Open autofocus dialog popup
						</Button>
					)}
					shouldRenderToParent
				/>
			</section>

			<section>
				<h3>listbox popup with aria-selected option</h3>
				<Popup
					isOpen={openSelectedOptionListboxPopup}
					onClose={() => setOpenSelectedOptionListboxPopup(false)}
					role="listbox"
					label="Selected-option listbox example"
					id="initial-focus-selected-option-listbox-popup"
					placement="bottom-start"
					content={() => (
						<div data-testid="selected-option-listbox-popup-content">
							<div
								role="option"
								aria-selected={false}
								tabIndex={-1}
								data-testid="selected-option-listbox-option-1"
							>
								Option 1
							</div>
							<div
								role="option"
								aria-selected={true}
								tabIndex={-1}
								data-testid="selected-option-listbox-option-2"
							>
								Option 2 (selected)
							</div>
						</div>
					)}
					trigger={(triggerProps) => (
						<Button
							{...triggerProps}
							testId="selected-option-listbox-popup-trigger"
							onClick={() => setOpenSelectedOptionListboxPopup((prev) => !prev)}
						>
							Open selected-option listbox popup
						</Button>
					)}
					shouldRenderToParent
				/>
			</section>

			<section>
				<h3>dialog popup with autoFocus disabled</h3>
				<Popup
					isOpen={openAutoFocusDisabledPopup}
					onClose={() => setOpenAutoFocusDisabledPopup(false)}
					role="dialog"
					id="initial-focus-auto-focus-disabled-popup"
					autoFocus={false}
					placement="bottom-start"
					content={() => (
						<div data-testid="auto-focus-disabled-popup-content">
							<Button testId="auto-focus-disabled-popup-first-button" onClick={() => {}}>
								First action
							</Button>
						</div>
					)}
					trigger={(triggerProps) => (
						<Button
							{...triggerProps}
							testId="auto-focus-disabled-popup-trigger"
							onClick={() => setOpenAutoFocusDisabledPopup((prev) => !prev)}
						>
							Open autoFocus-disabled popup
						</Button>
					)}
					shouldRenderToParent
				/>
			</section>

			<section>
				<h3>dialog popup with consumer-provided setInitialFocusRef</h3>
				<Popup
					isOpen={openSetInitialFocusRefPopup}
					onClose={() => setOpenSetInitialFocusRefPopup(false)}
					role="dialog"
					id="initial-focus-set-initial-focus-ref-popup"
					placement="bottom-start"
					content={({ setInitialFocusRef }) => (
						<div data-testid="set-initial-focus-ref-popup-content">
							<Button testId="set-initial-focus-ref-popup-first-button" onClick={() => {}}>
								First action
							</Button>
							<Button
								testId="set-initial-focus-ref-popup-second-button"
								ref={(node) => {
									// Pointing `setInitialFocusRef` at this button tells
									// the popup to focus it on open instead of the first
									// focusable.
									setInitialFocusRef(node);
								}}
								onClick={() => {}}
							>
								Second action
							</Button>
						</div>
					)}
					trigger={(triggerProps) => (
						<Button
							{...triggerProps}
							testId="set-initial-focus-ref-popup-trigger"
							onClick={() => setOpenSetInitialFocusRefPopup((prev) => !prev)}
						>
							Open setInitialFocusRef popup
						</Button>
					)}
					shouldRenderToParent
				/>
			</section>

			<section>
				<h3>dialog popup with a setInitialFocusRef target that mounts after the open</h3>
				<Popup
					isOpen={openLateTargetPopup}
					onClose={() => setOpenLateTargetPopup(false)}
					role="dialog"
					label="Late target"
					id="initial-focus-late-target-popup"
					placement="bottom-start"
					content={({ setInitialFocusRef }) => (
						<LateTargetContent testId="late-target-popup" setInitialFocusRef={setInitialFocusRef} />
					)}
					trigger={(triggerProps) => (
						<Button
							{...triggerProps}
							testId="late-target-popup-trigger"
							onClick={() => setOpenLateTargetPopup((previous) => !previous)}
						>
							Open late target popup
						</Button>
					)}
					shouldRenderToParent
				/>
			</section>

			<section>
				<h3>dialog popup with a target set in a useEffect</h3>
				<Popup
					isOpen={openEffectTargetPopup}
					onClose={() => setOpenEffectTargetPopup(false)}
					role="dialog"
					label="Effect target"
					id="initial-focus-effect-target-popup"
					placement="bottom-start"
					content={({ setInitialFocusRef }) => (
						<EffectTargetContent setInitialFocusRef={setInitialFocusRef} />
					)}
					trigger={(triggerProps) => (
						<Button
							{...triggerProps}
							testId="effect-target-popup-trigger"
							onClick={() => setOpenEffectTargetPopup((previous) => !previous)}
						>
							Open effect target popup
						</Button>
					)}
					shouldRenderToParent
				/>
			</section>

			<section>
				<h3>dialog popup with UNSAFE__disableInitialAutoFocus and content that focuses later</h3>
				<Popup
					isOpen={openDisabledInitialFocusPopup}
					onClose={() => setOpenDisabledInitialFocusPopup(false)}
					role="dialog"
					label="Disabled initial focus"
					id="initial-focus-disabled-initial-focus-popup"
					placement="bottom-start"
					UNSAFE__disableInitialAutoFocus
					content={() => <SelfFocusingContent />}
					trigger={(triggerProps) => (
						<Button
							{...triggerProps}
							testId="disabled-initial-focus-popup-trigger"
							onClick={() => setOpenDisabledInitialFocusPopup((previous) => !previous)}
						>
							Open disabled initial focus popup
						</Button>
					)}
					shouldRenderToParent
				/>
			</section>

			<section>
				<h3>PopupContent with a setInitialFocusRef target that mounts after the open</h3>
				<PopupContentLateTarget />
			</section>
		</div>
	);
}
