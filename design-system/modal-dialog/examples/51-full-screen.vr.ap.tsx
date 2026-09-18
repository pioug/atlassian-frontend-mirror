/**
 * @jsx jsx
 */

import { Fragment, useCallback, useState } from 'react';

import { cssMap, jsx } from '@compiled/react';

import Button from '@atlaskit/button/default/button';
import { FullScreenModalDialog } from '@atlaskit/modal-dialog/full-screen';
import ModalBody from '@atlaskit/modal-dialog/modal-body';
import ModalHeader from '@atlaskit/modal-dialog/modal-header';
import ModalTitle from '@atlaskit/modal-dialog/modal-title';
import ModalTransition from '@atlaskit/modal-dialog/modal-transition';
import { token } from '@atlaskit/tokens';

const contentStyles = cssMap({
	root: {
		width: '100%',
		height: '100%',
		backgroundColor: token('color.background.accent.magenta.subtlest'),
	},
});

export default function FullScreenModalExample(): JSX.Element {
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
					<FullScreenModalDialog onClose={close} testId="modal">
						<ModalHeader hasCloseButton>
							<ModalTitle>Modal Title</ModalTitle>
						</ModalHeader>
						<ModalBody hasInlinePadding={false}>
							<div css={contentStyles.root} />
						</ModalBody>
					</FullScreenModalDialog>
				)}
			</ModalTransition>
		</Fragment>
	);
}
