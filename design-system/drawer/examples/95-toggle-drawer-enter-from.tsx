import React, { useState } from 'react';

import Button from '@atlaskit/button/default/button';
import Code from '@atlaskit/code/code';
import { Drawer } from '@atlaskit/drawer/drawer';
import { DrawerCloseButton } from '@atlaskit/drawer/drawer-close-button';
import { DrawerContent } from '@atlaskit/drawer/drawer-content';
import { DrawerSidebar } from '@atlaskit/drawer/drawer-sidebar';
import { Label } from '@atlaskit/form/label/default';
import type { Direction } from '@atlaskit/motion/entering/types';
import { Box, Inline } from '@atlaskit/primitives/compiled';

const DrawersExample = (): React.JSX.Element => {
	const [isDrawerOpen, setIsDrawerOpen] = useState(false);
	const [enterFrom, setEnterFrom] = useState<Direction>('left');

	const handleOnEnterFromChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
		setEnterFrom(event.target.value as Direction);
	};

	return (
		<Box>
			{!isDrawerOpen && <Button onClick={() => setIsDrawerOpen(true)}>Open Drawer</Button>}
			<Drawer
				enterFrom={enterFrom}
				testId="directions"
				onClose={() => setIsDrawerOpen(false)}
				isOpen={isDrawerOpen}
				width={'full'}
				label={`Drawer ${enterFrom}`}
			>
				<DrawerSidebar>
					<DrawerCloseButton />
				</DrawerSidebar>
				<DrawerContent>
					<Label htmlFor="select-drawer-enter-from">Drawer entrance direction</Label>
					<Box>
						<select
							id="select-drawer-enter-from"
							onChange={handleOnEnterFromChange}
							value={enterFrom}
						>
							{['top', 'right', 'bottom', 'left'].map((d) => (
								<option key={d} value={d}>
									{d}
								</option>
							))}
						</select>
					</Box>

					<Inline>
						<Code id="drawerContents">{`enterFrom: ${enterFrom}`}</Code>
					</Inline>
				</DrawerContent>
			</Drawer>
		</Box>
	);
};

export default DrawersExample;
