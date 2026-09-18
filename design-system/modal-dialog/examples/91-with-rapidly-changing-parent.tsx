import React, { useEffect, useState } from 'react';

import Button from '@atlaskit/button/default/button';
import { cssMap } from '@atlaskit/css';
import Link from '@atlaskit/link/link';
import ModalBody from '@atlaskit/modal-dialog/modal-body';
import Modal from '@atlaskit/modal-dialog/modal-dialog';
import ModalFooter from '@atlaskit/modal-dialog/modal-footer';
import ModalHeader from '@atlaskit/modal-dialog/modal-header';
import ModalTitle from '@atlaskit/modal-dialog/modal-title';
import ModalTransition from '@atlaskit/modal-dialog/modal-transition';
import { Box, Text } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

import PlaceholderContent from './placeholder-content';

const containerStyles = cssMap({
	root: {
		height: '100%',
		paddingInlineStart: token('space.200'),
		paddingInlineEnd: token('space.200'),
		paddingBlockStart: token('space.200'),
		paddingBlockEnd: token('space.200'),
	},
});

export default function Parent(): React.JSX.Element {
	const [, setCount] = useState(0);

	useEffect(() => {
		setInterval(() => setCount((x) => x + 1), 20);
	}, []);

	return <Child />;
}

function Child() {
	const [isOpen, setIsOpen] = useState(false);
	const open = () => setIsOpen(true);
	const close = () => setIsOpen(false);

	return (
		<Box xcss={containerStyles.root}>
			<Text as="p">
				This shows a use case where the parent of modal dialog rapidly re-renders, which is not
				always in sync with the duration of modal dialog's enter/exit animation.
			</Text>
			<Text as="p">
				This replicates{' '}
				<Link href="https://product-fabric.atlassian.net/browse/DSP-640">DSP-640</Link>, except now
				that the bug is fixed, modal dialog's exit animation should be followed through even when
				its parent's render cycle is quicker than its own.
			</Text>
			<br />
			<Button aria-haspopup="dialog" appearance="primary" onClick={open} testId="modal-trigger">
				Open Modal
			</Button>
			<ModalTransition>
				{isOpen && (
					<Modal onClose={close} testId="modal">
						<ModalHeader hasCloseButton>
							<ModalTitle>Modal Title</ModalTitle>
						</ModalHeader>

						<ModalBody>
							<PlaceholderContent count={2} />
						</ModalBody>
						<ModalFooter>
							<Button appearance="subtle" testId="subtle">
								Secondary action
							</Button>
							<Button onClick={close} appearance="primary" testId="primary">
								Close
							</Button>
						</ModalFooter>
					</Modal>
				)}
			</ModalTransition>
		</Box>
	);
}
