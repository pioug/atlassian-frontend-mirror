import React, { useCallback, useRef, useState } from 'react';

import PlaceholderContent from './placeholder-content';

import Button from '@atlaskit/button/default/button';
import { Checkbox } from '@atlaskit/checkbox/checkbox';
import { cssMap } from '@atlaskit/css';
import { CheckboxField } from '@atlaskit/form/checkbox-field';
import ModalDialog from '@atlaskit/modal-dialog/modal-dialog';
import ModalBody from '@atlaskit/modal-dialog/modal-body';
import ModalFooter from '@atlaskit/modal-dialog/modal-footer';
import ModalHeader from '@atlaskit/modal-dialog/modal-header';
import ModalTitle from '@atlaskit/modal-dialog/modal-title';
import ModalTransition from '@atlaskit/modal-dialog/modal-transition';
import { Box, Text } from '@atlaskit/primitives/compiled';

const containerStyles = cssMap({
	root: {
		display: 'grid',
		width: '250%',
		gridTemplateColumns: 'repeat(2, 1fr)',
	},
});

export function ScrollHorizontalExample(): React.JSX.Element {
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
				<Text as="p">
					The width of body is greater than viewport width (horizontally scrollable).
				</Text>

				<br />
				<Button appearance="primary" onClick={scrollTriggerIntoView} testId="scroll-into-view">
					Scroll trigger into view
				</Button>
			</Box>

			<Box ref={triggerRef}>
				<CheckboxField name="sb" label="Scrolling behavior">
					{() => (
						<Checkbox
							label="Should scroll within the viewport"
							name="scroll"
							testId="scroll"
							onChange={(e) => setShouldScrollInViewPort(e.target.checked)}
							isChecked={shouldScrollInViewport}
						/>
					)}
				</CheckboxField>

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
							<PlaceholderContent count={10} />
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

export default ScrollHorizontalExample;
