import React, { useCallback, useRef, useState } from 'react';

import Lorem from 'react-lorem-component';

import Button from '@atlaskit/button/new';
import Checkbox from '@atlaskit/checkbox';
import { Field } from '@atlaskit/form';
import { Box, Stack, xcss } from '@atlaskit/primitives';

import Modal, { ModalBody, ModalFooter, ModalHeader, ModalTitle, ModalTransition } from '../src';

import ModalTitleWithClose from './common/modal-title';

const containerStyles = xcss({
	height: '200%',
});

export default function ExampleScroll() {
	const [isOpen, setIsOpen] = useState(false);
	const [titleShown, setTitleShown] = useState(true);
	const [shouldScrollInViewport, setShouldScrollInViewPort] = useState(false);

	const open = useCallback(() => setIsOpen(true), []);
	const close = useCallback(() => setIsOpen(false), []);

	const bottomRef = useRef<HTMLDivElement>(null);
	const scrollToBottom = useCallback(() => bottomRef.current?.scrollIntoView(true), []);

	return (
		<Box xcss={containerStyles} padding="space.200">
			<Stack space="space.200" alignInline="start">
				<p>
					The scroll behavior of modals can be configured so that scrolling happens inside the modal
					body or outside the modal, within the viewport.
				</p>
				<p>
					In either case, modals prevent the window from being scrolled both natively and
					programatically. This means that certain browser issues such as{' '}
					<code>scrollIntoView</code> scrolling the window instead of only the closest scroll parent
					will be prevented.
				</p>
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
				<Field name="hs" label="Visibility">
					{() => (
						<Checkbox
							label="Header/footer shown"
							name="visibility"
							testId="visibility"
							onChange={(e) => setTitleShown(e.target.checked)}
							isChecked={titleShown}
						/>
					)}
				</Field>

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
							<ModalHeader>
								<ModalTitleWithClose onClose={close}>
									<ModalTitle>Modal Title</ModalTitle>
								</ModalTitleWithClose>
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
