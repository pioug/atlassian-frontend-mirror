import React, { useCallback, useState } from 'react';

import Lorem from 'react-lorem-component';

import ButtonGroup from '@atlaskit/button/button-group';
import Button from '@atlaskit/button/new';
import { Label } from '@atlaskit/form';
import Heading from '@atlaskit/heading';
import ModalDialog, {
	ModalBody,
	ModalFooter,
	ModalHeader,
	ModalTitle,
} from '@atlaskit/modal-dialog';
import { Box } from '@atlaskit/primitives';
import TextField from '@atlaskit/textfield';

import ModalTitleWithClose from './common/modal-title';

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
		<>
			<Box>
				<Heading as="h2" size="large">
					Allowlist behaviour
				</Heading>
				<ButtonGroup label="Modal controls">
					<Button aria-haspopup="dialog" appearance="primary" onClick={open} testId="modal-trigger">
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
			</Box>
			{isOpen && (
				<ModalDialog testId="modal-focus-lock" width="large" onClose={close}>
					<ModalHeader>
						<ModalTitleWithClose onClose={close}>
							<ModalTitle>Modal container</ModalTitle>
						</ModalTitleWithClose>
					</ModalHeader>
					<Box data-allowlist-container="true">
						<ModalBody>
							<p>
								All elements of this modal are accessible through focus lock due to allowlisted
								container.
							</p>
							<Label htmlFor="allowlist-input">Allow List Input</Label>
							<TextField placeholder="first" id="allowlist-input" />
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
					</Box>
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
		</>
	);
}
