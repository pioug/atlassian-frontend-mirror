import React, { useState } from 'react';

import Button from '@atlaskit/button/new';
import { Code } from '@atlaskit/code';
import { Label } from '@atlaskit/form';
import { Box, Inline } from '@atlaskit/primitives';

import Drawer from '../src';
import { type DrawerWidth } from '../src/components/types';
import { widths } from '../src/constants';

const DrawersExample = () => {
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
			</Drawer>
		</Box>
	);
};

export default DrawersExample;
