import React, { useState } from 'react';

import Button from '@atlaskit/button/new';
import { Code } from '@atlaskit/code';
import Drawer, {
	DrawerCloseButton,
	DrawerContent,
	DrawerSidebar,
	type DrawerWidth,
} from '@atlaskit/drawer';
import { widths } from '@atlaskit/drawer/constants';
import { Label } from '@atlaskit/form';
// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { Box, Inline } from '@atlaskit/primitives/compiled';

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
