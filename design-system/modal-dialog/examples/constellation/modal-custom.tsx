/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { Fragment, useCallback, useState } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';

import ButtonGroup from '@atlaskit/button/button-group';
import Button, { IconButton } from '@atlaskit/button/new';
import Heading from '@atlaskit/heading';
import CrossIcon from '@atlaskit/icon/glyph/cross';
import { Box, Grid, Inline, xcss } from '@atlaskit/primitives';
import { token } from '@atlaskit/tokens';

import Modal, { ModalTransition, useModal } from '../../src';
import welcomeImage from '../images/this-is-new-jira.png';

const containerStyles = css({
	textAlign: 'center',
});

const imageStyles = css({
	borderRadius: '3px 3px 0 0',
});

const headerStyles = xcss({
	marginBlockEnd: 'space.100',
});

const marginBottomStyles = css({
	marginBlockEnd: token('space.500', '40px'),
});

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
		<Fragment>
			<Grid gap="space.0" templateAreas={['image close']} xcss={gridStyles}>
				<Grid xcss={closeContainerStyles} justifyContent="end">
					<IconButton appearance="subtle" icon={CrossIcon} label="Close Modal" onClick={onClose} />
				</Grid>
				<Grid xcss={imageContainerStyles} justifyContent="start">
					<img
						alt="Graphic showing users working on a project"
						src={welcomeImage}
						css={imageStyles}
					/>
				</Grid>
			</Grid>

			<Box padding="space.500" xcss={containerStyles}>
				<Heading as="h1" size="medium" id={titleId}>
					<Inline xcss={headerStyles}>Experience your new Jira</Inline>
				</Heading>
				<p>
					Switch context, jump between projects, and get back to work quickly with our new look and
					feel.
				</p>
				<p css={marginBottomStyles}>Take it for a spin and let us know what you think.</p>
				<ButtonGroup label="Switch options">
					<Button appearance="subtle">Remind me later</Button>
					<Button onClick={onClose} appearance="primary">
						Switch to the new Jira
					</Button>
				</ButtonGroup>
			</Box>
		</Fragment>
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
