/** @jsx jsx */

import { css, jsx, SerializedStyles } from '@emotion/react';

import { sizes, WrapperProps } from './constants';
import { Size } from './types';

const CSS_VAR_COLOR = '--logo-color';
const CSS_VAR_FILL = '--logo-fill';

const baseWrapperStyles = css({
  display: 'inline-block',
  position: 'relative',
  color: `var(${CSS_VAR_COLOR})`,
  fill: `var(${CSS_VAR_FILL})`,
  lineHeight: 1,
  userSelect: 'none',
  whiteSpace: 'normal',
  // eslint-disable-next-line @atlaskit/design-system/no-nested-styles
  '> svg': {
    height: '100%',
    fill: 'inherit',
  },
});

const stopColorStyles = css({
  // eslint-disable-next-line @atlaskit/design-system/no-nested-styles
  stop: {
    stopColor: 'currentColor',
  },
});

type SizeStyles = Record<Size, SerializedStyles>;
const sizeStyles = Object.entries(sizes).reduce((acc, [key, val]) => {
  acc[key as Size] = css({
    height: `${val}px`,
  });
  return acc;
}, {} as Partial<SizeStyles>) as SizeStyles;

/**
 * __Wrapper__
 *
 * An internal component used by `@atlaskit/logo` to render logo SVGs with correct styles.
 */
const Wrapper = ({
  label,
  svg,
  size,
  appearance,
  iconGradientStart,
  iconGradientStop,
  iconColor,
  textColor,
  testId: userDefinedTestId,
  ...rest
}: WrapperProps) => {
  const shouldApplyStopColor =
    iconGradientStart === 'inherit' &&
    iconGradientStop === 'inherit' &&
    appearance === undefined;

  const testId = userDefinedTestId && `${userDefinedTestId}--wrapper`;

  return (
    <span
      css={[
        baseWrapperStyles,
        shouldApplyStopColor && stopColorStyles,
        size && sizeStyles[size],
      ]}
      data-testid={testId}
      style={
        {
          [CSS_VAR_COLOR]: iconColor,
          [CSS_VAR_FILL]: textColor,
        } as React.CSSProperties
      }
      aria-label={label ? label : undefined}
      role={label ? 'img' : undefined}
      dangerouslySetInnerHTML={{
        __html: svg,
      }}
      // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
      {...rest}
    />
  );
};

export default Wrapper;
