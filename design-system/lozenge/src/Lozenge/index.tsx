/* eslint-disable @atlassian/tangerine/import/entry-points */
/* eslint-disable @atlaskit/design-system/ensure-design-token-usage */
/* eslint-disable @atlaskit/design-system/no-unsafe-design-token-usage */

import React, { CSSProperties, memo, ReactNode } from 'react';

import Text, { TextProps } from '@atlaskit/ds-explorations/text';
import { type BackgroundColor, Box, xcss } from '@atlaskit/primitives';
import { token } from '@atlaskit/tokens';

const baseStyles = xcss({
  display: 'inline-flex',
  borderRadius: 'border.radius',
  position: 'static',
  overflow: 'hidden',
});

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

    const maxWidthIsPc = typeof maxWidth === 'string' && /%$/.test(maxWidth);

    return (
      <Box
        as="span"
        backgroundColor={backgroundColors[appearanceStyle][appearanceType]}
        style={{
          backgroundColor: style?.backgroundColor,
          maxWidth: maxWidthIsPc ? maxWidth : '100%',
        }}
        paddingInline="space.050"
        xcss={baseStyles}
        testId={testId}
      >
        <Text
          fontSize="size.050"
          fontWeight="bold"
          lineHeight="lineHeight.100"
          textTransform="uppercase"
          color={textColors[appearanceStyle][appearanceType]}
          shouldTruncate
          UNSAFE_style={{
            color: style?.color,
            // to negate paddingInline specified on Box above
            maxWidth: maxWidthIsPc
              ? '100%'
              : `calc(${maxWidthValue} - ${token('space.100', '8px')})`,
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
  Record<ThemeAppearance, BackgroundColor>
> = {
  bold: {
    default: 'color.background.neutral.bold',
    inprogress: 'color.background.information.bold',
    moved: 'color.background.warning.bold',
    new: 'color.background.discovery.bold',
    removed: 'color.background.danger.bold',
    success: 'color.background.success.bold',
  },
  subtle: {
    default: 'color.background.neutral',
    inprogress: 'color.background.information',
    moved: 'color.background.warning',
    new: 'color.background.discovery',
    removed: 'color.background.danger',
    success: 'color.background.success',
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
