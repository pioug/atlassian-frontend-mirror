import styled from 'styled-components';
import { N0, N90A } from '@atlaskit/theme/colors';

export const playButtonClassName = 'media-card-play-button';

const bkgClassName = 'play-icon-background';

const discSize = 48;
const discSizeHover = 56;

export const fixedPlayButtonStyles = `
  .${bkgClassName} {
    width: ${discSizeHover}px;
    height: ${discSizeHover}px;
  }
`;

export const Wrapper = styled.div.attrs({ className: playButtonClassName })`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${N0};
  span {
    position: absolute;
  }
`;

Wrapper.displayName = 'PlayButtonWrapper';

export const Background = styled.div.attrs({
  className: bkgClassName,
})`
  transition-property: width, height;
  transition-duration: 0.1s;
  position: absolute;
  width: ${discSize}px;
  height: ${discSize}px;
  background: ${N90A};
  border-radius: 100%;
`;

Background.displayName = 'PlayButtonBackground';
