/**@jsx jsx */
import { jsx } from '@emotion/react';
import { IconMessageWrapperProps } from './types';
import { keyframes } from '@emotion/react';
import { Box, xcss } from '@atlaskit/primitives';

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

const animatedStyles = xcss({
  animationName: breatheAnimation,
  animationDuration: '3.5s',
  animationTimingFunction: 'ease-in-out',
  animationIterationCount: 'infinite',
});

const reducedFontStyle = xcss({ fontSize: '0.7em' });

const baseStyles = xcss({
  overflow: 'hidden',
  opacity: 1,
  fontWeight: 450,
  color: 'color.text.subtlest',
  textAlign: 'center',
  // eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
  marginBottom: '-1em', // Needs pixel precision to align the icon at the center of the box
  paddingBlock: 'space.050',
  paddingInline: 'space.100',
});

export const IconMessageWrapper = (props: IconMessageWrapperProps) => {
  const { animated, reducedFont } = props;

  return (
    <Box
      id="iconMessageWrapper"
      xcss={[
        baseStyles,
        reducedFont && reducedFontStyle,
        animated && animatedStyles,
      ]}
    >
      {props.children}
    </Box>
  );
};
