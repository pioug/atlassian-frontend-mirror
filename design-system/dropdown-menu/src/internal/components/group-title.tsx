import React from 'react';

import { Box, xcss } from '@atlaskit/primitives';

const headingStyles = xcss({
	color: 'color.text.subtle',
	font: 'font.heading.xxsmall',
	paddingBlock: 'space.0',
	paddingInline: 'space.200',
});

/**
 * __Group title__
 *
 * Used to visually represent the title for DropdownMenu groups
 *
 * @internal
 */
const GroupTitle = ({ id, title }: { id: string; title: string }) => (
	<Box data-ds--menu--heading-item role="menuitem" id={id} aria-hidden="true" xcss={headingStyles}>
		{title}
	</Box>
);

export default GroupTitle;
