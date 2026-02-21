/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import {
	type AriaAttributes,
	Children,
	type ElementType,
	type FC,
	forwardRef,
	type ForwardRefExoticComponent,
	Fragment,
	memo,
	type MemoExoticComponent,
	type ReactNode,
	type Ref,
	type RefAttributes,
} from 'react';

import { jsx } from '@compiled/react';

import { cssMap, cx } from '@atlaskit/css';
import { token } from '@atlaskit/tokens';

import Flex, { type FlexProps } from './flex';
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
	space?: FlexProps['gap'];

	/**
	 * Represents the space between rows when content wraps.
	 * Used to override the `space` value in between rows.
	 */
	rowSpace?: FlexProps['rowGap'];

	/**
	 * Renders a separator string between each child. Avoid using `separator="•"` when `as="ul" | "ol" | "dl"` to preserve proper list semantics.
	 */
	separator?: ReactNode;

	/**
	 * Elements to be rendered inside the Inline.
	 */
	children: ReactNode;

	/**
	 * Forwarded ref element.
	 */
	ref?: React.ComponentPropsWithRef<T>['ref'];
} & BasePrimitiveProps &
	AriaAttributes;

const styles = cssMap({
	separator: {
		color: token('color.text.subtle', '#42526E'),
		marginBlock: token('space.0', '0px'),
		marginInline: `${token('space.negative.025', '-2px')}`,
		pointerEvents: 'none',
		userSelect: 'none',
	},
	hug: { flexGrow: 0 },
	fill: {
		width: '100%',
		flexGrow: 1,
	},
});

const Separator: FC<{ children: string }> = ({ children }) => (
	<span css={styles.separator}>{children}</span>
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
const Inline: MemoExoticComponent<
	ForwardRefExoticComponent<Omit<InlineProps<ElementType>, 'ref'> & RefAttributes<any>>
> = memo(
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
				children: rawChildren,
				...ariaAttributes
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

			return (
				<Flex
					{...ariaAttributes}
					as={as}
					role={role}
					alignItems={alignItems}
					justifyContent={spread || alignInline}
					direction="row"
					gap={space}
					rowGap={rowSpace}
					wrap={shouldWrap ? 'wrap' : undefined}
					xcss={cx(grow === 'hug' && styles.hug, grow === 'fill' && styles.fill, xcss)}
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
