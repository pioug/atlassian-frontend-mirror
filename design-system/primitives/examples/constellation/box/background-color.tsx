/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useState } from 'react';

import { cssMap, cx, jsx } from '@atlaskit/css';
import DropdownMenu, { DropdownItem } from '@atlaskit/dropdown-menu';
import { type BackgroundColor, Box, Inline, Stack } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

const styles = cssMap({
	box: {
		borderStyle: 'solid',
		borderRadius: token('radius.small'),
		borderWidth: token('border.width'),
	},
	neutral: {
		borderColor: token('color.border'),
	},
	warning: {
		borderColor: token('color.border.warning'),
	},
	selected: {
		borderColor: token('color.border.selected'),
	},
	danger: {
		borderColor: token('color.border.danger'),
	},
	success: {
		borderColor: token('color.border.success'),
	},
	discovery: {
		borderColor: token('color.border.discovery'),
	},
	information: {
		borderColor: token('color.border.information'),
	},
});

const colorMap = {
	neutral: {
		background: token('color.background.neutral'),
		border: 'neutral',
	},
	warning: {
		background: token('color.background.warning'),
		border: 'warning',
	},
	selected: {
		background: token('color.background.selected'),
		border: 'selected',
	},
	danger: {
		background: token('color.background.danger'),
		border: 'danger',
	},
	success: {
		background: token('color.background.success'),
		border: 'success',
	},
	discovery: {
		background: token('color.background.discovery'),
		border: 'discovery',
	},
	information: {
		background: token('color.background.information'),
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
					xcss={cx(styles.box, styles[color])}
				/>
				{color}
			</Inline>
			<DropdownMenu shouldRenderToParent trigger="Choose a color">
				{Object.keys(colorMap).map((el) => (
					<DropdownItem key={el} isSelected={el === color} onClick={() => setColor(el)}>
						{el}
					</DropdownItem>
				))}
			</DropdownMenu>
		</Stack>
	);
}
