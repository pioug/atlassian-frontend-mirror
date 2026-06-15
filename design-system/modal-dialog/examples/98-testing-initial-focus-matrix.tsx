import React, { useCallback, useRef, useState } from 'react';

import Button from '@atlaskit/button/new';
import Modal, {
	ModalBody,
	ModalFooter,
	ModalHeader,
	ModalTitle,
	ModalTransition,
} from '@atlaskit/modal-dialog';

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
 * See: `platform/packages/design-system/top-layer/notes/architecture/focus.md`.
 */
export default function TestingInitialFocusMatrix(): React.ReactNode {
	const [openVariant, setOpenVariant] = useState<
		'none' | 'default' | 'native-autofocus' | 'auto-focus-ref'
	>('none');
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
			</ModalTransition>
		</div>
	);
}
