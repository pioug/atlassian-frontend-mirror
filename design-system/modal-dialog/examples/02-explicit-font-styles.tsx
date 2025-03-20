/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { Fragment, useCallback, useState } from 'react';

import { cssMap, jsx } from '@compiled/react';

import Button from '@atlaskit/button/new';
import Modal, {
	ModalBody,
	ModalFooter,
	ModalHeader,
	ModalTitle,
	ModalTransition,
} from '@atlaskit/modal-dialog';
import { Text } from '@atlaskit/primitives';

const fontStyles = cssMap({
	root: {
		// Setting the "default" font to something extravagent to ensure the modal content overrides it.
		font: `italic 1.2rem "Fira Sans"`,
	},
});

export default function ExplicitFontStyles() {
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
					<Modal onClose={close} testId="modal">
						{/**
						 * Applying the "default" font styles as a child of the `Modal` to make sure it affects the modal.
						 * `Modal` is rendered in a Portal so won't be affected by its parent styles.
						 *
						 * Alternative we could apply styles directly to the `document.body` in a useLayoutEffect, but this
						 * approach has the same outcome.
						 */}
						<div css={fontStyles.root}>
							<ModalHeader hasCloseButton>
								<ModalTitle>Modal Title</ModalTitle>
							</ModalHeader>
							<ModalBody>
								Duplicating this page will make it a child page of{' '}
								<Text weight="bold">Search - user exploration</Text>, in the{' '}
								<Text weight="bold">Search & Smarts</Text> space.
							</ModalBody>
							<ModalFooter>
								<Button testId="secondary" appearance="subtle" onClick={close}>
									Secondary Action
								</Button>
								<Button testId="primary" appearance="primary" onClick={close}>
									Close
								</Button>
							</ModalFooter>
						</div>
					</Modal>
				)}
			</ModalTransition>
		</Fragment>
	);
}
