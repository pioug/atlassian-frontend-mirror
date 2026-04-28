import React, { useCallback, useState } from 'react';

import Lorem from 'react-lorem-component';

import ButtonGroup from '@atlaskit/button/button-group';
import Button from '@atlaskit/button/new';
import { Code } from '@atlaskit/code';
import { Label } from '@atlaskit/form';
import Heading from '@atlaskit/heading';
import ModalDialog, {
	ModalBody,
	ModalFooter,
	ModalHeader,
	ModalTitle,
} from '@atlaskit/modal-dialog';
import { Box, Text } from '@atlaskit/primitives/compiled';
import TextField from '@atlaskit/textfield';

const allowlistElement = (element: HTMLElement) => {
	if (element.closest('[data-allowlist-container="true"]')) {
		return false;
	}
	return true;
};

export default function Allowlist(): React.JSX.Element {
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
				<Text as="p">
					This example shows how the focus lock allowlist lets people interact with content outside
					of the modal dialog. When the nested modal is open, the parent modal remains accessible.
				</Text>
				<Text as="p">
					Focus lock ignores specified areas. Pass the <Code>focusLockAllowlist</Code> prop a
					function which returns <Code>false</Code> for node which should ignored by focus lock.
				</Text>
			</Box>
			{isOpen && (
				<ModalDialog testId="modal-focus-lock" width="large" onClose={close}>
					<ModalHeader hasCloseButton>
						<ModalTitle>Modal container</ModalTitle>
					</ModalHeader>
					<Box data-allowlist-container="true">
						<ModalBody>
							<Text as="p">
								All elements of this modal are accessible through focus lock due to allowlisted
								container.
							</Text>
							<Label htmlFor="allowlist-input">Allow List Input</Label>
							<TextField id="allowlist-input" />
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
							<ModalHeader hasCloseButton>
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
