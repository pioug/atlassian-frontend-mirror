import { token } from '@atlaskit/tokens';

const containerPadding = 8;
const scrollIndicatorHeight = 2;
const itemHeadingContentHeight = 16; // Originally headingSizes.h100.lineHeight from '@atlaskit/theme/typography'
const skeletonHeadingHeight = containerPadding;
const skeletonHeadingMarginOffset = 3;
const skeletonHeadingTopMargin =
	containerPadding * 2.5 +
	(itemHeadingContentHeight - skeletonHeadingHeight) -
	skeletonHeadingMarginOffset;
const skeletonHeadingBottomMargin = containerPadding * 0.75 + skeletonHeadingMarginOffset;

interface StyleOpts {
	showTopScrollIndicator?: boolean;
}

export const containerCSS = (
	opts: StyleOpts,
): {
	// When the scroll indicator is always shown we need to add some padding
	// so the spacing between matches what it would be if the indicator was a "block" element.
	// We use margin here so any child absolutely positioned elements are positioned correctly.
	readonly marginTop: 0 | 2;
	readonly marginLeft: 'var(--ds-space-100)';
	readonly marginRight: 'var(--ds-space-100)';
	// Enables child absolutely positioned elements to be positioned relative to this element.
	readonly position: 'relative';
	readonly '& [data-ds--menu--heading-item]': {
		readonly marginBottom: 'var(--ds-space-075)';
		readonly marginTop: 'var(--ds-space-200)';
	};
	readonly '& [data-ds--menu--skeleton-heading-item]': {
		readonly marginTop: number;
		readonly marginBottom: number;
	};
} =>
	({
		// When the scroll indicator is always shown we need to add some padding
		// so the spacing between matches what it would be if the indicator was a "block" element.
		// We use margin here so any child absolutely positioned elements are positioned correctly.
		marginTop: opts.showTopScrollIndicator ? scrollIndicatorHeight : 0,
		marginLeft: token('space.100'),
		marginRight: token('space.100'),
		// Enables child absolutely positioned elements to be positioned relative to this element.
		position: 'relative',

		'& [data-ds--menu--heading-item]': {
			marginBottom: token('space.075'),
			marginTop: token('space.200'),
		},
		'& [data-ds--menu--skeleton-heading-item]': {
			marginTop: skeletonHeadingTopMargin,
			marginBottom: skeletonHeadingBottomMargin,
		},
	}) as const;
