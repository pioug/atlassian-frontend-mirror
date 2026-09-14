import React, { useCallback, useState } from 'react';

import PlaceholderContent from './placeholder-content';

import ButtonGroup from '@atlaskit/button/button-group';
import Button from '@atlaskit/button/default/button';
import { cssMap } from '@atlaskit/css';
import Heading from '@atlaskit/heading/heading';
import ModalDialog from '@atlaskit/modal-dialog/modal-dialog';
import ModalBody from '@atlaskit/modal-dialog/modal-body';
import ModalFooter from '@atlaskit/modal-dialog/modal-footer';
import ModalHeader from '@atlaskit/modal-dialog/modal-header';
import ModalTitle from '@atlaskit/modal-dialog/modal-title';
import ModalTransition from '@atlaskit/modal-dialog/modal-transition';
import { Box, Inline } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

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

const units = [420, '42em', '100%'];

export default function ModalDemo(): React.JSX.Element {
	const [height, setHeight] = useState<number | string | null>(null);
	const close = useCallback(() => setHeight(null), []);

	const btn = (name: string | number) => (
		<Button aria-haspopup="dialog" key={name} onClick={() => setHeight(name)}>
			{name}
		</Button>
	);

	return (
		<Box xcss={styles.container}>
			<Heading id="units-title" as="h2" size="large">
				<Inline xcss={styles.title}>Units</Inline>
			</Heading>
			<ButtonGroup titleId="units-title">{units.map(btn)}</ButtonGroup>

			<ModalTransition>
				{height && (
					<ModalDialog key={height} onClose={close} height={height}>
						<ModalHeader hasCloseButton>
							<ModalTitle>Modal: {height}</ModalTitle>
						</ModalHeader>
						<ModalBody>
							<PlaceholderContent count="1" />
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
