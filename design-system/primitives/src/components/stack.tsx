/* eslint-disable @repo/internal/styles/no-exported-styles */
/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { type ElementType, forwardRef, memo, type ReactNode, type Ref } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';

import { type Space } from '../xcss/style-maps.partial';
import { type XCSS, xcss } from '../xcss/xcss';

import Flex from './flex';
import type { AlignBlock, AlignInline, BasePrimitiveProps, Grow, Spread } from './types';

export type StackProps<T extends ElementType = 'div'> = {
	/**
	 * The DOM element to render as the Stack. Defaults to `div`.
	 */
	as?: 'div' | 'span' | 'ul' | 'ol';
	/**
	 * Used to align children along the block axis (typically vertical).
	 */
	alignBlock?: Exclude<AlignBlock, 'baseline'>;

	/**
	 * Used to align children along the inline axis (typically horizontal).
	 */
	alignInline?: AlignInline;

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
	 * Elements to be rendered inside the Stack.
	 */
	children: ReactNode;

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

/**
 * __Stack__
 *
 * Stack is a primitive component based on flexbox that manages the block layout of direct children.
 *
 * @example
 * ```tsx
 *  <Stack>
 *    <Box padding="space.100" backgroundColor="neutral"></Box>
 *    <Box padding="space.100" backgroundColor="neutral"></Box>
 *  </Stack>
 * ```
 *
 */
const Stack = memo(
	forwardRef(
		<T extends ElementType = 'div'>(
			{
				as,
				alignInline: alignItems,
				alignBlock = 'stretch',
				spread,
				grow,
				space,
				children,
				testId,
				xcss,
				role,
			}: StackProps<T>,
			ref: Ref<any>,
		) => {
			const justifyContent = spread || alignBlock;

			// We're type coercing this as Compiled styles in an array isn't supported by the types
			// But the runtime accepts it none-the-wiser. We can remove this entire block and replace
			// it with cx(defaultStyles, focusRingStyles, xcssStyles) when we've moved away from Emotion.
			const styles = (
				grow ? [flexGrowMap[grow], ...(Array.isArray(xcss) ? xcss : [xcss])] : xcss
			) as XCSS[];

			return (
				<Flex
					as={as}
					role={role}
					gap={space}
					direction="column"
					alignItems={alignItems}
					justifyContent={justifyContent}
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

Stack.displayName = 'Stack';

export default Stack;
