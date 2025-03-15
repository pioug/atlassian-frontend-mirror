import React, { useCallback, useRef, useState } from 'react';

import Breadcrumbs, { BreadcrumbsItem } from '@atlaskit/breadcrumbs';
import Button from '@atlaskit/button/new';
import { Field } from '@atlaskit/form';
import Modal, {
	CloseButton,
	ModalBody,
	ModalFooter,
	ModalHeader,
	ModalTitle,
	ModalTransition,
} from '@atlaskit/modal-dialog';
import { Flex } from '@atlaskit/primitives';
import Textfield from '@atlaskit/textfield';

export default function Example() {
	const [isOpen, setIsOpen] = useState(false);
	const openModal = useCallback(() => setIsOpen(true), []);
	const closeModal = useCallback(() => setIsOpen(false), []);
	const focusRef = useRef<HTMLSpanElement>(null);

	return (
		<>
			<Button aria-haspopup="dialog" appearance="primary" onClick={openModal}>
				Open modal
			</Button>

			<ModalTransition>
				{isOpen && (
					<Modal autoFocus={focusRef} onClose={closeModal}>
						<ModalHeader>
							<ModalTitle>
								<span tabIndex={-1} ref={focusRef}>
									Sign up
								</span>
							</ModalTitle>
							<Flex alignItems="center" gap="space.200">
								<Breadcrumbs>
									<BreadcrumbsItem href="https://atlassian.design/" text="Projects" />
									<BreadcrumbsItem href="https://atlassian.design/" text="Design System Team" />
								</Breadcrumbs>
								<CloseButton onClick={closeModal} />
							</Flex>
						</ModalHeader>
						<ModalBody>
							<Field label="Email" name="my-email" defaultValue="">
								{({ fieldProps }) => <Textfield autoComplete="off" {...fieldProps} />}
							</Field>
						</ModalBody>
						<ModalFooter>
							<Button appearance="subtle">Account settings</Button>
							<Button appearance="primary" onClick={closeModal}>
								Sign up
							</Button>
						</ModalFooter>
					</Modal>
				)}
			</ModalTransition>
		</>
	);
}
