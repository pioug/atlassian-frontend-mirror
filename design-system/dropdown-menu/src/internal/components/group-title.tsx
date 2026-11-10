import React, { useContext } from 'react';

import { cssMap, cx } from '@atlaskit/css';
import { fg } from '@atlaskit/platform-feature-flags/fg';
import { Box } from '@atlaskit/primitives/compiled/box';
import { token } from '@atlaskit/tokens';

import { NewSpacingContext } from '../context/spacing-context';

const styles = cssMap({
	heading: {
		color: token('color.text.subtle'),
		font: token('font.heading.xxsmall'),
		paddingBlock: token('space.0'),
		paddingInline: token('space.200'),
	},
	newHeading: {
		font: token('font.heading.xxsmall'),
		color: token('color.text'),
		paddingBlock: token('space.100'),
		paddingInlineStart: token('space.150'),
		paddingInlineEnd: token('space.300'),
	},
	compact: {
		paddingInlineStart: token('space.100'),
		paddingInlineEnd: token('space.250'),
		paddingBlock: token('space.075'),
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
 * Pre-existing a11y note: uses `role="menuitem"` with `aria-hidden="true"`.
 * WAI-ARIA APG recommends `role="presentation"` for non-interactive group
 * headings, with the group linked via `aria-labelledby`. Out of scope for
 * the top-layer migration — this is legacy behavior.
 *
 * @internal
 */
const GroupTitle = ({ id, title }: { id?: string; title: string }): React.JSX.Element => {
	const spacing = useContext(NewSpacingContext);
	const isCompact = spacing === 'compact';

	if (fg('platform-dst-new-menu')) {
		return (
			<Box id={id} xcss={cx(styles.newHeading, isCompact && styles.compact)}>
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
