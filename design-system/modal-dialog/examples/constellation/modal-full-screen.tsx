/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { Fragment, useCallback, useState } from 'react';

import Button from '@atlaskit/button/default/button';
import { cssMap, jsx } from '@atlaskit/css';
import ModalBody from '@atlaskit/modal-dialog/modal-body';
import ModalHeader from '@atlaskit/modal-dialog/modal-header';
import ModalTitle from '@atlaskit/modal-dialog/modal-title';
import ModalTransition from '@atlaskit/modal-dialog/modal-transition';
import { FullScreenModalDialog } from '@atlaskit/modal-dialog/full-screen';
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
