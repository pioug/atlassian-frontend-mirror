/**
 * @jsxRuntime classic
 * @jsx jsx
 */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';

import { useMouseDownEvent } from '../../../../../state/analytics/useLinkClicked';

import { type LayeredLinkProps } from './types';

const styles = css({
	// Stretch the invisible link over the whole of the post.
	// Hide the link’s text.
	top: 0,
	right: 0,
	bottom: 0,
	left: 0,
	overflow: 'hidden',
	textIndent: '100%',
	whiteSpace: 'nowrap',

	// Needs a heightened specificity to trump other anchor.
	// Stack it under all other links in the post text.
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'a&.layered-link': {
		position: 'absolute',
		zIndex: 0,
	},

	// When hovering over the layered link, any hidden action buttons inside
	// the Container should become visible.
	// As actions resides inside blocks and layered link is expected to be
	// on the same level of blocks. That makes the blocks, e.g. TitleBlock,
	// its sibling. Using general sibling combinator here to apply styling to
	// all the siblings of layered link.
	// The general sibling combinator (~) separates two selectors and matches all
	// iterations of the second element, that are following the first element
	// (though not necessarily immediately), and are children of the same parent
	// element.
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'&:hover ~ *': {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
		'.actions-button-group': {
			opacity: 1,
		},
	},
});

/**
 * An anchor component to cover the entire container creating a clickable area.
 * @internal
 * @see `clickableContainer`
 */
const LayeredLinkOld = ({ onClick, target, testId, text, url }: LayeredLinkProps) => {
	const onMouseDown = useMouseDownEvent();

	return (
		<a
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
			className="layered-link"
			css={styles}
			data-testid={`${testId}-layered-link`}
			href={url}
			onClick={onClick}
			onMouseDown={onMouseDown}
			target={target}
			tabIndex={-1} // Hide tab index and let the title link be the link.
		>
			{text}
		</a>
	);
};

export default LayeredLinkOld;
