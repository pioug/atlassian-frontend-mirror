import React, { useCallback, useState } from 'react';

import Button from '@atlaskit/button/default/button';
import { cssMap } from '@atlaskit/css';
import Modal from '@atlaskit/modal-dialog/modal-dialog';
import ModalHeader from '@atlaskit/modal-dialog/modal-header';
import ModalTitle from '@atlaskit/modal-dialog/modal-title';
import { Box, Stack, Text } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

const styles = cssMap({
	modalScrollContainer: {
		height: '100%',
		overflowX: 'auto',
		overflowY: 'hidden',
		borderRadius: token('radius.xlarge'),
	},
	modalRoot: {
		display: 'flex',
		flexDirection: 'column',
		height: '100%',
		minHeight: '0',
		minWidth: '768px',
		overflow: 'hidden',
	},
	modalHeader: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'space-between',
		minHeight: '49px',
		paddingBlockEnd: token('space.100'),
		paddingBlockStart: token('space.100'),
		paddingInlineEnd: token('space.300'),
		paddingInlineStart: token('space.500'),
	},
	outerContainer: {
		position: 'relative',
		height: '100%',
		overflow: 'hidden',
	},
	flexRow: {
		display: 'flex',
		height: '100%',
		maxWidth: '1920px',
		marginInlineEnd: 'auto',
		marginInlineStart: 'auto',
		width: '100%',
		overflow: 'hidden',
	},
	leftColumn: {
		flexGrow: 1,
		flexShrink: 1,
		flexBasis: 0,
		minWidth: '0',
		overflowX: 'hidden',
		overflowY: 'auto',
	},
	stickyHeader: {
		position: 'sticky',
		insetBlockStart: '0',
		zIndex: 100,
		backgroundColor: token('elevation.surface.overlay'),
		paddingBlockEnd: token('space.150'),
		paddingBlockStart: token('space.200'),
		paddingInlineEnd: token('space.150'),
		paddingInlineStart: token('space.500'),
	},
	mainContent: {
		minHeight: '900px',
		paddingBlockEnd: token('space.400'),
		paddingBlockStart: token('space.300'),
		paddingInlineEnd: token('space.400'),
		paddingInlineStart: token('space.500'),
	},
	sidebarPanel: {
		display: 'flex',
		flexDirection: 'column',
		alignSelf: 'stretch',
		flexGrow: 0,
		flexShrink: 1,
		flexBasis: '37%',
		minWidth: '300px',
		minHeight: '0',
		height: '100%',
	},
	sidebarContainer: {
		overflowX: 'hidden',
		overflowY: 'auto',
		paddingInlineEnd: token('space.300'),
	},
	sidebarContent: {
		minHeight: '900px',
		paddingBlockEnd: token('space.400'),
		paddingBlockStart: token('space.300'),
		paddingInlineStart: token('space.300'),
	},
});

export default function TopLayerScrollReproduction(): React.JSX.Element {
	const [isOpen, setIsOpen] = useState(false);
	const openModal = useCallback(() => setIsOpen(true), []);
	const closeModal = useCallback(() => setIsOpen(false), []);

	return (
		<>
			<Button aria-haspopup="dialog" appearance="primary" onClick={openModal}>
				Open extracted Work Item modal
			</Button>
			{isOpen && (
				<Modal onClose={closeModal} width={1280}>
					<ModalHeader hasCloseButton>
						<ModalTitle>Custom two column layout in modal</ModalTitle>
					</ModalHeader>
					<Box xcss={styles.modalScrollContainer}>
						<Box xcss={styles.modalRoot}>
							<Box xcss={styles.modalHeader}>
								<Text color="color.text.subtlest">PROJECT / EXTRACTED-123</Text>
								<Button appearance="subtle" onClick={closeModal}>
									Close
								</Button>
							</Box>
							<Box xcss={styles.outerContainer}>
								<Box xcss={styles.flexRow}>
									<Box testId="main-column-scroll-container" xcss={styles.leftColumn}>
										<Box xcss={styles.stickyHeader}>
											<Stack space="space.100">
												<Text color="color.text.subtlest" size="small">
													EXTRACTED-123
												</Text>
												<Text weight="medium">Hardcoded work item summary</Text>
											</Stack>
										</Box>
										<Box xcss={styles.mainContent}>
											<Stack space="space.400">
												<Text weight="medium">Main content</Text>
												<Text>
													This is a static 900px replacement for the data-driven issue content.
												</Text>
												<Text>Bottom of main content</Text>
												<Button>Hello</Button>
											</Stack>
										</Box>
									</Box>
									<Box xcss={styles.sidebarPanel}>
										<Box testId="sidebar-column-scroll-container" xcss={styles.sidebarContainer}>
											<Box xcss={styles.sidebarContent}>
												<Stack space="space.300">
													<Text weight="medium">Details</Text>
													<Text>Status: In progress</Text>
													<Text>Assignee: Sam Example</Text>
													<Text>Priority: High</Text>
													<Text>Bottom of sidebar content</Text>
													<Button>World</Button>
												</Stack>
											</Box>
										</Box>
									</Box>
								</Box>
							</Box>
						</Box>
					</Box>
				</Modal>
			)}
		</>
	);
}
