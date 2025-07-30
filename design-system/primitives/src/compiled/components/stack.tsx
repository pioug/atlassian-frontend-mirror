/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import {
	type AriaAttributes,
	type ElementType,
	forwardRef,
	memo,
	type ReactNode,
	type Ref,
} from 'react';

import { jsx } from '@compiled/react';

import { cssMap, cx } from '@atlaskit/css';

import Flex, { type FlexProps } from './flex';
import type { AlignBlock, AlignInline, BasePrimitiveProps, Grow, Spread } from './types';

export type StackProps<T extends ElementType = 'div'> = {
	/**
	 * The DOM element to render as the Stack. Defaults to `div`.
	 */
	as?: 'div' | 'span' | 'ul' | 'ol' | 'dl';
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
	space?: FlexProps['gap'];

	/**
	 * Elements to be rendered inside the Stack.
	 */
	children: ReactNode;

	/**
	 * Forwarded ref element.
	 */
	ref?: React.ComponentPropsWithRef<T>['ref'];
} & BasePrimitiveProps &
	AriaAttributes;

const styles = cssMap({
	hug: { flexGrow: 0 },
	fill: {
		width: '100%',
		flexGrow: 1,
	},
});

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
				...ariaAttributes
			}: StackProps<T>,
			ref: Ref<any>,
		) => {
			return (
				<Flex
					{...ariaAttributes}
					as={as}
					role={role}
					gap={space}
					direction="column"
					alignItems={alignItems}
					justifyContent={spread || alignBlock}
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

Stack.displayName = 'Stack';

export default Stack;
