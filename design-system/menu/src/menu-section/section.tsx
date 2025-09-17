/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { Children, forwardRef, Fragment, type Ref } from 'react';

import { cssMap, jsx } from '@compiled/react';

import { token } from '@atlaskit/tokens';

import HeadingItem from '../menu-item/heading-item';
import type { SectionProps } from '../types';

const itemHeadingTopMargin = 20;
const itemHeadingBottomMargin = 6;
// Skeleton content is slightly shorter than the real content.
// Because of that we slightly increase the top margin to offset this so the
// containing size both real and skeleton always equal approx 30px.
const itemHeadingContentHeight = 16; // Originally headingSizes.h100.lineHeight from '@atlaskit/theme/typography'
const skeletonHeadingHeight = 8;
const skeletonHeadingMarginOffset = 3;
const skeletonHeadingTopMargin =
	itemHeadingTopMargin +
	(itemHeadingContentHeight - skeletonHeadingHeight) -
	skeletonHeadingMarginOffset;
const sectionPaddingTopBottom = 6;

const styles = cssMap({
	root: {
		'&::before, &::after': {
			display: 'block',
			height: sectionPaddingTopBottom,
			content: '""',
		},
		// eslint-disable-next-line @atlaskit/design-system/no-nested-styles, @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
		'[data-ds--menu--heading-item]': {
			marginBlockEnd: itemHeadingBottomMargin,
			marginBlockStart: itemHeadingTopMargin,
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
			'&:first-of-type': {
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
				marginBlockStart: itemHeadingTopMargin - sectionPaddingTopBottom,
			},
		},
		// eslint-disable-next-line @atlaskit/design-system/no-nested-styles, @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
		'[data-ds--menu--skeleton-heading-item]': {
			// We want to move the entire body up by 3px without affecting the height of the skeleton container.
			marginBlockEnd: itemHeadingBottomMargin + skeletonHeadingMarginOffset,
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
			marginBlockStart: skeletonHeadingTopMargin,
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
			'&:first-of-type': {
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
				marginBlockStart: skeletonHeadingTopMargin - sectionPaddingTopBottom,
			},
		},
		'&:focus': {
			// NOTE: Firefox allows elements that have "overflow: auto" to gain focus (as if it had tab-index="0")
			// We have made a deliberate choice to leave this behaviour as is.
			// This makes the outline go inside by 1px so it can actually be displayed
			// else it gets cut off from the overflow: scroll from the parent menu group.
			outlineOffset: -1,
		},
	},

	scrollable: {
		flexShrink: 1,
		overflow: 'auto',
	},
	unscrollable: {
		flexShrink: 0,
	},
	thinSeparator: {
		borderBlockStart: `${token('border.width')} solid var(--ds-menu-seperator-color, ${token('color.border', 'rgba(9, 30, 66, 0.08)')})`,
	},
	noSeparator: {
		// this is to ensure that adjacent sections without separators don't get additional margins.
		// eslint-disable-next-line @atlaskit/design-system/no-nested-styles, @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
		'[data-section] + &': {
			marginBlockStart: -6,
		},
	},
	sideNavSectionHeading: {
		paddingInline: token('space.100', '8px'),
	},
});

/**
 * __Section__
 *
 * A section includes related actions or items in a menu.
 *
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/menu/docs/section)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/menu)
 */
const Section = forwardRef<HTMLElement, SectionProps>(
	(
		{
			children,
			title,
			titleId,
			testId,
			isScrollable,
			hasSeparator,
			id,
			isList = false,
			isSideNavSection = false,
			// Although this isn't defined on props it is available because we've used
			// Spread props below and on the jsx element. To forcibly block usage I've
			// picked it out and supressed the expected type error.
			// @ts-expect-error
			className: UNSAFE_className,
			...rest
		},
		ref,
	) => {
		const content = isList ? (
			<ul
				style={{
					// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
					margin: 0,
					// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
					padding: 0,
				}}
			>
				{Children.map(Children.toArray(children), (child, index) => (
					<li
						// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
						style={{ listStyleType: 'none', margin: 0, padding: 0 }}
						key={index}
					>
						{child}
					</li>
				))}
			</ul>
		) : (
			children
		);

		const childrenMarkup =
			title !== undefined ? (
				<Fragment>
					<HeadingItem
						testId={testId && `${testId}--heading`}
						aria-hidden
						// @ts-expect-error
						// eslint-disable-next-line @atlaskit/design-system/no-unsafe-style-overrides
						css={isSideNavSection && styles.sideNavSectionHeading}
					>
						{title}
					</HeadingItem>
					{content}
				</Fragment>
			) : (
				<Fragment>{content}</Fragment>
			);

		return (
			<div
				{...rest}
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
				className={UNSAFE_className}
				id={id}
				// NOTE: Firefox allows elements that have "overflow: auto" to gain focus (as if it had tab-index="0")
				// We have made a deliberate choice to leave this behaviour as is.
				css={[
					styles.root,
					isScrollable ? styles.scrollable : styles.unscrollable,
					hasSeparator ? styles.thinSeparator : styles.noSeparator,
				]}
				aria-label={title}
				aria-labelledby={titleId}
				data-testid={testId}
				role="group"
				data-section
				ref={ref as Ref<HTMLDivElement>}
			>
				{childrenMarkup}
			</div>
		);
	},
);

export default Section;
