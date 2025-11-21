import React, { useCallback, useState } from 'react';

import Lorem from 'react-lorem-component';

import ButtonGroup from '@atlaskit/button/button-group';
import Button from '@atlaskit/button/new';
import { cssMap } from '@atlaskit/css';
import Heading from '@atlaskit/heading';
import ModalDialog, {
	ModalBody,
	ModalFooter,
	ModalHeader,
	ModalTitle,
	ModalTransition,
} from '@atlaskit/modal-dialog';
import { Box, Inline, Stack } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

// eslint-disable-next-line @atlaskit/platform/use-entrypoints-in-examples
import { width } from '../src/internal/utils';

const units = [420, '42%', '42em', '100%'];
const sizes: (string | number)[] = width.values;

const styles = cssMap({
	container: {
		paddingBlockEnd: token('space.200'),
		paddingBlockStart: token('space.200'),
		paddingInlineEnd: token('space.200'),
		paddingInlineStart: token('space.200'),
	},
	title: {
		marginBlockEnd: token('space.200'),
	},
});

export default function ModalDemo(): React.JSX.Element {
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
		<Box xcss={styles.container}>
			<Stack space="space.200" alignInline="start">
				<Heading as="h2" size="large" id="sizes">
					<Inline xcss={styles.title}>Sizes</Inline>
				</Heading>
				<ButtonGroup titleId="sizes">{sizes.map(btn)}</ButtonGroup>
				<Heading as="h2" size="large" id="units">
					<Inline xcss={styles.title}>Units</Inline>
				</Heading>
				<ButtonGroup titleId="units">{units.map(btn)}</ButtonGroup>
			</Stack>

			<ModalTransition>
				{width && (
					<ModalDialog key={width} onClose={close} width={width} testId="modal">
						<ModalHeader hasCloseButton>
							<ModalTitle>Modal: {String(width)}</ModalTitle>
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
