import styled from 'styled-components';
import { N0, N90A } from '@atlaskit/theme/colors';

export const playButtonClassName = 'media-card-play-button';

const bkgClassName = 'play-icon-background';

const iconSize = 1.2;
const discSize = 2;
const discSizeHover = 3;

export const fixedPlayButtonStyles = `
  .${bkgClassName} {
    width: ${discSizeHover}em;
    height: ${discSizeHover}em;
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
    height: ${iconSize}em;
  }
`;

Wrapper.displayName = 'PlayButtonWrapper';

export const Background = styled.div.attrs({
  className: bkgClassName,
})`
  transition: all 0.1s;
  position: absolute;
  width: ${discSize}em;
  height: ${discSize}em;
  background: ${N90A};
  border-radius: 100%;
`;

Background.displayName = 'PlayButtonBackground';
