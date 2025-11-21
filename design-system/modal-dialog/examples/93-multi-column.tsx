import React, { useCallback, useRef, useState } from 'react';

import Lorem from 'react-lorem-component';

import Button from '@atlaskit/button/new';
import { cssMap } from '@atlaskit/css';
import Heading from '@atlaskit/heading';
import Modal, {
	ModalFooter,
	ModalHeader,
	ModalTitle,
	ModalTransition,
} from '@atlaskit/modal-dialog';
import { Box } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

const styles = cssMap({
	modalBody: {
		display: 'flex',
		height: '100%',
		flexDirection: 'column',
		overflowY: 'auto',
		paddingBlockStart: token('space.0'),
		paddingBlockEnd: token('space.300'),
	},
	columnNonFlexWrapper: {
		height: '80%',
	},
	columnContainer: {
		display: 'flex',
		height: '100%',
		flexGrow: 1,
	},
	column: {
		flex: '1 0 50%',
		overflowY: 'auto',
	},
});

export function MultiColumnExample(): React.JSX.Element {
	const [isOpen, setIsOpen] = useState(false);
	const [contentLength, setContentLength] = useState(10);
	const openModal = useCallback(() => setIsOpen(true), []);
	const closeModal = useCallback(() => setIsOpen(false), []);
	const toggleContentLength = useCallback(
		() => setContentLength(contentLength === 10 ? 1 : 10),
		[contentLength],
	);

	const bottomRef = useRef<HTMLDivElement>(null);
	const scrollToBottom = useCallback(() => bottomRef.current?.scrollIntoView(true), []);

	return (
		<>
			<Button
				aria-haspopup="dialog"
				appearance="primary"
				onClick={openModal}
				testId="modal-trigger"
			>
				Open modal
			</Button>

			<ModalTransition>
				{isOpen && (
					<Modal onClose={closeModal} testId="modal">
						<ModalHeader hasCloseButton>
							<ModalTitle>Two-column layout</ModalTitle>
						</ModalHeader>
						<Box xcss={styles.modalBody}>
							<p>These columns should scroll independently</p>
							<Button onClick={toggleContentLength}>Toggle short/long content</Button>
							<Box xcss={styles.columnNonFlexWrapper}>
								<Box xcss={styles.columnContainer} backgroundColor="color.background.neutral">
									<Box
										xcss={styles.column}
										backgroundColor="color.background.accent.yellow.subtler"
									>
										<Heading as="h2" size="large">
											Column 1
										</Heading>
										<Button testId="scrollDown" onClick={scrollToBottom}>
											Scroll to bottom
										</Button>
										<Lorem count={2 * contentLength} />
										<Heading as="h2" size="large">
											Bottom of column 1
										</Heading>
										<div ref={bottomRef} />
									</Box>

									<Box
										xcss={styles.column}
										style={{
											// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
											background: token('color.background.accent.teal.subtler'),
										}}
									>
										<Heading as="h2" size="large">
											Column 2
										</Heading>
										<Lorem count={contentLength} />
										<Heading as="h2" size="large">
											Bottom of column 2
										</Heading>
									</Box>
								</Box>
							</Box>
						</Box>
						<ModalFooter>
							<Button appearance="subtle" onClick={closeModal}>
								Cancel
							</Button>
							<Button appearance="primary" onClick={closeModal}>
								Done
							</Button>
						</ModalFooter>
					</Modal>
				)}
			</ModalTransition>
		</>
	);
}

export default MultiColumnExample;
