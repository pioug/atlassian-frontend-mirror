import React, { useCallback, useState } from 'react';

import ButtonGroup from '@atlaskit/button/button-group';
import Button, { IconButton } from '@atlaskit/button/new';
import Heading from '@atlaskit/heading';
import CrossIcon from '@atlaskit/icon/glyph/cross';
import Image from '@atlaskit/image';
import { Box, Grid, Stack, xcss } from '@atlaskit/primitives';

import Modal, { ModalTransition, useModal } from '../../src';
import welcomeImage from '../images/this-is-new-jira.png';

const gridStyles = xcss({
	gridTemplateColumns: '1fr',
});

const closeContainerStyles = xcss({
	gridArea: 'close',
	gridRowStart: '1',
	gridColumnStart: '1',
});

const imageContainerStyles = xcss({
	gridArea: 'image',
	gridRowStart: '1',
	gridColumnStart: '1',
});

const CustomModalContent = () => {
	const { onClose, titleId } = useModal();

	return (
		<>
			<Grid gap="space.0" templateAreas={['image close']} xcss={gridStyles}>
				<Grid xcss={closeContainerStyles} justifyContent="end">
					<IconButton appearance="subtle" icon={CrossIcon} label="Close Modal" onClick={onClose} />
				</Grid>
				<Grid xcss={imageContainerStyles} justifyContent="start">
					<Image src={welcomeImage} alt="Graphic showing users working on a project" />
				</Grid>
			</Grid>
			<Box padding="space.500">
				<Stack space="space.200" alignInline="center">
					<Heading as="h1" size="medium" id={titleId}>
						Experience your new Jira
					</Heading>
					<Box as="p">
						Switch context, jump between projects, and get back to work quickly with our new look
						and feel. Take it for a spin and let us know what you think.
					</Box>
				</Stack>
				<Box paddingBlockStart="space.500">
					<Stack alignInline="center">
						<ButtonGroup label="Switch options">
							<Button appearance="subtle">Remind me later</Button>
							<Button onClick={onClose} appearance="discovery">
								Switch to the new Jira
							</Button>
						</ButtonGroup>
					</Stack>
				</Box>
			</Box>
		</>
	);
};

export default function Example() {
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
						<CustomModalContent />
					</Modal>
				)}
			</ModalTransition>
		</Box>
	);
}
