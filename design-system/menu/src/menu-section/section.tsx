/* eslint-disable @atlaskit/design-system/ensure-design-token-usage, @atlaskit/design-system/ensure-design-token-usage/preview */
/** @jsx jsx */
import { Children, forwardRef, Fragment, type Ref } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';

import { propDeprecationWarning } from '@atlaskit/ds-lib/deprecation-warning';
import { getBooleanFF } from '@atlaskit/platform-feature-flags';
import { N30A } from '@atlaskit/theme/colors';
// eslint-disable-next-line @atlaskit/design-system/no-deprecated-imports
import { gridSize as gridSizeFn } from '@atlaskit/theme/constants';
import { headingSizes } from '@atlaskit/theme/typography';
import { token } from '@atlaskit/tokens';

import HeadingItem from '../menu-item/heading-item';
import type { SectionProps } from '../types';

const gridSize = gridSizeFn();
const itemHeadingTopMargin = gridSize * 2.5;
const itemHeadingBottomMargin = gridSize * 0.75;
// Skeleton content is slightly shorter than the real content.
// Because of that we slightly increase the top margin to offset this so the
// containing size both real and skeleton always equal approx 30px.
const itemHeadingContentHeight = headingSizes.h100.lineHeight;
const skeletonHeadingHeight = gridSize;
const skeletonHeadingMarginOffset = 3;
const skeletonHeadingTopMargin =
	itemHeadingTopMargin +
	(itemHeadingContentHeight - skeletonHeadingHeight) -
	skeletonHeadingMarginOffset;
// We want to move the entire body up by 3px without affecting the height of the skeleton container.
const skeletonHeadingBottomMargin = itemHeadingBottomMargin + skeletonHeadingMarginOffset;
const sectionPaddingTopBottom = gridSize * 0.75;
const VAR_SEPARATOR_COLOR = '--ds-menu-seperator-color';

const sectionStyles = css({
	'&::before, &::after': {
		display: 'block',
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
		height: sectionPaddingTopBottom,
		content: '""',
	},
	// eslint-disable-next-line @atlaskit/design-system/no-nested-styles, @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'& [data-ds--menu--heading-item]': {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
		marginBlockEnd: itemHeadingBottomMargin,
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
		marginBlockStart: itemHeadingTopMargin,
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
		'&:first-of-type': {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
			marginBlockStart: itemHeadingTopMargin - sectionPaddingTopBottom,
		},
	},
	// eslint-disable-next-line @atlaskit/design-system/no-nested-styles, @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'& [data-ds--menu--skeleton-heading-item]': {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
		marginBlockEnd: skeletonHeadingBottomMargin,
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
});

const scrollableStyles = css({
	flexShrink: 1,
	overflow: 'auto',
});

const unscrollableStyles = css({
	flexShrink: 0,
});

const thickSeparatorStyles = css({
	borderBlockStart: `2px solid var(${VAR_SEPARATOR_COLOR}, ${token('color.border', N30A)})`,
});
const thinSeparatorStyles = css({
	borderBlockStart: `1px solid var(${VAR_SEPARATOR_COLOR}, ${token('color.border', N30A)})`,
});

const noSeparatorStyles = css({
	// this is to ensure that adjacent sections without separators don't get additional margins.
	// eslint-disable-next-line @atlaskit/design-system/no-nested-styles, @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
	'[data-section] + &': {
		marginBlockStart: -6,
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
			overrides,
			title,
			titleId,
			testId,
			isScrollable,
			hasSeparator,
			id,
			isList = false,
			// Although this isn't defined on props it is available because we've used
			// Spread props below and on the jsx element. To forcibly block usage I've
			// picked it out and supressed the expected type error.
			// @ts-expect-error
			className: UNSAFE_className,
			...rest
		}: // Type needed on props to extract types with extract react types.
		SectionProps,
		ref,
	) => {
		propDeprecationWarning(
			process.env._PACKAGE_NAME_ || '',
			'overrides',
			overrides !== undefined,
			'', // TODO: Create DAC post when primitives/xcss are available as alternatives
		);

		const UNSAFE_headingOverrides = getBooleanFF(
			'platform.design-system-team.unsafe-overrides-killswitch_c8j9m',
		)
			? undefined
			: overrides && overrides.HeadingItem && overrides.HeadingItem.cssFn;

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
						// eslint-disable-next-line @repo/internal/react/no-unsafe-overrides
						cssFn={UNSAFE_headingOverrides}
						testId={testId && `${testId}--heading`}
						aria-hidden
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
				className={
					getBooleanFF('platform.design-system-team.unsafe-overrides-killswitch_c8j9m')
						? undefined
						: UNSAFE_className
				}
				id={id}
				// NOTE: Firefox allows elements that have "overflow: auto" to gain focus (as if it had tab-index="0")
				// We have made a deliberate choice to leave this behaviour as is.
				css={[
					sectionStyles,
					isScrollable ? scrollableStyles : unscrollableStyles,
					hasSeparator
						? // eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
							getBooleanFF('platform.design-system-team.section-1px-seperator-borders')
							? thinSeparatorStyles
							: thickSeparatorStyles
						: noSeparatorStyles,
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
