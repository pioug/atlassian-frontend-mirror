import styled from 'styled-components';

import { HTMLAttributes, ComponentClass } from 'react';
import { fontFamily } from '@atlaskit/theme/constants';
import { fadeIn } from '@atlaskit/media-ui';

export { defaultTransitionDuration } from './config';
export {
  antialiased,
  borderRadiusLeft,
  capitalize,
  centerSelf,
  centerSelfX,
  centerSelfY,
  centerX,
  hexToRgb,
  rgba,
  spaceAround,
  transition,
  withAppearance,
} from './mixins';
export type { WithAppearanceProps } from './mixins';
export { easeOutCubic, easeOutExpo } from './easing';
export { spin } from './animations';

export const Root: ComponentClass<HTMLAttributes<{}>> = styled.div`
  box-sizing: border-box;
  font-family: ${fontFamily()};

  * {
    box-sizing: border-box;
  }
`;

export const cardShadow = `
  box-shadow: 0 1px 1px rgba(9, 30, 66, 0.2), 0 0 1px 0 rgba(9, 30, 66, 0.24);
`;

export const FadeinImage: ComponentClass<HTMLAttributes<{}>> = styled.div`
  ${fadeIn};
`;

export default Root;
