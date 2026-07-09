/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { Fragment, useCallback, useState } from 'react';

import Avatar from '@atlaskit/avatar/avatar';
import Button from '@atlaskit/button/new';
import { cssMap, jsx } from '@atlaskit/css';
import Modal from '@atlaskit/modal-dialog';
import ModalBody from '@atlaskit/modal-dialog/modal-body';
import ModalFooter from '@atlaskit/modal-dialog/modal-footer';
import ModalHeader from '@atlaskit/modal-dialog/modal-header';
import ModalTitle from '@atlaskit/modal-dialog/modal-title';
import ModalTransition from '@atlaskit/modal-dialog/modal-transition';
import { Flex } from '@atlaskit/primitives/compiled/flex';
import { Text } from '@atlaskit/primitives/compiled/text';

const styles = cssMap({
	footer: { flex: '1' },
});

export default function Example(): JSX.Element {
	const [isOpen, setIsOpen] = useState(false);

	const openModal = useCallback(() => setIsOpen(true), []);
	const closeModal = useCallback(() => setIsOpen(false), []);

	return (
		<Fragment>
			<Button aria-haspopup="dialog" appearance="primary" onClick={openModal}>
				Open modal
			</Button>

			<ModalTransition>
				{isOpen && (
					<Modal onClose={closeModal}>
						<ModalHeader hasCloseButton>
							<ModalTitle>Default modal footer</ModalTitle>
						</ModalHeader>
						<ModalBody>
							<Text as="p">
								If you wish to customise a modal dialog, it accepts any valid React element as
								children.
							</Text>

							<Text as="p">
								Modal header accepts any valid React element as children, so you can use modal title
								in conjunction with other elements like an exit button in the top right.
							</Text>

							<Text as="p">
								Modal footer accepts any valid React element as children. For example, you can add
								an avatar in the footer. For very custom use cases, you can achieve the same thing
								without modal footer.
							</Text>
						</ModalBody>
						<ModalFooter>
							<Flex xcss={styles.footer} justifyContent="space-between">
								<Flex alignItems="center" gap="space.100">
									<Avatar
										size="small"
										src="https://pbs.twimg.com/profile_images/803832195970433027/aaoG6PJI_400x400.jpg"
									/>
									<Text as="p">Hey there!</Text>
								</Flex>
								<Button appearance="primary" onClick={closeModal}>
									Close
								</Button>
							</Flex>
						</ModalFooter>
					</Modal>
				)}
			</ModalTransition>
		</Fragment>
	);
}
