import React, { useState } from 'react';

import Button from '@atlaskit/button/default/button';
import Code from '@atlaskit/code/code';
import { Drawer } from '@atlaskit/drawer/drawer';
import { DrawerCloseButton } from '@atlaskit/drawer/drawer-close-button';
import { DrawerContent } from '@atlaskit/drawer/drawer-content';
import { DrawerSidebar } from '@atlaskit/drawer/drawer-sidebar';
import type { DrawerWidth } from '@atlaskit/drawer/types';
import { Label } from '@atlaskit/form/label/default';
import { Box, Inline } from '@atlaskit/primitives/compiled';

const widths: DrawerWidth[] = ['narrow', 'medium', 'wide', 'extended', 'full'];

const DrawersExample = (): React.JSX.Element => {
	const [isDrawerOpen, setIsDrawerOpen] = useState(false);
	const [width, setWidth] = useState<DrawerWidth>('narrow');

	const handleOnChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
		setWidth(event.target.value as DrawerWidth);
	};

	return (
		<Box>
			{!isDrawerOpen && <Button onClick={() => setIsDrawerOpen(true)}>Open Drawer</Button>}
			<Drawer
				testId="widths"
				onClose={() => setIsDrawerOpen(false)}
				isOpen={isDrawerOpen}
				width={width}
				label={`Drawer ${width}`}
			>
				<DrawerSidebar>
					<DrawerCloseButton />
				</DrawerSidebar>
				<DrawerContent>
					<Label htmlFor="select-drawer-width">Drawer width</Label>
					<Box>
						<select id="select-drawer-width" onChange={handleOnChange} value={width}>
							{widths.map((w) => (
								<option key={w} value={w}>
									{w}
								</option>
							))}
						</select>
					</Box>

					<Inline>
						<Code id="drawerContents">{`width: ${width}`}</Code>
					</Inline>
				</DrawerContent>
			</Drawer>
		</Box>
	);
};

export default DrawersExample;
