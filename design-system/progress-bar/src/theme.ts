import { keyframes } from '@emotion/core';

import { N40A, N500 } from '@atlaskit/theme/colors';
import { createTheme } from '@atlaskit/theme/components';

import { ThemeProps, ThemeTokens } from './types';

const increasingBarAnimation = keyframes`
  from { left: -5%; width: 5%; }
  to { left: 130%; width: 100%;}
`;
const decreasingBarAnimation = keyframes`
  from { left: -80%; width: 80%; }
  to { left: 110%; width: 10%;}
`;

export const Theme = createTheme<ThemeTokens, ThemeProps>((props) => ({
  container: {
    background: N40A,
    borderRadius: 3,
    height: 6,
    overflow: 'hidden',
    position: 'relative',
    width: `100%`,
  },
  bar: {
    borderRadius: 3,
    display: 'block',
    height: 6,
    position: 'absolute',
    background: N500,
  },
  determinateBar: {
    transition: 'width 0.2s',
    width: `${Number(props.value) * 100}%`,
  },
  increasingBar: {
    animation: `${increasingBarAnimation} 2s infinite`,
  },
  decreasingBar: {
    animation: `${decreasingBarAnimation} 2s 0.5s infinite`,
  },
}));
