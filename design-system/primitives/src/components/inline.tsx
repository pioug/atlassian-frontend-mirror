/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, {
	Children,
	type ElementType,
	type FC,
	forwardRef,
	Fragment,
	memo,
	type ReactNode,
	type Ref,
} from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';

import { token } from '@atlaskit/tokens';

import { type Space } from '../xcss/style-maps.partial';
import { type XCSS, xcss } from '../xcss/xcss';

import Flex from './flex';
import type { AlignBlock, AlignInline, BasePrimitiveProps, Grow, Spread } from './types';

export type InlineProps<T extends ElementType = 'div'> = {
	/**
	 * The DOM element to render as the Inline. Defaults to `div`.
	 */
	as?: 'div' | 'span' | 'ul' | 'ol' | 'li' | 'dl';
	/**
	 * Used to align children along the block axis (typically vertical).
	 */
	alignBlock?: AlignBlock;

	/**
	 * Used to align children along the inline axis (typically horizontal).
	 */
	alignInline?: AlignInline;

	/**
	 * Used to set whether children are forced onto one line or will wrap onto multiple lines.
	 */
	shouldWrap?: boolean;

	/**
	 * Used to distribute the children along the main axis.
	 */
	spread?: Spread;

	/**
	 * Used to set whether the container should grow to fill the available space.
	 */
	grow?: Grow;

	/**
	 * Represents the space between each child.
	 */
	space?: Space;

	/**
	 * Represents the space between rows when content wraps.
	 * Used to override the `space` value in between rows.
	 */
	rowSpace?: Space;

	/**
	 * Renders a separator string between each child. Avoid using `separator="•"` when `as="ul" | "ol" | "dl"` to preserve proper list semantics.
	 */
	separator?: React.ReactNode;

	/**
	 * Elements to be rendered inside the Inline.
	 */
	children: ReactNode;

	/**
	 * The [HTML `id` attribute](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/id).
	 */
	id?: string;

	/**
	 * Forwarded ref element.
	 */
	ref?: React.ComponentPropsWithRef<T>['ref'];
} & BasePrimitiveProps;

const flexGrowMap = {
	hug: xcss({ flexGrow: 0 }),
	fill: xcss({
		width: '100%',
		flexGrow: 1,
	}),
};

const separatorStyles = css({
	color: token('color.text.subtle', '#42526E'),
	marginBlock: token('space.0', '0px'),
	marginInline: `${token('space.negative.025', '-2px')}`,
	pointerEvents: 'none',
	userSelect: 'none',
});

const Separator: FC<{ children: string }> = ({ children }) => (
	<span css={separatorStyles}>{children}</span>
);

/**
 * __Inline__
 *
 * Inline is a primitive component based on CSS Flexbox that manages the horizontal layout of direct children.
 *
 * @example
 * ```tsx
 *  <Inline>
 *    <Box padding="space.100" backgroundColor="neutral"></Box>
 *    <Box padding="space.100" backgroundColor="neutral"></Box>
 *  </Inline>
 * ```
 *
 */
const Inline: React.MemoExoticComponent<React.ForwardRefExoticComponent<Omit<InlineProps<React.ElementType>, "ref"> & React.RefAttributes<any>>> = memo(
	forwardRef(
		<T extends ElementType = 'div'>(
			{
				as,
				alignInline,
				alignBlock: alignItems = 'start',
				shouldWrap = false,
				spread,
				grow,
				space,
				rowSpace,
				separator,
				xcss,
				testId,
				role,
				id,
				children: rawChildren,
			}: InlineProps<T>,
			ref: Ref<any>,
		) => {
			const separatorComponent =
				typeof separator === 'string' ? <Separator>{separator}</Separator> : separator;
			const children = separatorComponent
				? Children.toArray(rawChildren)
						.filter(Boolean)
						.map((child, index) => {
							return (
								<Fragment key={index}>
									{separator && index > 0 ? separatorComponent : null}
									{child}
								</Fragment>
							);
						})
				: rawChildren;
			const justifyContent = spread || alignInline;

			// We're type coercing this as Compiled styles in an array isn't supported by the types
			// But the runtime accepts it none-the-wiser. We can remove this entire block and replace
			// it with cx(defaultStyles, focusRingStyles, xcssStyles) when we've moved away from Emotion.
			const styles = (
				grow ? [flexGrowMap[grow], ...(Array.isArray(xcss) ? xcss : [xcss])] : xcss
			) as XCSS[];

			return (
				<Flex
					id={id}
					as={as}
					role={role}
					alignItems={alignItems}
					justifyContent={justifyContent}
					direction="row"
					gap={space}
					rowGap={rowSpace}
					wrap={shouldWrap ? 'wrap' : undefined}
					// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage
					xcss={styles}
					testId={testId}
					ref={ref}
				>
					{children}
				</Flex>
			);
		},
	),
);

Inline.displayName = 'Inline';

export default Inline;
