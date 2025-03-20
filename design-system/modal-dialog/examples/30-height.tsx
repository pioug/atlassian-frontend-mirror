import React, { useCallback, useState } from 'react';

import Lorem from 'react-lorem-component';

import ButtonGroup from '@atlaskit/button/button-group';
import Button from '@atlaskit/button/new';
import Heading from '@atlaskit/heading';
import ModalDialog, {
	ModalBody,
	ModalFooter,
	ModalHeader,
	ModalTitle,
	ModalTransition,
} from '@atlaskit/modal-dialog';
import { Box, Inline, xcss } from '@atlaskit/primitives';

const containerStyles = xcss({
	padding: 'space.200',
});

const titleStyles = xcss({
	marginBlockEnd: 'space.200',
});
const units = [420, '42em', '100%'];

export default function ModalDemo() {
	const [height, setHeight] = useState<number | string | null>(null);
	const close = useCallback(() => setHeight(null), []);

	const btn = (name: string | number) => (
		<Button aria-haspopup="dialog" key={name} onClick={() => setHeight(name)}>
			{name}
		</Button>
	);

	return (
		<Box xcss={containerStyles}>
			<Heading id="units-title" as="h2" size="large">
				<Inline xcss={titleStyles}>Units</Inline>
			</Heading>
			<ButtonGroup titleId="units-title">{units.map(btn)}</ButtonGroup>

			<ModalTransition>
				{height && (
					<ModalDialog key={height} onClose={close} height={height}>
						<ModalHeader hasCloseButton>
							<ModalTitle>Modal: {height}</ModalTitle>
						</ModalHeader>
						<ModalBody>
							<Lorem count="1" />
						</ModalBody>
						<ModalFooter>
							<Button appearance="subtle">Secondary Action</Button>
							<Button onClick={close} appearance="primary">
								Close
							</Button>
						</ModalFooter>
					</ModalDialog>
				)}
			</ModalTransition>
		</Box>
	);
}
