import React, { useContext } from 'react';

import { cssMap, cx } from '@atlaskit/css';
import { OutsideClickTargetRefContext } from '@atlaskit/editor-common/ui-react';
import { Box, Pressable } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

const styles = cssMap({
	container: {
		backgroundColor: token('elevation.surface.overlay'),
		boxShadow: token('elevation.shadow.overlay'),
		borderRadius: token('radius.small'),
		paddingBlock: token('space.050'),
	},
	option: {
		paddingBlock: token('space.100'),
		paddingInline: token('space.200'),
		color: token('color.text'),
		backgroundColor: token('color.background.neutral.subtle'),
		'&:hover': {
			backgroundColor: token('color.background.neutral.subtle.hovered'),
		},
	},
	selectedOption: {
		fontWeight: token('font.weight.bold'),
	},
});

export interface MenuOption {
	id: string;
	label: string;
	onClick: (e: React.MouseEvent) => void;
	selected: boolean;
}

interface PasteActionsMenuContentProps {
	onMouseDown: (e: React.MouseEvent) => void;
	onMouseEnter: () => void;
	options: MenuOption[];
}

export const PasteActionsMenuContent = ({
	options,
	onMouseDown,
	onMouseEnter,
}: PasteActionsMenuContentProps) => {
	const setOutsideClickTargetRef = useContext(OutsideClickTargetRefContext);

	return (
		<Box ref={setOutsideClickTargetRef} xcss={styles.container}>
			{options.map((option) => (
				<Pressable
					key={option.id}
					xcss={cx(styles.option, option.selected && styles.selectedOption)}
					onMouseDown={onMouseDown}
					onMouseEnter={onMouseEnter}
					onFocus={onMouseEnter}
					onClick={option.onClick}
				>
					{option.label}
				</Pressable>
			))}
		</Box>
	);
};
