import React, { useCallback, useState } from 'react';

import ButtonGroup from '@atlaskit/button/button-group';
import Button from '@atlaskit/button/default/button';
import Image from '@atlaskit/image';
import { CloseButton } from '@atlaskit/modal-dialog/close-button';
import Modal from '@atlaskit/modal-dialog/modal-dialog';
import ModalTitle from '@atlaskit/modal-dialog/modal-title';
import ModalTransition from '@atlaskit/modal-dialog/modal-transition';
// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { Box, Stack, xcss } from '@atlaskit/primitives';
import { token } from '@atlaskit/tokens';

import welcomeImage from './assets/this-is-new-jira.png';

const containerStyles = xcss({
	position: 'relative',
});

const closeContainerStyles = xcss({
	position: 'absolute',
	insetBlockStart: 'space.100',
	insetInlineEnd: 'space.100',
	backgroundColor: 'color.background.accent.gray.subtlest',
	borderColor: 'color.border.input',
	borderRadius: token('radius.small'),
	borderStyle: 'solid',
	borderWidth: 'border.width.selected',
});

export default function Example(): React.JSX.Element {
	const [isOpen, setIsOpen] = useState(false);
	const openModal = useCallback(() => setIsOpen(true), []);
	const closeModal = useCallback(() => setIsOpen(false), []);

	return (
		<Box>
			<Button aria-haspopup="dialog" appearance="primary" onClick={openModal}>
				Open modal
			</Button>

			<ModalTransition>
				{isOpen && (
					<Modal onClose={closeModal}>
						<Box xcss={containerStyles}>
							<Box xcss={closeContainerStyles}>
								<CloseButton onClick={closeModal} />
							</Box>
							<Box>
								<Image src={welcomeImage} alt="Graphic showing users working on a project" />
							</Box>
						</Box>
						<Box padding="space.500">
							<Stack space="space.200" alignInline="center">
								<ModalTitle>Experience your new Jira</ModalTitle>
								<Box as="p">
									Switch context, jump between projects, and get back to work quickly with our new
									look and feel. Take it for a spin and let us know what you think.
								</Box>
							</Stack>
							<Box paddingBlockStart="space.500">
								<Stack alignInline="center">
									<ButtonGroup label="Switch options">
										<Button appearance="subtle">Remind me later</Button>
										<Button onClick={closeModal} appearance="discovery">
											Switch to the new Jira
										</Button>
									</ButtonGroup>
								</Stack>
							</Box>
						</Box>
					</Modal>
				)}
			</ModalTransition>
		</Box>
	);
}
