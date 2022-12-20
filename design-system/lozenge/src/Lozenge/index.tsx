/* eslint-disable @atlassian/tangerine/import/entry-points */
/* eslint-disable @atlaskit/design-system/ensure-design-token-usage */

import React, { CSSProperties, memo, ReactNode } from 'react';

import Box, { BoxProps } from '@atlaskit/ds-explorations/box';
import Text, { TextProps } from '@atlaskit/ds-explorations/text';
import { token } from '@atlaskit/tokens';

export type ThemeAppearance =
  | 'default'
  | 'inprogress'
  | 'moved'
  | 'new'
  | 'removed'
  | 'success';

export interface LozengeProps {
  /**
   * The appearance type.
   */
  appearance?: ThemeAppearance;

  /**
   * Elements to be rendered inside the lozenge. This should ideally be just a word or two.
   */
  children?: ReactNode;

  /**
   * Determines whether to apply the bold style or not.
   */
  isBold?: boolean;

  /**
   * max-width of lozenge container. Default to 200px.
   */
  maxWidth?: number | string;

  /**
   * Style customization to apply to the badge. Only `backgroundColor` and `color` are supported.
   */
  style?: Pick<CSSProperties, 'backgroundColor' | 'color'>;

  /**
   * A `testId` prop is provided for specified elements, which is a unique
   * string that appears as a data attribute `data-testid` in the rendered code,
   * serving as a hook for automated tests
   */
  testId?: string;
}

/**
 * __Lozenge__
 *
 * A lozenge is a visual indicator used to highlight an item's status for quick recognition.
 *
 * - [Examples](https://atlassian.design/components/lozenge/examples)
 * - [Code](https://atlassian.design/components/lozenge/code)
 * - [Usage](https://atlassian.design/components/lozenge/usage)
 */
const Lozenge = memo(
  ({
    children,
    testId,
    isBold = false,
    appearance = 'default',
    maxWidth = 200,
    style,
  }: LozengeProps) => {
    const appearanceStyle = isBold ? 'bold' : 'subtle';
    const appearanceType =
      appearance in backgroundColors[appearanceStyle] ? appearance : 'default';
    const maxWidthValue =
      typeof maxWidth === 'string' ? maxWidth : `${maxWidth}px`;

    return (
      <Box
        as="span"
        display="inlineFlex"
        backgroundColor={backgroundColors[appearanceStyle][appearanceType]}
        borderRadius="normal"
        paddingInline="scale.050"
        position="static"
        testId={testId}
        overflow="hidden"
        UNSAFE_style={{
          backgroundColor: style?.backgroundColor,
          maxWidth: '100%',
        }}
      >
        <Text
          fontSize="11px"
          fontWeight="700"
          lineHeight="16px"
          textTransform="uppercase"
          color={textColors[appearanceStyle][appearanceType]}
          shouldTruncate
          UNSAFE_style={{
            color: style?.color,
            // to negate paddingInline specified on Box above
            maxWidth: `calc(${maxWidthValue} - ${token('space.100', '8px')})`,
          }}
          testId={testId && `${testId}--text`}
        >
          {children}
        </Text>
      </Box>
    );
  },
);

Lozenge.displayName = 'Lozenge';

export default Lozenge;

// Lozenge colors
const backgroundColors: Record<
  'bold' | 'subtle',
  Record<ThemeAppearance, BoxProps['backgroundColor']>
> = {
  bold: {
    default: 'neutral.bold',
    inprogress: 'information.bold',
    moved: 'warning.bold',
    new: 'discovery.bold',
    removed: 'danger.bold',
    success: 'success.bold',
  },
  subtle: {
    default: 'neutral',
    inprogress: 'information',
    moved: 'warning',
    new: 'discovery',
    removed: 'danger',
    success: 'success',
  },
};

const textColors: Record<
  'bold' | 'subtle',
  Record<ThemeAppearance, TextProps['color']>
> = {
  bold: {
    default: 'inverse',
    inprogress: 'inverse',
    moved: 'warning.inverse',
    new: 'inverse',
    removed: 'inverse',
    success: 'inverse',
  },
  subtle: {
    default: 'subtle',
    inprogress: 'information',
    moved: 'warning',
    new: 'discovery',
    removed: 'danger',
    success: 'success',
  },
};
