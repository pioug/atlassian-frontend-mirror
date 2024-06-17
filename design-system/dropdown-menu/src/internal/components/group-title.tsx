/** @jsx jsx */

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';

import { N300 } from '@atlaskit/theme/colors';
import { headingSizes } from '@atlaskit/theme/typography';
import { token } from '@atlaskit/tokens';

const itemHeadingContentHeight = headingSizes.h100.lineHeight;
const itemHeadingFontSize = headingSizes.h100.size;

const headingStyles = css({
	color: token('color.text.subtle', N300),
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	fontSize: itemHeadingFontSize,
	fontWeight: token('font.weight.bold', '700'),
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	lineHeight: itemHeadingContentHeight / itemHeadingFontSize,
	paddingBlock: token('space.0', '0px'),
	paddingInline: token('space.200', '16px'),
	textTransform: 'uppercase',
});

/**
 * __Group title__
 *
 * Used to visually represent the title for DropdownMenu groups
 *
 * @internal
 */
const GroupTitle = ({ id, title }: { id: string; title: string }) => (
	<div data-ds--menu--heading-item role="menuitem" id={id} aria-hidden="true" css={headingStyles}>
		{title}
	</div>
);

export default GroupTitle;
