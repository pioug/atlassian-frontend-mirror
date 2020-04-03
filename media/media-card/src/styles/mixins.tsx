import { borderRadius } from '@atlaskit/theme/constants';
import { CardAppearance } from '../index';
import { defaultTransitionDuration } from './config';

export const centerX = `
  display: flex;
  justify-content: center;
`;

export const antialiased = `
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
`;

export const centerSelfY = `
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
`;

export const centerSelfX = `
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
`;

export const centerSelf = `
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
`;

export const borderRadiusLeft = `
  border-top-left-radius: ${borderRadius()};
  border-bottom-left-radius: ${borderRadius()};
`;

export const spaceAround = `
  display: flex;
  flex-direction: column;
  justify-content: space-around;
`;

export const transition = (propertyName = 'all') => `
  transition: ${propertyName} ${defaultTransitionDuration};
`;

export const hexToRgb = (hex: any) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? `${parseInt(result[1], 16)},${parseInt(result[2], 16)},${parseInt(
        result[3],
        16,
      )}`
    : null;
};

export const rgba = (hex: any, opacity: any) =>
  `rgba(${hexToRgb(hex)}, ${opacity})`;

export const capitalize = `
  &::first-letter {
    text-transform: uppercase;
  }
`;

export interface WithAppearanceProps {
  appearance?: CardAppearance;
}

export const withAppearance = (
  styleMap: { [key in CardAppearance]?: string },
) => ({ appearance }: WithAppearanceProps) =>
  (appearance && styleMap[appearance]) || '';
