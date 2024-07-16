import React, { useState } from 'react';

import DropdownMenu, { DropdownItem } from '@atlaskit/dropdown-menu';
import { type BackgroundColor, Box, Inline, Stack, xcss } from '@atlaskit/primitives';

const boxStyles = xcss({
	borderStyle: 'solid',
	borderRadius: '3px',
	borderWidth: 'border.width',
});

const borderColorStylesMap = {
	neutral: xcss({ borderColor: 'color.border' }),
	warning: xcss({ borderColor: 'color.border.warning' }),
	selected: xcss({ borderColor: 'color.border.selected' }),
	danger: xcss({ borderColor: 'color.border.danger' }),
	success: xcss({ borderColor: 'color.border.success' }),
	discovery: xcss({ borderColor: 'color.border.discovery' }),
	information: xcss({ borderColor: 'color.border.information' }),
};

const colorMap = {
	neutral: {
		background: 'color.background.neutral',
		border: 'neutral',
	},
	warning: {
		background: 'color.background.warning',
		border: 'warning',
	},
	selected: {
		background: 'color.background.selected',
		border: 'selected',
	},
	danger: {
		background: 'color.background.danger',
		border: 'danger',
	},
	success: {
		background: 'color.background.success',
		border: 'success',
	},
	discovery: {
		background: 'color.background.discovery',
		border: 'discovery',
	},
	information: {
		background: 'color.background.information',
		border: 'information',
	},
};

export default function Example() {
	const [color, setColor]: [keyof typeof colorMap, Function] = useState('discovery');

	return (
		<Stack space="space.200" alignInline="start">
			<Inline alignBlock="center" space="space.100">
				<Box
					padding="space.400"
					backgroundColor={colorMap[color].background as BackgroundColor}
					xcss={[boxStyles, borderColorStylesMap[color]]}
				/>
				{color}
			</Inline>
			<DropdownMenu trigger="Choose a color">
				{Object.keys(colorMap).map((el) => (
					<DropdownItem key={el} isSelected={el === color} onClick={() => setColor(el)}>
						{el}
					</DropdownItem>
				))}
			</DropdownMenu>
		</Stack>
	);
}
