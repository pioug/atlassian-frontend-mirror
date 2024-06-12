/** @jsx jsx */

import { type SyntheticEvent, useRef, useState } from 'react';

import { css, jsx } from '@emotion/react';

import Button from '@atlaskit/button/new';
import { Box, Inline } from '@atlaskit/primitives';
import { token } from '@atlaskit/tokens';

import Drawer from '../src';

const containerStyles = css({
	padding: token('space.200', '16px'),
});

export default () => {
	const [isDrawerOpen, setIsDrawerOpen] = useState(false);
	const returnFocusRef = useRef<HTMLButtonElement>(null);

	const openDrawer = () => {
		setIsDrawerOpen(true);
	};

	const onClose = (...args: [SyntheticEvent<HTMLElement>, any]) => {
		console.log('onClose', args);
		setIsDrawerOpen(false);
	};

	const onCloseComplete = (args: any) => console.log('onCloseComplete', args);

	const onOpenComplete = (args: any) => console.log('onOpenComplete', args);

	return (
		<Box xcss={containerStyles}>
			<Drawer
				onClose={onClose}
				onCloseComplete={onCloseComplete}
				onOpenComplete={onOpenComplete}
				isOpen={isDrawerOpen}
				width="wide"
				label="Basic drawer"
				shouldReturnFocus={returnFocusRef}
			>
				<code>Content</code>
			</Drawer>
			<Inline space="space.200">
				<Button appearance="primary" id="open-drawer" type="button" onClick={openDrawer}>
					Open drawer
				</Button>
				<Button appearance="primary" type="button" ref={returnFocusRef}>
					Focused on drawer close
				</Button>
			</Inline>
		</Box>
	);
};
