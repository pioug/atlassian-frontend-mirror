import React, { useCallback, useState } from 'react';

import Lorem from 'react-lorem-component';

import Button from '@atlaskit/button/new';
import Heading from '@atlaskit/heading';
import ModalDialog, {
	CloseButton,
	ModalBody,
	ModalFooter,
	ModalTransition,
	useModal,
} from '@atlaskit/modal-dialog';
import { Box, Inline, xcss } from '@atlaskit/primitives';
import { token } from '@atlaskit/tokens';

const headerStyles: React.CSSProperties = {
	background:
		'url(https://atlassian.design/react_assets/images/cards/personality.png) center top no-repeat',
	backgroundSize: 'cover',
	borderRadius: '4px 4px 0 0',
	paddingTop: 170,
	position: 'relative',
};

const titleStyles: React.CSSProperties = {
	top: 100,
	position: 'absolute',
	padding: `${token('space.025', '2px')} ${token('space.300', '24px')}`,
	textTransform: 'uppercase',
};

const customCloseStyles = xcss({
	position: 'absolute',
	insetInlineEnd: token('space.0', '0'),
	insetBlockStart: token('space.050', '4px'),
});

const CustomHeader = () => {
	const { titleId, onClose } = useModal();

	return (
		// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
		<Box style={headerStyles}>
			{/* eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766 */}
			<Box style={titleStyles}>
				<Heading id={titleId} size="large" as="h1">
					A customised header
				</Heading>
			</Box>
			<Inline xcss={customCloseStyles}>
				<CloseButton onClick={onClose} />
			</Inline>
		</Box>
	);
};

export default function CompoundTitleModal() {
	const [isOpen, setOpen] = useState(false);

	const open = useCallback(() => setOpen(true), []);
	const close = useCallback(() => setOpen(false), []);

	const secondaryAction = useCallback(({ target }: any) => console.log(target.innerText), []);

	return (
		<>
			<Button aria-haspopup="dialog" appearance="primary" onClick={open}>
				Open Modal
			</Button>

			<ModalTransition>
				{isOpen && (
					<ModalDialog onClose={close}>
						<CustomHeader />
						<ModalBody>
							<Lorem count={2} />
						</ModalBody>
						<ModalFooter>
							<Button onClick={secondaryAction} appearance="subtle">
								Secondary Action
							</Button>
							<Button onClick={close} appearance="primary">
								Close
							</Button>
						</ModalFooter>
					</ModalDialog>
				)}
			</ModalTransition>
		</>
	);
}
