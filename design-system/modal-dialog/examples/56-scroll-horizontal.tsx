import React, { useCallback, useRef, useState } from 'react';

import Lorem from 'react-lorem-component';

import Button from '@atlaskit/button/new';
import Checkbox from '@atlaskit/checkbox';
import { cssMap } from '@atlaskit/css';
import { Field } from '@atlaskit/form';
import ModalDialog, {
	ModalBody,
	ModalFooter,
	ModalHeader,
	ModalTitle,
	ModalTransition,
} from '@atlaskit/modal-dialog';
import { Box } from '@atlaskit/primitives/compiled';

const containerStyles = cssMap({
	root: {
		display: 'grid',
		width: '250%',
		gridTemplateColumns: 'repeat(2, 1fr)',
	},
});

export default function ExampleScroll() {
	const [isOpen, setIsOpen] = useState(false);
	const [shouldScrollInViewport, setShouldScrollInViewPort] = useState(false);

	const open = useCallback(() => setIsOpen(true), []);
	const close = useCallback(() => setIsOpen(false), []);

	const triggerRef = useRef<HTMLDivElement>(null);
	const scrollTriggerIntoView = useCallback(
		() => triggerRef.current && triggerRef.current.scrollIntoView(true),
		[],
	);

	return (
		<Box xcss={containerStyles.root} padding="space.200">
			<Box>
				<p>The width of body is greater than viewport width (horizontally scrollable).</p>

				<br />
				<Button appearance="primary" onClick={scrollTriggerIntoView} testId="scroll-into-view">
					Scroll trigger into view
				</Button>
			</Box>

			<Box ref={triggerRef}>
				<Field name="sb" label="Scrolling behavior">
					{() => (
						<Checkbox
							label="Should scroll within the viewport"
							name="scroll"
							testId="scroll"
							onChange={(e) => setShouldScrollInViewPort(e.target.checked)}
							isChecked={shouldScrollInViewport}
						/>
					)}
				</Field>

				<br />
				<Button aria-haspopup="dialog" onClick={open} testId="modal-trigger">
					Open modal
				</Button>
			</Box>

			<ModalTransition>
				{isOpen && (
					<ModalDialog
						onClose={close}
						shouldScrollInViewport={shouldScrollInViewport}
						testId="modal"
					>
						<ModalHeader hasCloseButton>
							<ModalTitle>Modal Title</ModalTitle>
						</ModalHeader>
						<ModalBody>
							<Lorem count={10} />
						</ModalBody>
						<ModalFooter>
							<Button appearance="subtle" testId="scrollDown">
								Scroll to bottom
							</Button>
							<Button appearance="primary" onClick={close} testId="primary">
								Close
							</Button>
						</ModalFooter>
					</ModalDialog>
				)}
			</ModalTransition>
		</Box>
	);
}
