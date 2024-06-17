/** @jsx jsx */
import { useCallback, useState } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';
import Lorem from 'react-lorem-component';

import ButtonGroup from '@atlaskit/button/button-group';
import Button from '@atlaskit/button/new';
import ModalDialog, {
	ModalBody,
	ModalFooter,
	ModalHeader,
	ModalTitle,
} from '@atlaskit/modal-dialog';

const allowlistElement = (element: HTMLElement) => {
	if (element.closest('[data-allowlist-container="true"]')) {
		return false;
	}
	return true;
};

export default function Allowlist() {
	const [isOpen, setIsOpen] = useState(false);
	const [isOpenInner, setIsOpenInner] = useState(false);
	const open = useCallback(() => setIsOpen(true), []);
	const openInner = useCallback(() => setIsOpenInner(true), []);
	const close = useCallback(() => setIsOpen(false), []);
	const closeInner = useCallback(() => setIsOpenInner(false), []);

	return (
		<div>
			<div>
				<h2>Allowlist behaviour</h2>
				<ButtonGroup label="Modal controls">
					<Button appearance="primary" onClick={open} testId="modal-trigger">
						Open Modal
					</Button>
				</ButtonGroup>
				<p>
					This example shows how the focus lock allowlist lets people interact with content outside
					of the modal dialog. When the nested modal is open, the parent modal remains accessible.
				</p>
				<p>
					Focus lock ignores specified areas. Pass the <code>focusLockAllowlist</code> prop a
					function which returns <code>false</code> for node which should ignored by focus lock.
				</p>
			</div>
			{isOpen && (
				<ModalDialog testId="modal-focus-lock" width="large" onClose={close}>
					<ModalHeader>
						<ModalTitle>Modal container</ModalTitle>
					</ModalHeader>
					<div data-allowlist-container="true">
						<ModalBody>
							<p>
								All elements of this modal are accessible through focus lock due to allowlisted
								container.
							</p>
							<input type="text" placeholder="first" id="allowlist-input" />
						</ModalBody>
						<ModalFooter>
							<ButtonGroup label="Modal Controls">
								<Button appearance="primary" onClick={openInner} testId="nested-modal-trigger">
									Open Nested Modal
								</Button>
								<Button appearance="primary" onClick={close} testId="modal-trigger">
									Close
								</Button>
							</ButtonGroup>
						</ModalFooter>
					</div>
					{isOpenInner && (
						<ModalDialog
							testId="modal-focus-lock-inner"
							width="small"
							onClose={closeInner}
							focusLockAllowlist={allowlistElement}
						>
							<ModalHeader>
								<ModalTitle>Nested Modal</ModalTitle>
							</ModalHeader>
							<ModalBody>
								<Lorem count={1} />
							</ModalBody>
							<ModalFooter>
								<ButtonGroup label="Inner modal controls">
									<Button appearance="primary" onClick={closeInner} testId="modal-trigger">
										Close
									</Button>
								</ButtonGroup>
							</ModalFooter>
						</ModalDialog>
					)}
				</ModalDialog>
			)}
		</div>
	);
}
