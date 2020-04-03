import styled, { css, keyframes } from 'styled-components';
import { themed } from '@atlaskit/theme/components';
import { N500, N0 } from '@atlaskit/theme/colors';
import { SpinnerPhases } from '../types';
import { SIZES_MAP } from './constants';

type StyleParams = {
  invertColor: boolean;
  phase: SpinnerPhases;
  size: number;
};

const getStrokeWidth = (size: number) => Math.round(size / 10);

const getStrokeCircumference = (size: number) => {
  const strokeWidth = getStrokeWidth(size);
  const strokeRadius = size / 2 - strokeWidth / 2;
  return Math.PI * strokeRadius * 2;
};

/* Define keyframes statically to prevent a perfomance issue in styled components v1 where the keyframes function
 * does not cache previous values resulting in each spinner injecting the same keyframe definition
 * in the DOM.
 * This can be reverted to dynamic keyframes when we upgrade to styled components v2
 */
const keyframeNames: { [key: string]: string } = {
  noop: keyframes`
    from { opacity: 0; }
    to { opacity: 0; }
  `,
  rotate: keyframes`
    to { transform: rotate(360deg); }
  `,
  enterOpacity: keyframes`
    from { opacity: 0; }
    to { opacity: 1; }
  `,
  smallEnterStroke: keyframes`
    from { stroke-dashoffset: ${getStrokeCircumference(SIZES_MAP.small)}px; }
    to { stroke-dashoffset: ${getStrokeCircumference(SIZES_MAP.small) *
      0.8}px; }
  `,
  mediumEnterStroke: keyframes`
    from { stroke-dashoffset: ${getStrokeCircumference(SIZES_MAP.medium)}px; }
    to { stroke-dashoffset: ${getStrokeCircumference(SIZES_MAP.medium) *
      0.8}px; }
  `,
  largeEnterStroke: keyframes`
    from { stroke-dashoffset: ${getStrokeCircumference(SIZES_MAP.large)}px; }
    to { stroke-dashoffset: ${getStrokeCircumference(SIZES_MAP.large) *
      0.8}px; }
  `,
  xlargeEnterStroke: keyframes`
    from { stroke-dashoffset: ${getStrokeCircumference(SIZES_MAP.xlarge)}px; }
    to { stroke-dashoffset: ${getStrokeCircumference(SIZES_MAP.xlarge) *
      0.8}px; }
  `,
};

/* If a standard size is used, we can use one of our statically defined keyframes, otherwise
 * we're forced to dynamically create the keyframe and incur a performance cost.
 */
const getEnterStrokeKeyframe = (size: number) => {
  const standardSizeName = Object.keys(SIZES_MAP).find(
    sizeName => size === SIZES_MAP[sizeName],
  );
  if (standardSizeName) {
    return keyframeNames[`${standardSizeName}EnterStroke`];
  }

  const circumference = getStrokeCircumference(size);
  return keyframes`
    from { stroke-dashoffset: ${circumference}px; }
    to { stroke-dashoffset: ${circumference * 0.8}px; }
  `;
};

const spinnerColor = themed({ light: N500, dark: N0 });
const spinnerColorInverted = themed({ light: N0, dark: N0 });

interface GetStrokeColorProps {
  invertColor?: boolean;
}
export const getStrokeColor = ({
  invertColor,
  ...props
}: GetStrokeColorProps): string | number =>
  invertColor ? spinnerColorInverted(props) : spinnerColor(props);

export const svgStyles = css`
  ${(props: StyleParams) => {
    const circumference = getStrokeCircumference(props.size);

    const animation = (animProps: {
      size: number;
      phase: SpinnerPhases;
      invertColor: boolean;
    }) => {
      const baseAnimation = '0.86s cubic-bezier(0.4, 0.15, 0.6, 0.85) infinite';
      if (animProps.phase === 'ENTER') {
        return css`
          animation: ${baseAnimation} ${keyframeNames.rotate},
            0.8s ease-in-out ${getEnterStrokeKeyframe(animProps.size)},
            0.2s ease-in-out ${keyframeNames.enterOpacity};
        `;
      }
      return css`
        animation: ${baseAnimation} ${keyframeNames.rotate};
      `;
    };

    return css`
      ${animation}
      fill: none;
      stroke: ${getStrokeColor};
      stroke-dasharray: ${circumference}px;
      stroke-dashoffset: ${circumference * 0.8}px;
      stroke-linecap: round;
      stroke-width: ${getStrokeWidth(props.size)}px;
      transform-origin: center;
    `;
  }};
`;

const Svg = styled.svg`
  ${svgStyles};
`;
Svg.displayName = 'SpinnerSvg';
export default Svg;
