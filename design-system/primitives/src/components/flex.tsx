/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { type ElementType, forwardRef, memo, type ReactNode, type Ref } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';

import { type Space, spaceStylesMap } from '../xcss/style-maps.partial';
import { parseXcss } from '../xcss/xcss';

import type { BasePrimitiveProps } from './types';

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
	columnGap?: Space;

	/**
	 * Represents the space between each child.
	 */
	gap?: Space;

	/**
	 * Represents the space between each child.
	 */
	rowGap?: Space;

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
	 * The [HTML `id` attribute](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/id).
	 */
	id?: string;

	/**
	 * Forwarded ref element.
	 */
	ref?: React.ComponentPropsWithRef<T>['ref'];
} & BasePrimitiveProps;

type AlignItems = keyof typeof alignItemsMap;
type JustifyContent = keyof typeof justifyContentMap;
type Direction = keyof typeof flexDirectionMap;
type Wrap = keyof typeof flexWrapMap;

const justifyContentMap = {
	start: css({ justifyContent: 'start' }),
	center: css({ justifyContent: 'center' }),
	end: css({ justifyContent: 'end' }),
	'space-between': css({ justifyContent: 'space-between' }),
	'space-around': css({ justifyContent: 'space-around' }),
	'space-evenly': css({ justifyContent: 'space-evenly' }),
	stretch: css({ justifyContent: 'stretch' }),
} as const;

const flexDirectionMap = {
	column: css({ flexDirection: 'column' }),
	row: css({ flexDirection: 'row' }),
} as const;

const flexWrapMap = {
	wrap: css({ flexWrap: 'wrap' }),
	nowrap: css({ flexWrap: 'nowrap' }),
} as const;

const alignItemsMap = {
	start: css({ alignItems: 'start' }),
	center: css({ alignItems: 'center' }),
	baseline: css({ alignItems: 'baseline' }),
	end: css({ alignItems: 'end' }),
	stretch: css({ alignItems: 'stretch' }),
} as const;

const baseStyles = css({
	display: 'flex',
	boxSizing: 'border-box',
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
const Flex = memo(
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
				id,
			}: FlexProps<T>,
			ref: Ref<any>,
		) => {
			const resolvedStyles = parseXcss(xcss);

			return (
				<Component
					id={id}
					role={role}
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
					className={resolvedStyles.static}
					css={[
						baseStyles,
						// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
						gap && spaceStylesMap.gap[gap],
						// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
						columnGap && spaceStylesMap.columnGap[columnGap],
						// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
						rowGap && spaceStylesMap.rowGap[rowGap],
						alignItems && alignItemsMap[alignItems],
						direction && flexDirectionMap[direction],
						justifyContent && justifyContentMap[justifyContent],
						wrap && flexWrapMap[wrap],
						resolvedStyles.emotion,
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
