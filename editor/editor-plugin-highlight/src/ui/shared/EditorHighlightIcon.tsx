import React from 'react';

import { SteppedRainbowIconDecoration } from '@atlaskit/editor-common/icons';
import EditFilledIcon from '@atlaskit/icon/core/edit';
import { Box } from '@atlaskit/primitives/compiled';

type EditorHighlightIconProps = {
	disabled: boolean;
	selectedColor?: string | null;
};

export const EditorHighlightIcon = ({
	disabled,
	selectedColor,
}: EditorHighlightIconProps): React.JSX.Element => (
	<Box paddingInline="space.050">
		<SteppedRainbowIconDecoration
			selectedColor={selectedColor}
			disabled={disabled}
			icon={<EditFilledIcon LEGACY_size="small" label="" />}
		/>
	</Box>
);
