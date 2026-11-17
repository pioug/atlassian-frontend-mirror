import React, { useCallback, useEffect, useRef, useState } from 'react';

import Button from '@atlaskit/button/default/button';
import ModalBody from '@atlaskit/modal-dialog/modal-body';
import Modal from '@atlaskit/modal-dialog/modal-dialog';
import ModalFooter from '@atlaskit/modal-dialog/modal-footer';
import ModalHeader from '@atlaskit/modal-dialog/modal-header';
import ModalTitle from '@atlaskit/modal-dialog/modal-title';
import ModalTransition from '@atlaskit/modal-dialog/modal-transition';
import Textfield from '@atlaskit/textfield/text-field';

/**
 * Test fixture: exercises the initial-focus matrix that `top-layer/useInitialFocus`
 * is responsible for, expressed through the public `ModalDialog` API.
 *
 * `ModalDialog` always has `role="dialog"`, so the relevant branches are:
 *
 * - `default-modal`: no element inside the modal carries the native HTML
 *   `autofocus` attribute, so focus must land on the first focusable
 *   element (the close button in the header).
 *
 * - `native-autofocus-modal`: an interior `<input>` carries the native HTML
 *   `autofocus` attribute (set via a ref callback because React 18 does not
 *   reflect the JSX `autoFocus` prop onto the DOM attribute). Focus must
 *   land on that input, not the close button.
 *
 * - `auto-focus-ref-modal`: the `Modal` `autoFocus` prop points at a ref
 *   that resolves to an interior `<input>`. Focus must land on the
 *   ref target on open, even though the close button is the first
 *   focusable in source order.
 *
 * Focus timing scenarios. The modal moves focus only as it opens (see `@atlaskit/top-layer`
 * `notes/decisions/react-autofocus-and-focus-on-open.md`):
 *
 * - `several-autofocus-modal`: two fields with React `autoFocus`. The last one keeps focus.
 * - `late-autofocus-field-modal`: a field with `autoFocus` that mounts when "Load" is pressed. It
 *   takes focus.
 * - `auto-focus-ref-over-field-modal`: an `autoFocus` ref target and a field with `autoFocus`. The
 *   ref target wins, as on the legacy path.
 * - `ref-callback-auto-focus-ref-modal`: a ref callback hands the element to the `autoFocus` ref. It
 *   takes focus.
 * - `late-content-modal`: the content loads a moment after the open. Focus stays on the `<dialog>`.
 * - `late-auto-focus-ref-modal`: the `autoFocus` ref target loads a moment after the open. Focus
 *   stays on the `<dialog>`.
 *
 * See: `platform/packages/design-system/top-layer/notes/architecture/focus.md`.
 */

type TVariant =
	| 'none'
	| 'default'
	| 'native-autofocus'
	| 'auto-focus-ref'
	| 'several-autofocus'
	| 'late-autofocus-field'
	| 'auto-focus-ref-over-field'
	| 'ref-callback-auto-focus-ref'
	| 'late-content'
	| 'late-auto-focus-ref';

// Long enough for a test to check focus after the open, before the content loads.
const lateContentDelay = 500;

// `true` a moment after the modal mounts, as when its content loads.
function useIsLoaded(): boolean {
	const [isLoaded, setIsLoaded] = useState(false);
	useEffect(() => {
		const timeoutId = setTimeout(() => setIsLoaded(true), lateContentDelay);
		return () => clearTimeout(timeoutId);
	}, []);
	return isLoaded;
}

function LateAutofocusFieldModal({ onClose }: { onClose: () => void }) {
	const [isLoaded, setIsLoaded] = useState(false);
	return (
		<Modal onClose={onClose} testId="late-autofocus-field-modal">
			<ModalHeader hasCloseButton>
				<ModalTitle>Modal with a field that mounts later</ModalTitle>
			</ModalHeader>
			<ModalBody>
				{isLoaded ? (
					<Textfield aria-label="Summary" testId="late-autofocus-field" autoFocus />
				) : (
					<Button testId="late-autofocus-field-load" onClick={() => setIsLoaded(true)}>
						Load
					</Button>
				)}
			</ModalBody>
		</Modal>
	);
}

function AutoFocusRefOverFieldModal({ onClose }: { onClose: () => void }) {
	const ref = useRef<HTMLButtonElement>(null);
	return (
		<Modal onClose={onClose} testId="auto-focus-ref-over-field-modal" autoFocus={ref}>
			<ModalHeader hasCloseButton>
				<ModalTitle>Modal with an autoFocus ref and an autoFocus field</ModalTitle>
			</ModalHeader>
			<ModalBody>
				<Textfield aria-label="Summary" testId="auto-focus-ref-over-field-field" autoFocus />
				<Button testId="auto-focus-ref-over-field-target" ref={ref}>
					Target
				</Button>
			</ModalBody>
		</Modal>
	);
}

function RefCallbackAutoFocusRefModal({ onClose }: { onClose: () => void }) {
	const ref = useRef<HTMLInputElement | null>(null);
	const setRef = useCallback((element: HTMLInputElement | null) => {
		ref.current = element;
	}, []);
	return (
		<Modal onClose={onClose} testId="ref-callback-auto-focus-ref-modal" autoFocus={ref}>
			<ModalHeader hasCloseButton>
				<ModalTitle>Modal with an autoFocus ref set in a ref callback</ModalTitle>
			</ModalHeader>
			<ModalBody>
				<input aria-label="Raw" data-testid="ref-callback-auto-focus-ref-input" ref={setRef} />
			</ModalBody>
		</Modal>
	);
}

function LateContentModal({ onClose }: { onClose: () => void }) {
	const isLoaded = useIsLoaded();
	return (
		<Modal onClose={onClose} testId="late-content-modal">
			{/* No close button, so the modal has nothing to focus when it opens. */}
			<ModalHeader>
				<ModalTitle>Late content</ModalTitle>
			</ModalHeader>
			<ModalBody>
				{isLoaded ? (
					<Button testId="late-content-modal-action" onClick={onClose}>
						Action
					</Button>
				) : (
					<p>Loading</p>
				)}
			</ModalBody>
		</Modal>
	);
}

function LateAutoFocusRefModal({ onClose }: { onClose: () => void }) {
	const isLoaded = useIsLoaded();
	const ref = useRef<HTMLButtonElement>(null);
	return (
		<Modal onClose={onClose} testId="late-auto-focus-ref-modal" autoFocus={ref}>
			{/* No close button, so the modal has nothing to focus when it opens. */}
			<ModalHeader>
				<ModalTitle>Late autoFocus ref</ModalTitle>
			</ModalHeader>
			<ModalBody>
				{isLoaded ? (
					<Button testId="late-auto-focus-ref-target" ref={ref}>
						Target
					</Button>
				) : (
					<p>Loading</p>
				)}
			</ModalBody>
		</Modal>
	);
}

const timingTriggers: ReadonlyArray<{ variant: TVariant; label: string }> = [
	{ variant: 'several-autofocus', label: 'Open modal with several autoFocus fields' },
	{ variant: 'late-autofocus-field', label: 'Open modal with a field that mounts later' },
	{ variant: 'auto-focus-ref-over-field', label: 'Open modal with an autoFocus ref and field' },
	{ variant: 'ref-callback-auto-focus-ref', label: 'Open modal with a ref callback autoFocus ref' },
	{ variant: 'late-content', label: 'Open modal with content that loads later' },
	{ variant: 'late-auto-focus-ref', label: 'Open modal with an autoFocus ref that loads later' },
];

export default function TestingInitialFocusMatrix(): React.ReactNode {
	const [openVariant, setOpenVariant] = useState<TVariant>('none');
	const autoFocusRef = useRef<HTMLInputElement>(null);

	const close = useCallback(() => setOpenVariant('none'), []);

	const setNativeAutofocus = useCallback((node: HTMLInputElement | null) => {
		if (node === null) {
			return;
		}
		// React 18 does not reflect the JSX `autoFocus` prop as the HTML
		// `autofocus` attribute, which is what `getInitialFocusTarget` looks
		// for via `container.querySelector('[autofocus]')`. Set it explicitly
		// so this fixture exercises the autofocus branch.
		node.setAttribute('autofocus', '');
	}, []);

	return (
		<div>
			<Button
				aria-haspopup="dialog"
				onClick={() => setOpenVariant('default')}
				testId="default-modal-trigger"
			>
				Open default modal
			</Button>

			<Button
				aria-haspopup="dialog"
				onClick={() => setOpenVariant('native-autofocus')}
				testId="native-autofocus-modal-trigger"
			>
				Open modal with native autofocus
			</Button>

			<Button
				aria-haspopup="dialog"
				onClick={() => setOpenVariant('auto-focus-ref')}
				testId="auto-focus-ref-modal-trigger"
			>
				Open modal with autoFocus ref
			</Button>

			{timingTriggers.map(({ variant, label }) => (
				<Button
					key={variant}
					aria-haspopup="dialog"
					onClick={() => setOpenVariant(variant)}
					testId={`${variant}-modal-trigger`}
				>
					{label}
				</Button>
			))}

			<ModalTransition>
				{openVariant === 'default' && (
					<Modal onClose={close} testId="default-modal">
						<ModalHeader hasCloseButton>
							<ModalTitle>Default modal</ModalTitle>
						</ModalHeader>
						<ModalBody>
							<p>No native autofocus element; expect first focusable to win.</p>
						</ModalBody>
						<ModalFooter>
							<Button testId="default-modal-secondary" appearance="subtle" onClick={close}>
								Secondary
							</Button>
							<Button testId="default-modal-primary" appearance="primary" onClick={close}>
								Close
							</Button>
						</ModalFooter>
					</Modal>
				)}

				{openVariant === 'native-autofocus' && (
					<Modal onClose={close} testId="native-autofocus-modal">
						<ModalHeader hasCloseButton>
							<ModalTitle>Modal with native autofocus</ModalTitle>
						</ModalHeader>
						<ModalBody>
							<label htmlFor="native-autofocus-input">Name</label>
							<input
								id="native-autofocus-input"
								data-testid="native-autofocus-input"
								ref={setNativeAutofocus}
								type="text"
							/>
						</ModalBody>
						<ModalFooter>
							<Button testId="native-autofocus-modal-close" onClick={close}>
								Close
							</Button>
						</ModalFooter>
					</Modal>
				)}

				{openVariant === 'auto-focus-ref' && (
					<Modal onClose={close} testId="auto-focus-ref-modal" autoFocus={autoFocusRef}>
						<ModalHeader hasCloseButton>
							<ModalTitle>Modal with autoFocus ref</ModalTitle>
						</ModalHeader>
						<ModalBody>
							<label htmlFor="auto-focus-ref-input">Name</label>
							<input
								id="auto-focus-ref-input"
								data-testid="auto-focus-ref-input"
								ref={autoFocusRef}
								type="text"
							/>
						</ModalBody>
						<ModalFooter>
							<Button testId="auto-focus-ref-modal-close" onClick={close}>
								Close
							</Button>
						</ModalFooter>
					</Modal>
				)}

				{openVariant === 'several-autofocus' && (
					<Modal onClose={close} testId="several-autofocus-modal">
						<ModalHeader hasCloseButton>
							<ModalTitle>Modal with several autoFocus fields</ModalTitle>
						</ModalHeader>
						<ModalBody>
							<Textfield aria-label="First" testId="several-autofocus-first" autoFocus />
							<Textfield aria-label="Second" testId="several-autofocus-second" autoFocus />
						</ModalBody>
					</Modal>
				)}

				{openVariant === 'late-autofocus-field' && <LateAutofocusFieldModal onClose={close} />}

				{openVariant === 'auto-focus-ref-over-field' && (
					<AutoFocusRefOverFieldModal onClose={close} />
				)}

				{openVariant === 'ref-callback-auto-focus-ref' && (
					<RefCallbackAutoFocusRefModal onClose={close} />
				)}

				{openVariant === 'late-content' && <LateContentModal onClose={close} />}

				{openVariant === 'late-auto-focus-ref' && <LateAutoFocusRefModal onClose={close} />}
			</ModalTransition>
		</div>
	);
}
