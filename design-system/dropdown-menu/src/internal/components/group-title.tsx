import React from 'react';

import { cssMap, cx } from '@atlaskit/css';
import { fg } from '@atlaskit/platform-feature-flags/fg';
import { Box } from '@atlaskit/primitives/compiled/box';
import { token } from '@atlaskit/tokens';

const styles = cssMap({
	heading: {
		color: token('color.text.subtle'),
		font: token('font.heading.xxsmall'),
		paddingBlock: token('space.0'),
		paddingInline: token('space.200'),
	},
	newHeading: {
		font: token('font.body.small'),
		color: token('color.text.subtlest'),
		paddingBlockStart: token('space.075'),
		paddingBlockEnd: token('space.050'),
		paddingInlineStart: token('space.100'),
		paddingInlineEnd: token('space.250'),
	},
});

const semanticStyles = cssMap({
	heading: {
		paddingBlock: token('space.0'),
		paddingInline: token('space.inset.xlarge'),
	},
});

/**
 * __Group title__
 *
 * Used to visually represent the title for DropdownMenu groups.
 *
 * @internal
 */
const GroupTitle = ({ id, title }: { id?: string; title: string }): React.JSX.Element => {
	if (fg('platform-dst-new-menu')) {
		return (
			<Box id={id} xcss={styles.newHeading}>
				{title}
			</Box>
		);
	}

	return (
		<Box
			data-ds--menu--heading-item
			role="menuitem"
			id={id}
			aria-hidden="true"
			xcss={cx(styles.heading, fg('platform-semantic-spacing') && semanticStyles.heading)}
		>
			{title}
		</Box>
	);
};

export default GroupTitle;
