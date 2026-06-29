import React from 'react';

import { cssMap } from '@atlaskit/css';
import { TEXT_COLLAPSED_MENU } from '@atlaskit/editor-common/toolbar';
import { ToolbarDropdownItemSection } from '@atlaskit/editor-toolbar';
import type { CommonComponentProps } from '@atlaskit/editor-toolbar-model';
import { fg } from '@atlaskit/platform-feature-flags';
import { Box } from '@atlaskit/primitives/compiled';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';
import { token } from '@atlaskit/tokens';

const styles = cssMap({
	menu: {
		paddingBlock: token('space.025'),
		paddingInline: token('space.100'),
	},
});

type TextMenuSectionProps = {
	children: React.ReactNode;
} & CommonComponentProps;

export const TextMenuSection = ({ children, parents }: TextMenuSectionProps): React.JSX.Element => {
	const hasSeparator = parents.some((parent) => parent.key === TEXT_COLLAPSED_MENU.key);
	const onMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
		if (
			expValEquals('platform_editor_lovability_text_bg_color', 'isEnabled', true) &&
			fg('platform_editor_lovability_text_bg_color_patch_1')
		) {
			event.stopPropagation();
		}
	};

	return (
		<ToolbarDropdownItemSection hasSeparator={hasSeparator}>
			<Box xcss={styles.menu} onMouseDown={onMouseDown}>
				{children}
			</Box>
		</ToolbarDropdownItemSection>
	);
};
