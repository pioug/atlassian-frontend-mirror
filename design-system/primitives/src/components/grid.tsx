/* eslint-disable @repo/internal/styles/no-exported-styles */
/** @jsx jsx */
import { ElementType, forwardRef, memo, ReactNode, Ref } from 'react';

import { css, jsx } from '@emotion/react';

import { type Space, spaceStylesMap } from '../xcss/style-maps.partial';
import { parseXcss } from '../xcss/xcss';

import type { BasePrimitiveProps } from './types';

export type GridProps<T extends ElementType = 'div'> = {
  /**
   * The DOM element to render as the Flex. Defaults to `div`.
   */
  as?: 'div' | 'span' | 'ul' | 'ol';

  /**
   * Used to align children along the inline axis.
   */
  justifyContent?: JustifyContent;

  /**
   * Used to align children along the block axis.
   */
  alignItems?: AlignItems;

  /**
   * Represents the space between each column.
   */
  columnGap?: Space;

  /**
   * Represents the space between each child across both axes.
   */
  gap?: Space;

  /**
   * Represents the space between each row.
   */
  rowGap?: Space;

  /**
   * Specifies how auto-placed items get flowed into the grid. CSS `grid-auto-flow`.
   */
  autoFlow?: AutoFlow;

  /**
   * CSS `grid-template-rows`.
   */
  templateRows?: string;

  /**
   * CSS `grid-template-columns`.
   */
  templateColumns?: string;

  /**
   * CSS `grid-template-areas`.
   *
   * Each item in the passed array is a grid row.
   */
  templateAreas?: string[];

  /**
   * Elements to be rendered inside the grid. Required as a grid without children should not be a grid.
   */
  children: ReactNode;

  /**
   * Forwarded ref element
   */
  ref?: React.ComponentPropsWithRef<T>['ref'];
} & BasePrimitiveProps;

export type JustifyContent = keyof typeof justifyContentMap;
export type AlignItems = keyof typeof alignItemsMap;

const justifyContentMap = {
  start: css({ justifyContent: 'start' }),
  center: css({ justifyContent: 'center' }),
  end: css({ justifyContent: 'end' }),
  'space-between': css({ justifyContent: 'space-between' }),
  'space-around': css({ justifyContent: 'space-around' }),
  'space-evenly': css({ justifyContent: 'space-evenly' }),
  stretch: css({ justifyContent: 'stretch' }),
} as const;

const alignItemsMap = {
  start: css({ alignItems: 'start' }),
  center: css({ alignItems: 'center' }),
  baseline: css({ alignItems: 'baseline' }),
  end: css({ alignItems: 'end' }),
} as const;

const baseStyles = css({
  display: 'grid',
  boxSizing: 'border-box',
});

type AutoFlow = keyof typeof gridAutoFlowMap;

const gridAutoFlowMap = {
  row: css({ gridAutoFlow: 'row' }),
  column: css({ gridAutoFlow: 'column' }),
  dense: css({ gridAutoFlow: 'dense' }),
  'row dense': css({ gridAutoFlow: 'row dense' }),
  'column dense': css({ gridAutoFlow: 'column dense' }),
} as const;

/**
 * __Grid__
 *
 * `Grid` is a primitive component that implements the CSS Grid API.
 *
 * - [Examples](https://atlassian.design/components/primitives/grid/examples)
 * - [Code](https://atlassian.design/components/primitives/grid/code)
 *
 * @example
 * ```tsx
 * import { Grid, Box } from '@atlaskit/primitives'
 *
 * const Component = () => (
 *   <Grid gap="space.100" gridColumns="1fr 1fr">
 *     <Box padding="space.100" backgroundColor="neutral"></Box>
 *     <Box padding="space.100" backgroundColor="neutral"></Box>
 *   </Grid>
 * )
 * ```
 */
const Grid = memo(
  forwardRef(
    <T extends ElementType = 'div'>(
      {
        as,
        alignItems,
        justifyContent,
        gap,
        columnGap,
        rowGap,
        children,
        testId,
        autoFlow,
        templateAreas: gridTemplateAreas,
        templateRows: gridTemplateRows,
        templateColumns: gridTemplateColumns,
        xcss,
      }: GridProps<T>,
      ref: Ref<any>,
    ) => {
      const Component = as || 'div';
      const xcssClassName = xcss && parseXcss(xcss);
      const style =
        gridTemplateAreas || gridTemplateColumns || gridTemplateRows
          ? Object.assign(
              {},
              {
                gridTemplateAreas: gridTemplateAreas
                  ? gridTemplateAreas.map(str => `"${str}"`).join('\n')
                  : undefined,
                gridTemplateColumns,
                gridTemplateRows,
              },
            )
          : undefined;

      return (
        <Component
          style={style}
          css={[
            baseStyles,
            gap && spaceStylesMap.gap[gap],
            columnGap && spaceStylesMap.columnGap[columnGap],
            rowGap && spaceStylesMap.rowGap[rowGap],
            alignItems && alignItemsMap[alignItems],
            justifyContent && justifyContentMap[justifyContent],
            autoFlow && gridAutoFlowMap[autoFlow],
            // eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage
            xcssClassName && xcssClassName,
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

Grid.displayName = 'Grid';

export default Grid;
