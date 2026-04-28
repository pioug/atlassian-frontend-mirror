import React, { useCallback, useRef, useState } from 'react';

import Lorem from 'react-lorem-component';

import Button from '@atlaskit/button/new';
import Checkbox from '@atlaskit/checkbox';
import { Code } from '@atlaskit/code';
import { cssMap } from '@atlaskit/css';
import { CheckboxField } from '@atlaskit/form';
import Modal, {
	ModalBody,
	ModalFooter,
	ModalHeader,
	ModalTitle,
	ModalTransition,
} from '@atlaskit/modal-dialog';
import { Box, Stack, Text } from '@atlaskit/primitives/compiled';

const containerStyles = cssMap({
	root: {
		height: '200%',
	},
});

export default function ExampleScroll(): React.JSX.Element {
	const [isOpen, setIsOpen] = useState(false);
	const [titleShown, setTitleShown] = useState(true);
	const [shouldScrollInViewport, setShouldScrollInViewPort] = useState(false);

	const open = useCallback(() => setIsOpen(true), []);
	const close = useCallback(() => setIsOpen(false), []);

	const bottomRef = useRef<HTMLDivElement>(null);
	const scrollToBottom = useCallback(() => bottomRef.current?.scrollIntoView(true), []);

	return (
		<Box xcss={containerStyles.root} padding="space.200">
			<Stack space="space.200" alignInline="start">
				<Text as="p">
					The scroll behavior of modals can be configured so that scrolling happens inside the modal
					body or outside the modal, within the viewport.
				</Text>
				<Text as="p">
					In either case, modals prevent the window from being scrolled both natively and
					programatically. This means that certain browser issues such as{' '}
					<Code>scrollIntoView</Code> scrolling the window instead of only the closest scroll parent
					will be prevented.
				</Text>
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
				<CheckboxField name="hs" label="Visibility">
					{() => (
						<Checkbox
							label="Header/footer shown"
							name="visibility"
							testId="visibility"
							onChange={(e) => setTitleShown(e.target.checked)}
							isChecked={titleShown}
						/>
					)}
				</CheckboxField>

				<Button aria-haspopup="dialog" appearance="primary" onClick={open} testId="modal-trigger">
					Open modal
				</Button>
			</Stack>
			<ModalTransition>
				{isOpen && (
					<Modal
						label="Modal Label"
						onClose={close}
						shouldScrollInViewport={shouldScrollInViewport}
						testId="modal"
					>
						{titleShown && (
							<ModalHeader hasCloseButton>
								<ModalTitle>Modal Title</ModalTitle>
							</ModalHeader>
						)}
						<ModalBody>
							<Lorem count={10} />
							<Box ref={bottomRef} />
						</ModalBody>
						{titleShown && (
							<ModalFooter>
								<Button testId="scrollDown" appearance="subtle" onClick={scrollToBottom}>
									Scroll to bottom
								</Button>
								<Button testId="primary" appearance="primary" onClick={close}>
									Close
								</Button>
							</ModalFooter>
						)}
					</Modal>
				)}
			</ModalTransition>
		</Box>
	);
}
