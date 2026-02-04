/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import {
	type AriaAttributes,
	type ElementType,
	forwardRef,
	type ForwardRefExoticComponent,
	memo,
	type MemoExoticComponent,
	type ReactNode,
	type Ref,
    type RefAttributes,
} from 'react';

import { jsx } from '@compiled/react';

import { cssMap } from '@atlaskit/css';
import { token } from '@atlaskit/tokens';

import type {
	AlignItems,
	BasePrimitiveProps,
	Direction,
	GapToken,
	JustifyContent,
	Wrap,
} from './types';

export type FlexProps<T extends ElementType = 'div'> = {
	/**
	 * The DOM element to render as the Flex. Defaults to `div`.
	 */
	as?: 'div' | 'span' | 'ul' | 'ol' | 'li' | 'dl';

	/**
	 * Used to align children along the main axis.
	 */
	justifyContent?: JustifyContent;

	/**
	 * Used to align children along the cross axis.
	 */
	alignItems?: AlignItems;

	/**
	 * Represents the space between each child.
	 */
	columnGap?: GapToken;

	/**
	 * Represents the space between each child.
	 */
	gap?: GapToken;

	/**
	 * Represents the space between each child.
	 */
	rowGap?: GapToken;

	/**
	 * Represents the flex direction property of CSS flexbox.
	 */
	direction?: Direction;

	/**
	 * Represents the flex wrap property of CSS flexbox.
	 */
	wrap?: Wrap;

	/**
	 * Elements to be rendered inside the Flex.
	 */
	children: ReactNode;

	/**
	 * Forwarded ref element.
	 */
	ref?: React.ComponentPropsWithRef<T>['ref'];
} & BasePrimitiveProps &
	AriaAttributes;

const rowGapMap = cssMap({
	'space.0': { rowGap: token('space.0', '0px') },
	'space.025': { rowGap: token('space.025', '2px') },
	'space.050': { rowGap: token('space.050', '4px') },
	'space.075': { rowGap: token('space.075', '6px') },
	'space.100': { rowGap: token('space.100', '8px') },
	'space.150': { rowGap: token('space.150', '12px') },
	'space.200': { rowGap: token('space.200', '16px') },
	'space.250': { rowGap: token('space.250', '20px') },
	'space.300': { rowGap: token('space.300', '24px') },
	'space.400': { rowGap: token('space.400', '32px') },
	'space.500': { rowGap: token('space.500', '40px') },
	'space.600': { rowGap: token('space.600', '48px') },
	'space.800': { rowGap: token('space.800', '64px') },
	'space.1000': { rowGap: token('space.1000', '80px') },
});

const columnGapMap = cssMap({
	'space.0': { columnGap: token('space.0', '0px') },
	'space.025': { columnGap: token('space.025', '2px') },
	'space.050': { columnGap: token('space.050', '4px') },
	'space.075': { columnGap: token('space.075', '6px') },
	'space.100': { columnGap: token('space.100', '8px') },
	'space.150': { columnGap: token('space.150', '12px') },
	'space.200': { columnGap: token('space.200', '16px') },
	'space.250': { columnGap: token('space.250', '20px') },
	'space.300': { columnGap: token('space.300', '24px') },
	'space.400': { columnGap: token('space.400', '32px') },
	'space.500': { columnGap: token('space.500', '40px') },
	'space.600': { columnGap: token('space.600', '48px') },
	'space.800': { columnGap: token('space.800', '64px') },
	'space.1000': { columnGap: token('space.1000', '80px') },
});

const justifyContentMap = cssMap({
	start: { justifyContent: 'start' },
	center: { justifyContent: 'center' },
	end: { justifyContent: 'end' },
	'space-between': { justifyContent: 'space-between' },
	'space-around': { justifyContent: 'space-around' },
	'space-evenly': { justifyContent: 'space-evenly' },
	stretch: { justifyContent: 'stretch' },
});

const flexDirectionMap = cssMap({
	column: { flexDirection: 'column' },
	row: { flexDirection: 'row' },
});

const flexWrapMap = cssMap({
	wrap: { flexWrap: 'wrap' },
	nowrap: { flexWrap: 'nowrap' },
});

const alignItemsMap = cssMap({
	start: { alignItems: 'start' },
	center: { alignItems: 'center' },
	baseline: { alignItems: 'baseline' },
	end: { alignItems: 'end' },
	stretch: { alignItems: 'stretch' },
});

const styles = cssMap({
	root: {
		display: 'flex',
		boxSizing: 'border-box',
	},
});

/**
 * __Flex__
 *
 * `Flex` is a primitive component that implements the CSS Flexbox API.
 *
 * - [Examples](https://atlassian.design/components/primitives/flex/examples)
 * - [Code](https://atlassian.design/components/primitives/flex/code)
 *
 * @example
 * ```tsx
 * // eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
 * import { Flex, Box } from '@atlaskit/primitives'
 *
 * const Component = () => (
 *   <Flex direction="column">
 *     <Box padding="space.100" backgroundColor="neutral"></Box>
 *     <Box padding="space.100" backgroundColor="neutral"></Box>
 *   </Flex>
 * )
 * ```
 */
const Flex: MemoExoticComponent<ForwardRefExoticComponent<Omit<FlexProps<ElementType>, "ref"> & RefAttributes<any>>> = memo(
	forwardRef(
		<T extends ElementType = 'div'>(
			{
				as: Component = 'div',
				role,
				alignItems,
				justifyContent,
				gap,
				columnGap,
				rowGap,
				children,
				testId,
				direction,
				wrap,
				xcss,
				...ariaAttributes
			}: FlexProps<T>,
			ref: Ref<any>,
		) => {
			return (
				<Component
					{...ariaAttributes}
					role={role}
					className={xcss}
					css={[
						styles.root,
						// NOTE: "columnGap" or "rowGap" must override "gap"
						gap && columnGapMap[gap],
						columnGap && columnGapMap[columnGap],
						gap && rowGapMap[gap],
						rowGap && rowGapMap[rowGap],
						alignItems && alignItemsMap[alignItems],
						direction && flexDirectionMap[direction],
						justifyContent && justifyContentMap[justifyContent],
						wrap && flexWrapMap[wrap],
					]}
					data-testid={testId}
					ref={ref}
				>
					{children}
				</Component>
			);
		},
	),
);

Flex.displayName = 'Flex';

export default Flex;
