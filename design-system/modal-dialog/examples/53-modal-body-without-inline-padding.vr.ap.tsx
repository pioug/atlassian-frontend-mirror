/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { Fragment, useCallback, useState } from 'react';

import { cssMap, jsx } from '@compiled/react';

import Button from '@atlaskit/button/default/button';
import Code from '@atlaskit/code/code';
import Modal from '@atlaskit/modal-dialog/modal-dialog';
import ModalBody from '@atlaskit/modal-dialog/modal-body';
import ModalFooter from '@atlaskit/modal-dialog/modal-footer';
import ModalHeader from '@atlaskit/modal-dialog/modal-header';
import ModalTitle from '@atlaskit/modal-dialog/modal-title';
import ModalTransition from '@atlaskit/modal-dialog/modal-transition';
import { Text } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

const contentStyles = cssMap({
	root: {
		width: '100%',
		height: '240px',
		backgroundColor: token('color.background.accent.magenta.subtlest'),
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'center',
	},
});

export default function ModalBodyWithoutInlinePaddingExample(): JSX.Element {
	const [isOpen, setIsOpen] = useState(false);
	const open = useCallback(() => setIsOpen(true), []);
	const close = useCallback(() => setIsOpen(false), []);

	return (
		<Fragment>
			<Button aria-haspopup="dialog" appearance="primary" onClick={open} testId="modal-trigger">
				Open Modal
			</Button>

			<ModalTransition>
				{isOpen && (
					<Modal onClose={close} testId="modal">
						<ModalHeader hasCloseButton>
							<ModalTitle>Modal Title</ModalTitle>
						</ModalHeader>
						<ModalBody hasInlinePadding={false}>
							<div css={contentStyles.root}>
								<Text as="p">
									This <Code>ModalBody</Code> has no inline padding.
								</Text>
								<Text as="p">The content can touch the edges of the modal.</Text>
							</div>
						</ModalBody>
						<ModalFooter>
							<Button testId="secondary" appearance="subtle" onClick={close}>
								Secondary Action
							</Button>
							<Button testId="primary" appearance="primary" onClick={close}>
								Close
							</Button>
						</ModalFooter>
					</Modal>
				)}
			</ModalTransition>
		</Fragment>
	);
}
