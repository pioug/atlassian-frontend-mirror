/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { Fragment, useCallback, useState } from 'react';

import Button from '@atlaskit/button/new';
import { cssMap, jsx } from '@atlaskit/css';
import {
	FullScreenModalDialog,
	ModalBody,
	ModalHeader,
	ModalTitle,
	ModalTransition,
} from '@atlaskit/modal-dialog/full-screen';
import { token } from '@atlaskit/tokens';

const styles = cssMap({
	modalContent: {
		width: '100%',
		height: '100%',
		backgroundColor: token('color.background.accent.magenta.subtlest'),
	},
});

export default function Example(): JSX.Element {
	const [isOpen, setIsOpen] = useState(false);
	const open = useCallback(() => setIsOpen(true), []);
	const close = useCallback(() => setIsOpen(false), []);

	return (
		<Fragment>
			<Button aria-haspopup="dialog" appearance="primary" onClick={open}>
				Open Modal
			</Button>

			<ModalTransition>
				{isOpen && (
					<FullScreenModalDialog onClose={close}>
						<ModalHeader hasCloseButton>
							<ModalTitle>Modal Title</ModalTitle>
						</ModalHeader>
						<ModalBody hasInlinePadding={false}>
							<div css={styles.modalContent} />
						</ModalBody>
					</FullScreenModalDialog>
				)}
			</ModalTransition>
		</Fragment>
	);
}
