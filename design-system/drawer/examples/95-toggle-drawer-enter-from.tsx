import React, { useState } from 'react';

import Button from '@atlaskit/button/new';
import { Code } from '@atlaskit/code';
import Drawer, { DrawerCloseButton, DrawerContent, DrawerSidebar } from '@atlaskit/drawer';
import { Label } from '@atlaskit/form';
import { type Direction } from '@atlaskit/motion';
// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { Box, Inline } from "@atlaskit/primitives/compiled";

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
