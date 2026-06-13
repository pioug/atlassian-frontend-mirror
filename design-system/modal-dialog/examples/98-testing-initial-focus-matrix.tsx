import React, { useCallback, useState } from 'react';

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
 * See: `platform/packages/design-system/top-layer/notes/architecture/focus.md`.
 */
export default function TestingInitialFocusMatrix(): React.ReactNode {
	const [openVariant, setOpenVariant] = useState<'none' | 'default' | 'native-autofocus'>('none');

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
			</ModalTransition>
		</div>
	);
}
