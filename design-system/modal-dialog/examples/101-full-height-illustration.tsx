import React, { useCallback, useState } from 'react';

import Lorem from 'react-lorem-component';

import Button from '@atlaskit/button/new';
import { cssMap } from '@atlaskit/css';
import Modal, {
	CloseButton,
	ModalBody,
	ModalFooter,
	ModalHeader,
	ModalTitle,
	ModalTransition,
} from '@atlaskit/modal-dialog';
import { Box } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

const styles = cssMap({
	modalBody: {
		paddingBlockStart: '0',
		paddingBlockEnd: '0',
		paddingInlineStart: '0',
		paddingInlineEnd: '0',
		height: '100%',
		overflow: 'hidden',
		borderRadius: 'inherit',
	},
	modalContainer: {
		display: 'flex',
		height: '100%',
		position: 'relative',
		borderRadius: 'inherit',
	},
	leftHalf: {
		flex: '1',
		display: 'flex',
		flexDirection: 'column',
		minHeight: '0px',
	},
	content: {
		flex: '1',
		overflowY: 'auto',
		minHeight: '0px',
		paddingBlockStart: token('space.400'),
		paddingBlockEnd: token('space.400'),
		paddingInlineStart: token('space.400'),
		paddingInlineEnd: token('space.400'),
	},
	rightHalf: {
		flex: '1',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		overflow: 'hidden',
		position: 'relative',
		borderStartEndRadius: 'inherit',
		borderEndEndRadius: 'inherit',
		backgroundColor: token('color.background.accent.blue.subtlest'),
		color: token('color.text.accent.blue'),
	},
	closeButton: {
		position: 'absolute',
		insetBlockStart: token('space.200', '16px'),
		insetInlineEnd: token('space.200', '16px'),
		zIndex: 1,
	},
	illustration: {
		width: '100%',
		height: '100%',
		display: 'block',
	},
});

export default function FullHeightIllustrationExample(): React.JSX.Element {
	const [isOpen, setIsOpen] = useState(true);
	const open = useCallback(() => setIsOpen(true), []);
	const close = useCallback(() => setIsOpen(false), []);

	return (
		<>
			<Button aria-haspopup="dialog" appearance="primary" onClick={open} testId="modal-trigger">
				Open Modal
			</Button>
			<ModalTransition>
				{isOpen && (
					<Modal onClose={close} height={420} testId="modal">
						<Box xcss={styles.modalBody}>
							<Box xcss={styles.modalContainer}>
								<Box xcss={styles.leftHalf}>
									{/* eslint-disable-next-line @atlaskit/design-system/use-modal-dialog-close-button -- Close button is rendered over the illustration. */}
									<ModalHeader>
										<ModalTitle>Modal Title</ModalTitle>
									</ModalHeader>
									<Box xcss={styles.content}>
										<ModalBody>
											<Lorem count={2} />
										</ModalBody>
									</Box>
									<ModalFooter>
										<Button testId="secondary" appearance="subtle" onClick={close}>
											Secondary Action
										</Button>
										<Button testId="primary" appearance="primary" onClick={close}>
											Close
										</Button>
									</ModalFooter>
								</Box>
								<Box xcss={styles.rightHalf}>
									<Box xcss={styles.closeButton}>
										<CloseButton onClick={close} label="Close modal" />
									</Box>
									<Box xcss={styles.illustration}>
										<svg
											viewBox="0 0 320 400"
											width="100%"
											height="100%"
											preserveAspectRatio="xMidYMid slice"
											aria-hidden="true"
											focusable="false"
										>
											<rect width="320" height="400" fill="currentColor" opacity="0.12" />
											<circle cx="90" cy="110" r="50" fill="currentColor" opacity="0.35" />
											<rect x="60" y="200" width="200" height="120" rx="16" fill="currentColor" />
										</svg>
									</Box>
								</Box>
							</Box>
						</Box>
					</Modal>
				)}
			</ModalTransition>
		</>
	);
}
