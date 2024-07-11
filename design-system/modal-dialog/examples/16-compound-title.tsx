import React, { useCallback, useState } from 'react';

import Lorem from 'react-lorem-component';

import Button, { IconButton } from '@atlaskit/button/new';
import Heading from '@atlaskit/heading';
import CrossIcon from '@atlaskit/icon/glyph/cross';
import { token } from '@atlaskit/tokens';

import ModalDialog, { ModalBody, ModalFooter, ModalTransition, useModal } from '../src';

const headerStyles: React.CSSProperties = {
	background:
		'url(https://atlassian.design/react_assets/images/cards/personality.png) center top no-repeat',
	backgroundSize: 'cover',
	borderRadius: '4px 4px 0 0',
	// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
	paddingTop: 170,
	position: 'relative',
};

const titleStyles: React.CSSProperties = {
	// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
	top: 100,
	position: 'absolute',
	padding: `${token('space.025', '2px')} ${token('space.300', '24px')}`,
	textTransform: 'uppercase',
};

const CustomHeader = () => {
	const { titleId, onClose } = useModal();

	return (
		// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
		<div style={headerStyles}>
			{/* eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766 */}
			<div style={titleStyles}>
				<Heading id={titleId} level="h600" as="h1">
					A customised header
				</Heading>
			</div>
			<span
				style={{
					// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
					position: 'absolute',
					// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
					right: 0,
					// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
					top: token('space.050', '4px'),
				}}
			>
				<IconButton
					onClick={onClose}
					label="Close Modal"
					icon={(iconProps) => <CrossIcon {...iconProps} size="small" />}
				/>
			</span>
		</div>
	);
};

export default function CompoundTitleModal() {
	const [isOpen, setOpen] = useState(false);

	const open = useCallback(() => setOpen(true), []);
	const close = useCallback(() => setOpen(false), []);

	const secondaryAction = useCallback(({ target }: any) => console.log(target.innerText), []);

	return (
		<div>
			<Button appearance="primary" onClick={open}>
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
		</div>
	);
}
