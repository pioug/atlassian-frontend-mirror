import React, { useState } from 'react';

import Button from '@atlaskit/button/new';
import { Code } from '@atlaskit/code';
import { Label } from '@atlaskit/form';
import { type Direction } from '@atlaskit/motion';
import { Box, Inline } from '@atlaskit/primitives';

import Drawer from '../src';
import { directions } from '../src/constants';

const DrawersExample = () => {
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
				<Label htmlFor="select-drawer-enter-from">Drawer entrance direction</Label>
				<Box>
					<select
						id="select-drawer-enter-from"
						onChange={handleOnEnterFromChange}
						value={enterFrom}
					>
						{directions.map((d) => (
							<option key={d} value={d}>
								{d}
							</option>
						))}
					</select>
				</Box>

				<Inline>
					<Code id="drawerContents">{`enterFrom: ${enterFrom}`}</Code>
				</Inline>
			</Drawer>
		</Box>
	);
};

export default DrawersExample;
