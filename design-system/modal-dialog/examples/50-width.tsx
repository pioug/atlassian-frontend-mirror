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
import { Box, Inline, Stack, xcss } from '@atlaskit/primitives';

import { width } from '../src/internal/constants';

import ModalTitleWithClose from './common/modal-title';

const units = [420, '42%', '42em', '100%'];
const sizes: (string | number)[] = width.values;

const containerStyles = xcss({
	padding: 'space.200',
});

const titleStyles = xcss({
	marginBlockEnd: 'space.200',
});

export default function ModalDemo() {
	const [width, setWidth] = useState<string | number | null>(null);
	const close = useCallback(() => setWidth(null), []);

	const btn = (name: string | number) => (
		<Button
			aria-haspopup="dialog"
			key={name}
			testId={`custom-width-${name}-trigger`}
			onClick={() => setWidth(name)}
		>
			{name}
		</Button>
	);

	return (
		<Box xcss={containerStyles}>
			<Stack space="space.200" alignInline="start">
				<Heading as="h2" size="large" id="sizes">
					<Inline xcss={titleStyles}>Sizes</Inline>
				</Heading>
				<ButtonGroup titleId="sizes">{sizes.map(btn)}</ButtonGroup>
				<Heading as="h2" size="large" id="units">
					<Inline xcss={titleStyles}>Units</Inline>
				</Heading>
				<ButtonGroup titleId="units">{units.map(btn)}</ButtonGroup>
			</Stack>

			<ModalTransition>
				{width && (
					<ModalDialog key={width} onClose={close} width={width} testId="modal">
						<ModalHeader>
							<ModalTitleWithClose onClose={close}>
								<ModalTitle>Modal: {String(width)}</ModalTitle>
							</ModalTitleWithClose>
						</ModalHeader>
						<ModalBody>
							<Lorem count="1" />
						</ModalBody>
						<ModalFooter>
							<Button appearance="subtle">Secondary Action</Button>
							<Button appearance="primary" onClick={close}>
								Close
							</Button>
						</ModalFooter>
					</ModalDialog>
				)}
			</ModalTransition>
		</Box>
	);
}
