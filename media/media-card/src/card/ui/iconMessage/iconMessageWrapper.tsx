/**@jsx jsx */
import { css, jsx } from '@emotion/react';
import { IconMessageWrapperProps } from './types';
import { keyframes } from '@emotion/react';

import { token } from '@atlaskit/tokens';

const breatheAnimation = keyframes({
  '0%': {
    opacity: 1,
  },
  '50%': {
    opacity: 0.3,
  },
  '100%': {
    opacity: 1,
  },
});

const animatedStyles = css({
  animationName: breatheAnimation,
  animationDuration: '3.5s',
  animationTimingFunction: 'ease-in-out',
  animationIterationCount: 'infinite',
});

const reducedFontStyle = css({ fontSize: '0.7em' });

const baseStyles = css({
  overflow: 'hidden',
  opacity: 1,
  fontWeight: 450,
  color: token('color.text.subtlest', '#7A869A'),
  textAlign: 'center',
  // eslint-disable-next-line @atlaskit/design-system/use-tokens-space
  marginBottom: '-1em', // Needs pixel precision to align the icon at the center of the box
  paddingBlock: token('space.050'),
  paddingInline: token('space.100'),
});

export const IconMessageWrapper = (props: IconMessageWrapperProps) => {
  const { animated, reducedFont } = props;

  return (
    <div
      id="iconMessageWrapper"
      css={[
        baseStyles,
        reducedFont && reducedFontStyle,
        animated && animatedStyles,
      ]}
    >
      {props.children}
    </div>
  );
};
