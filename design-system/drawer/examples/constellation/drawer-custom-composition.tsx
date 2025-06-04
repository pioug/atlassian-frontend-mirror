/**
 * @jsxRuntime classic
 * @jsx jsx
 * @jsxFrag
 */

import React, { useState } from 'react';

import Lorem from 'react-lorem-component';

import Button from '@atlaskit/button/new';
import { cssMap, jsx } from '@atlaskit/css';
import { Drawer, DrawerCloseButton, DrawerContent } from '@atlaskit/drawer';
import { Stack, Text } from '@atlaskit/primitives';
import { token } from '@atlaskit/tokens';

const styles = cssMap({
	buttonLayout: {
		position: 'absolute',
		insetBlockStart: token('space.200'),
		insetInlineStart: token('space.200'),
	},
	content: {
		marginTop: token('space.0'),
		paddingLeft: token('space.300'),
		paddingRight: token('space.300'),
	},
	contentLayout: {
		height: '100%',
		display: 'flex',
		alignItems: 'center',
		textAlign: 'center',
	},
});

export default function DrawerExample() {
	const [isDrawerOpen, setIsDrawerOpen] = useState(false);

	return (
		<>
			<Drawer
				isOpen={isDrawerOpen}
				label="Drawer with customized composition"
				onClose={() => setIsDrawerOpen(false)}
			>
				<div css={styles.buttonLayout}>
					<DrawerCloseButton />
				</div>
				<DrawerContent xcss={styles.content}>
					<div css={styles.contentLayout}>
						<Stack space="space.200" alignInline="center">
							<Text size="large" weight="bold">
								Centered content
							</Text>
							<Lorem count={1} />
							<Button onClick={() => setIsDrawerOpen(false)}>Close</Button>
						</Stack>
					</div>
				</DrawerContent>
			</Drawer>
			<Button appearance="primary" onClick={() => setIsDrawerOpen(true)}>
				Open drawer
			</Button>
		</>
	);
}
