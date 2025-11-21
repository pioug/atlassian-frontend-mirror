import React, { useCallback, useRef, useState } from 'react';

import Breadcrumbs, { BreadcrumbsItem } from '@atlaskit/breadcrumbs';
import Button from '@atlaskit/button/new';
import { cssMap } from '@atlaskit/css';
import { Field } from '@atlaskit/form';
import Modal, {
	CloseButton,
	ModalBody,
	ModalFooter,
	ModalHeader,
	ModalTitle,
	ModalTransition,
} from '@atlaskit/modal-dialog';
import { Flex } from '@atlaskit/primitives/compiled';
import Textfield from '@atlaskit/textfield';

const styles = cssMap({
	header: {
		flexDirection: 'row-reverse',
		width: '100%',
	},
	headerEnd: {
		flexDirection: 'row-reverse',
	},
});

export default function Example(): React.JSX.Element {
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
						<ModalHeader hasCloseButton={false}>
							<Flex alignItems="center" justifyContent="space-between" xcss={styles.header}>
								<Flex alignItems="center" gap="space.200" xcss={styles.headerEnd}>
									{/* We have the close button first in the DOM and then are
									reversing it using the flex styles to ensure that it is
									focused as the first interactive element in the modal,
									*before* any other relevant content inside the modal. This
									ensures users of assistive technology get all relevant
									content. */}
									<CloseButton onClick={closeModal} />
									<Breadcrumbs>
										<BreadcrumbsItem href="https://atlassian.design/" text="Projects" />
										<BreadcrumbsItem href="https://atlassian.design/" text="Design System Team" />
									</Breadcrumbs>
								</Flex>
								<ModalTitle>
									<span tabIndex={-1} ref={focusRef}>
										Sign up
									</span>
								</ModalTitle>
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
