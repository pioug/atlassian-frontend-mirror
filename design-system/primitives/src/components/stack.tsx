/* eslint-disable @repo/internal/styles/no-exported-styles */
/** @jsx jsx */
import { ElementType, forwardRef, memo, ReactNode, Ref } from 'react';

import { jsx } from '@emotion/react';

import { type Space } from '../xcss/style-maps.partial';
import { xcss } from '../xcss/xcss';

import Flex from './flex';
import type {
  AlignBlock,
  AlignInline,
  BasePrimitiveProps,
  Grow,
  Spread,
} from './types';

export type StackProps<T extends ElementType = 'div'> = {
  /**
   * The DOM element to render as the Stack. Defaults to `div`.
   */
  as?: 'div' | 'span' | 'ul' | 'ol';
  /**
   * Used to align children along the main axis.
   */
  alignBlock?: Exclude<AlignBlock, 'baseline'>;

  /**
   * Used to align children along the cross axis.
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
   * Forwarded ref element
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
      }: StackProps<T>,
      ref: Ref<any>,
    ) => {
      const justifyContent = spread || alignBlock;

      return (
        <Flex
          as={as}
          gap={space}
          direction="column"
          alignItems={alignItems}
          justifyContent={justifyContent}
          xcss={
            grow
              ? [flexGrowMap[grow], ...(Array.isArray(xcss) ? xcss : [xcss])]
              : // eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage
                xcss
          }
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
