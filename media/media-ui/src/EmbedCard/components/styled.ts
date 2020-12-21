import styled, { css } from 'styled-components';
import { size as csssize } from '../../mixins';
import { fontFamily } from '@atlaskit/theme/constants';
import * as colors from '@atlaskit/theme/colors';
import { borderRadius, size, ellipsis } from '../../mixins';
import { gs as gridSize } from '../../BlockCard/utils';

export const className = 'media-card-frame';
export const cardShadow = ``;

export interface WrapperProps {
  minWidth?: number;
  maxWidth?: number;
  isInteractive?: boolean;
  isSelected?: boolean;
  isFrameVisible?: boolean;
  isVisible?: boolean;
  inheritDimensions?: boolean;
}

function minWidth({ minWidth }: WrapperProps) {
  if (minWidth) {
    return `min-width: ${minWidth}px;`;
  } else {
    return '';
  }
}

function maxWidth({ maxWidth }: WrapperProps) {
  if (maxWidth) {
    return `max-width: ${maxWidth}px; margin: 0 auto;`;
  } else {
    return 'margin: 0 auto;';
  }
}

function getinteractiveStyles({ isInteractive, isFrameVisible }: WrapperProps) {
  const visibleFrameStyles = isFrameVisible ? visibleStyles : '';
  const interactiveFrameStyles = isInteractive
    ? `
  &:hover {
    ${visibleStyles}
  }
  &:active {
    background-color: ${colors.B50};
  }
`
    : '';

  return `${visibleFrameStyles}${interactiveFrameStyles}`;
}

function selected({ isSelected }: WrapperProps) {
  return isSelected
    ? `
    ${visibleStyles}
    &::after {
      cursor: pointer;
      box-shadow: 0 0 0 3px ${colors.B100};
      content: '';
      outline: none;
      position: absolute;
      height: 100%;
      width: 100%;
      left: 0;
      ${borderRadius}
    }
    `
    : '';
}

const wrapperStyles = css`
  ${borderRadius}
  ${minWidth}
  ${maxWidth}
  ${getinteractiveStyles}
  ${visible}
  display: inline-flex;
  flex-direction: column;
  box-sizing: border-box;
  font-family: ${fontFamily()};
  width: 100%;
  user-select: none;
  line-height: initial;
  transition: background 0.3s;
  position: relative;
  height: 100%;
  ${({ inheritDimensions }: WrapperProps) => {
    if (inheritDimensions) {
      return `
      height: 100%;
    `;
    } else {
      return `height: ${gridSize(54)}`;
    }
  }}
  ${selected}

  &:after {
    content: '';
    background: transparent;
    transition: background 0.3s, box-shadow 0.3s;
    position: absolute;
    width: calc(100% + ${gridSize(2)});
    height: calc(100% + ${gridSize(1)});
    left: -${gridSize(1)};
    ${borderRadius}
  }
`;

const visibleStyles = `
  background-color: ${colors.N30};

  &:after {
    background: ${colors.N30} !important;
  }
  .embed-header {
    opacity: 1;
  }`;

function visible({ isVisible }: WrapperProps) {
  return isVisible ? visibleStyles : '';
}

export const LinkWrapper = styled.div`
  ${wrapperStyles} &:hover {
    text-decoration: none;
  }
`;

export const Wrapper = styled.div`
  ${wrapperStyles};
  margin-top: 10px;
`;

export const embedHeaderHeight = 32;
export const Header = styled.div`
  height: ${embedHeaderHeight}px;
  position: absolute;
  z-index: 1;
  width: 100%;
  display: flex;
  align-items: center;
  color: ${colors.N300};
  opacity: 0;
  transition: 300ms opacity cubic-bezier(0.15, 1, 0.3, 1);
`;

export interface PlaceholderProps {
  isPlaceholder: boolean;
}

export const IconWrapper = styled.div`
  ${borderRadius}
  ${size(16)}
  ${({ isPlaceholder }: PlaceholderProps) => {
    if (isPlaceholder) {
      return `
      background-color: ${colors.N30};
    `;
    } else {
      return '';
    }
  }} margin-right: 4px;
`;

export const TextWrapper = styled.div`
  ${({ isPlaceholder }: PlaceholderProps) => {
    if (isPlaceholder) {
      return `
        ${borderRadius}
        width: 125px;
        height: 12px;
        background-color: ${colors.N30};
      `;
    } else {
      return '';
    }
  }} color: ${colors.N300};
  font-size: 12px;
  line-height: 16px;
  ${ellipsis('none')};
`;

export interface ContentProps {
  isInteractive: boolean;
}

// NB: `overflow` is kept as `hidden` since
// the internal contents of the `iframe` should
// manage scrolling behaviour.
export const Content = styled.div`
  position: relative;

  ${borderRadius}
  ${cardShadow}
  background-color: white;
  position: absolute;
  z-index: 1;
  width: 100%;
  top: ${gridSize(4)};
  overflow: hidden;
  height: calc(100% - ${gridSize(4)});
  transition: box-shadow 0.3s;

  > .calc-height > div > div {
    left: unset !important;
    width: unset !important;
    height: unset !important;
    position: initial !important;
    padding-bottom: unset !important;
  }
  > .embed-preview > div {
    margin: 0 auto;
  }

  ${({ isInteractive }: ContentProps) => {
    if (isInteractive) {
      return `
          .${className}:hover & {
            box-shadow: 0 4px 8px -2px rgba(23, 43, 77, 0.32),
              0 0 1px rgba(23, 43, 77, 0.25);
          }
        `;
    } else {
      return '';
    }
  }};
`;

export interface ImageProps {
  size: number;
}

export const Image = styled.img`
  ${({ size }: ImageProps) => csssize(size)}
  ${borderRadius}

  /* hide the alt text when the image cannot be found */
  overflow: hidden;
`;

export const maxAvatarCount = 6;

export const ContentWrapper = styled.div`
  display: flex;
  flex-direction: row;
  box-sizing: border-box;
  padding: 8px 12px 12px 12px;
`;

export const Title = styled.div`
  color: ${colors.N900};
  font-size: 16px;
  font-weight: 500;
  line-height: ${20 / 16};
  max-height: ${20 * 4}px;
  overflow: hidden;
`;

export const Byline = styled.div`
  margin-top: 4px;
  color: ${colors.N300};
  font-size: 12px;
  font-weight: normal;
  line-height: ${16 / 12};
  ${ellipsis('100%')};
`;

export const Description = styled.div`
  margin-top: 7px;
  color: ${colors.N800};
  font-size: 12px;
  font-weight: normal;
  line-height: ${18 / 12};
  max-height: ${18 * 3}px;
  overflow: hidden;
`;

export const ResolvedViewIconWrapper = styled.div`
  margin-top: 4px;
`;

export interface ThumbnailProps {
  src: string;
}

export const Thumbnail = styled.div`
  ${borderRadius}
  ${size(48)}
  float: right;
  margin: 4px 0 12px 12px;
  background-color: ${colors.N30};
  background-image: url(${({ src }: ThumbnailProps) => src});
  background-size: cover;
`;

export const UsersWrapper = styled.div`
  margin-top: 8px;
`;

export const ActionsWrapper = styled.div`
  margin-top: 8px;
  text-align: right;

  > * {
    margin-top: 4px;
  }

  > * + * {
    margin-left: 4px;
  }
`;

export const AlertWrapper = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  overflow: hidden;
  pointer-events: none;
  /* z-index has to be 1 higher than the number of avatars in the avatar stack */
  z-index: ${maxAvatarCount + 1};
`;
