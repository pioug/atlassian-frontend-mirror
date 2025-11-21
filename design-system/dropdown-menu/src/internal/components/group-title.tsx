import React from 'react';

import { cssMap } from '@atlaskit/css';
import { Box } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

const styles = cssMap({
	heading: {
		color: token('color.text.subtle'),
		font: token('font.heading.xxsmall'),
		paddingBlock: token('space.0', '0px'),
		paddingInline: token('space.200', '16px'),
	},
});

/**
 * __Group title__
 *
 * Used to visually represent the title for DropdownMenu groups
 *
 * @internal
 */
const GroupTitle = ({ id, title }: { id: string; title: string }): React.JSX.Element => (
	<Box data-ds--menu--heading-item role="menuitem" id={id} aria-hidden="true" xcss={styles.heading}>
		{title}
	</Box>
);

export default GroupTitle;
