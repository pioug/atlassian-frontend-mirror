import React from 'react';

import { cssMap } from '@atlaskit/css';
import { Box } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

const styles = cssMap({
	heading: {
		color: token('color.text.subtle'),
		font: token('font.heading.xxsmall'),
		paddingBlock: token('space.0'),
		paddingInline: token('space.200'),
	},
});

/**
 * __Group title__
 *
 * Used to visually represent the title for DropdownMenu groups.
 *
 * Pre-existing a11y note: uses `role="menuitem"` with `aria-hidden="true"`.
 * WAI-ARIA APG recommends `role="presentation"` for non-interactive group
 * headings, with the group linked via `aria-labelledby`. Out of scope for
 * the top-layer migration — this is legacy behavior.
 *
 * @internal
 */
const GroupTitle = ({ id, title }: { id: string; title: string }): React.JSX.Element => (
	<Box data-ds--menu--heading-item role="menuitem" id={id} aria-hidden="true" xcss={styles.heading}>
		{title}
	</Box>
);

export default GroupTitle;
