/* eslint-disable @atlaskit/design-system/ensure-design-token-usage */
/** @jsx jsx */

import { CSSProperties, memo, ReactNode } from 'react';

import { jsx } from '@emotion/core';

import {
  UNSAFE_Box as Box,
  UNSAFE_BoxProps as BoxProps,
  UNSAFE_SPACING_SCALE as SPACING_SCALE,
  UNSAFE_Text as Text,
  UNSAFE_TextProps as TextProps,
} from '@atlaskit/ds-explorations';
import {
  B400,
  B50,
  B500,
  G400,
  G50,
  G500,
  N0,
  N40,
  N500,
  N800,
  P400,
  P50,
  P500,
  R400,
  R50,
  R500,
  Y500,
  Y75,
} from '@atlaskit/theme/colors';

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
    style = {},
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
        paddingInline="sp-50"
        position="static"
        testId={testId}
        UNSAFE_style={{
          backgroundColor: style.backgroundColor,
          verticalAlign: 'baseline',
          maxWidth: '100%',
        }}
      >
        <Text
          as="span"
          fontSize="11px"
          fontWeight="700"
          lineHeight="16px"
          textTransform="uppercase"
          color={textColors[appearanceStyle][appearanceType]}
          shouldTruncate
          UNSAFE_style={{
            color: style.color,
            width: '100%',
            maxWidth: `calc(${maxWidthValue} - ${SPACING_SCALE['sp-100']}px)`, // to negate paddingInline specified on Box above
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
    default: ['neutral.bold', N500],
    inprogress: ['information.bold', B400],
    moved: ['warning.bold', Y500],
    new: ['discovery.bold', P400],
    removed: ['danger.bold', R400],
    success: ['success.bold', G400],
  },
  subtle: {
    default: ['neutral', N40],
    inprogress: ['information', B50],
    moved: ['warning', Y75],
    new: ['discovery', P50],
    removed: ['danger', R50],
    success: ['success', G50],
  },
};

const textColors: Record<
  'bold' | 'subtle',
  Record<ThemeAppearance, TextProps['color']>
> = {
  bold: {
    default: ['inverse', N0],
    inprogress: ['inverse', N0],
    moved: ['warning.inverse', N800],
    new: ['inverse', N0],
    removed: ['inverse', N0],
    success: ['inverse', N0],
  },
  subtle: {
    default: ['color.text', N500],
    inprogress: ['information', B500],
    moved: ['warning', N800],
    new: ['discovery', P500],
    removed: ['danger', R500],
    success: ['success', G500],
  },
};
