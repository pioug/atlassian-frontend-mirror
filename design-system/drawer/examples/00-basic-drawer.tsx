import React, { type SyntheticEvent, useState } from 'react';

import Button from '@atlaskit/button/new';
import { Code } from '@atlaskit/code';
import Drawer, { DrawerCloseButton, DrawerContent, DrawerSidebar } from '@atlaskit/drawer';
import InlineMessage from '@atlaskit/inline-message';

const DrawersExample = (): React.JSX.Element => {
	const [isDrawerOpen, setIsDrawerOpen] = useState(false);
	const openDrawer = () => setIsDrawerOpen(true);
	const onClose = (...args: [SyntheticEvent<HTMLElement>, any]) => {
		console.log('onClose', args);
		setIsDrawerOpen(false);
	};
	const onCloseComplete = (args: any) => {
		console.log('onCloseComplete', args);
	};
	const onOpenComplete = (args: any) => {
		console.log('onOpenComplete', args);
	};
	return (
		// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
		<div style={{ padding: '2rem' }}>
			<Drawer
				onClose={onClose}
				onCloseComplete={onCloseComplete}
				onOpenComplete={onOpenComplete}
				isOpen={isDrawerOpen}
				width="wide"
				label="Basic drawer"
			>
				<DrawerSidebar>
					<DrawerCloseButton />
				</DrawerSidebar>
				<DrawerContent>
					<Code>Content</Code>
					<br />
					<InlineMessage title="Inline Message Title Example" secondaryText="Secondary Text">
						<p>Primary and secondary text dialog</p>
					</InlineMessage>
				</DrawerContent>
			</Drawer>
			<Button id="open-drawer" type="button" onClick={openDrawer}>
				Open drawer
			</Button>
		</div>
	);
};
export default DrawersExample;
