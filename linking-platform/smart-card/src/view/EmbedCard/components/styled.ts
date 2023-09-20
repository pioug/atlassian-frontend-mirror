import styled from '@emotion/styled';
import {
  borderRadius as akBorderRadius,
  fontFamily,
} from '@atlaskit/theme/constants';
import * as colors from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';
import { gs as gridSize } from '../../common/utils';
import { FrameStyle } from '../types';
import { N40 } from '@atlaskit/theme/colors';
import { themed } from '@atlaskit/theme/components';
import { getBooleanFF } from '@atlaskit/platform-feature-flags';

export const className = 'media-card-frame';

export interface WrapperProps {
  minWidth?: number;
  maxWidth?: number;
  isInteractive?: boolean;
  isSelected?: boolean;
  frameStyle?: FrameStyle;
  inheritDimensions?: boolean;
}

export const borderRadius = `
  border-radius: ${akBorderRadius()}px;
`;

const BACKGROUND_COLOR_DARK = '#262B31';

const wrapperBorderRadius = `
  border-radius: ${token('border.radius.200', '8px')};
`;

const contentBorderRadius = `
  border-radius: ${token('border.radius.100', '4px')};
`;

export const ellipsis = (maxWidth: string | number = '100%') => {
  const unit = typeof maxWidth === 'number' ? 'px' : '';

  return `
    max-width: ${maxWidth}${unit};
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  `;
};

export const csssize = (value: string | number = '100%') => {
  const unit = typeof value === 'number' ? 'px' : '';

  return `
    width: ${value}${unit};
    height: ${value}${unit};
  `;
};

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

function getInteractiveStyles({ isInteractive, frameStyle }: WrapperProps) {
  return isInteractive
    ? `
      &:hover {
        ${frameStyle !== 'hide' && visibleStyles}

      }
      &:active {
        background-color: ${token('color.background.selected', colors.B50)};
      }
    `
    : '';
}

function selected({ isSelected, frameStyle }: WrapperProps) {
  return isSelected && frameStyle !== 'hide'
    ? `
    ${visibleStyles}
    &::after {
      cursor: pointer;
      box-shadow: 0 0 0 3px ${token('color.border.selected', colors.B100)};
      content: '';
      border: none;
      position: absolute;
      height: 100%;
      width: 100%;
      left: 0;
      ${
        getBooleanFF(
          'platform.linking-platform.smart-card.show-smart-links-refreshed-design',
        )
          ? wrapperBorderRadius
          : borderRadius
      }
    }
    `
    : isSelected && frameStyle === 'hide'
    ? `
        ${
          getBooleanFF(
            'platform.linking-platform.smart-card.show-smart-links-refreshed-design',
          )
            ? contentBorderRadius
            : `box-shadow: 0 0 0 3px ${token(
                'color.border.selected',
                colors.B100,
              )};
              ${borderRadius}`
        }
      `
    : '';
}

const height = ({ inheritDimensions }: WrapperProps) =>
  inheritDimensions ? 'height: 100%;' : `height: ${gridSize(54)}`;

const wrapperStyles = (props: WrapperProps) => `
  ${
    getBooleanFF(
      'platform.linking-platform.smart-card.show-smart-links-refreshed-design',
    )
      ? wrapperBorderRadius
      : borderRadius
  }
  ${minWidth(props)}
  ${maxWidth(props)}
  ${getInteractiveStyles(props)}
  ${visible(props)}
  display: inline-flex;
  flex-direction: column;
  box-sizing: border-box;
  font-family: ${fontFamily()};
  width: 100%;
  user-select: none;
  line-height: initial;
  transition: background 0.3s;
  position: relative;
  ${height(props)};
  ${selected(props)}

  &:after {
    content: '';
    transition: background 0.3s, box-shadow 0.3s;
    position: absolute;
    width: calc(100% + ${token('space.200', '16px')});
    height: calc(100% + ${token('space.100', '8px')});
    left: ${token('space.negative.100', '-8px')};
    ${
      getBooleanFF(
        'platform.linking-platform.smart-card.show-smart-links-refreshed-design',
      )
        ? wrapperBorderRadius
        : `background: transparent;
           ${borderRadius}`
    }
  }
`;

const visibleStyles = `
  ${
    getBooleanFF(
      'platform.linking-platform.smart-card.show-smart-links-refreshed-design',
    )
      ? ``
      : `background-color: ${token(
          'color.background.neutral.subtle',
          colors.N30,
        )};`
  }

  &:after {
    ${
      getBooleanFF(
        'platform.linking-platform.smart-card.show-smart-links-refreshed-design',
      )
        ? `border: 1px solid ${token('color.border', N40)};
           background-color: ${themed({
             light: token('elevation.surface.raised', 'white'),
             dark: token('elevation.surface.raised', BACKGROUND_COLOR_DARK),
           })()};`
        : `background: ${token(
            'color.background.neutral',
            colors.N30,
          )} !important;`
    }
  }
  .embed-header {
    opacity: 1;
  }`;

function visible({ frameStyle }: WrapperProps) {
  return frameStyle === 'show' ? visibleStyles : '';
}

export const LinkWrapper = styled.div`
  ${(props: WrapperProps) => wrapperStyles(props)} &:hover {
    text-decoration: none;
  }
`;

// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
export const Wrapper = styled.div<WrapperProps>`
  ${(props) => wrapperStyles(props)};
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
  color: ${token('color.icon', colors.N300)};
  opacity: 0;
  transition: 300ms opacity cubic-bezier(0.15, 1, 0.3, 1);
`;

export interface PlaceholderProps {
  isPlaceholder: boolean;
}

export const IconWrapper = styled.div`
  ${borderRadius}
  ${csssize(16)}
  ${({ isPlaceholder }: PlaceholderProps) => {
    if (isPlaceholder) {
      return `
      background-color: ${token('color.skeleton', colors.N30)};
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
        background-color: ${token('color.skeleton', colors.N30)};
      `;
    } else {
      return '';
    }
  }} color: ${token('color.text.subtlest', colors.N300)};
  font-size: 12px;
  line-height: 16px;
  ${ellipsis('none')};
`;

export interface ContentProps {
  isInteractive: boolean;
  allowScrollBar: boolean;
  frameStyle?: FrameStyle;
}

// NB: `overflow` is kept as `hidden` since
// the internal contents of the `iframe` should
// manage scrolling behaviour.
export const Content = styled.div`
  ${getBooleanFF(
    'platform.linking-platform.smart-card.show-smart-links-refreshed-design',
  )
    ? `${contentBorderRadius};
       border: 1px solid ${token('color.border', N40)};`
    : borderRadius}
  background-color: ${token('elevation.surface.raised', 'white')};
  position: absolute;
  z-index: 1;
  width: 100%;
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
    if (
      isInteractive &&
      !getBooleanFF(
        'platform.linking-platform.smart-card.show-smart-links-refreshed-design',
      )
    ) {
      return `
          .${className}:hover & {
            box-shadow: ${token(
              'elevation.shadow.overlay',
              '0 4px 8px -2px rgba(23, 43, 77, 0.32), 0 0 1px rgba(23, 43, 77, 0.25)',
            )};
          }
        `;
    } else {
      return '';
    }
  }};

  ${({ allowScrollBar }: ContentProps) =>
    allowScrollBar ? 'overflow: auto;' : 'overflow: hidden;'}

  ${({ frameStyle }: ContentProps) =>
    frameStyle === 'hide'
      ? 'height: 100%;'
      : `
        height: calc(100% - ${token('space.400', '32px')});
        top: ${token('space.400', '32px')};
      `}
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
  padding: ${token('space.100', '8px')} ${token('space.150', '12px')}
    ${token('space.150', '12px')} ${token('space.150', '12px')};
`;

export const Title = styled.div`
  color: ${token('color.text', colors.N900)};
  font-size: 16px;
  font-weight: 500;
  line-height: ${20 / 16};
  max-height: ${20 * 4}px;
  overflow: hidden;
`;

export const Byline = styled.div`
  margin-top: ${token('space.050', '4px')};
  color: ${token('color.text.subtlest', colors.N300)};
  font-size: 12px;
  font-weight: normal;
  line-height: ${16 / 12};
  ${ellipsis('100%')};
`;

// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
export const Description = styled.div`
  margin-top: 7px;
  color: ${token('color.text', colors.N800)};
  font-size: 12px;
  font-weight: normal;
  line-height: ${18 / 12};
  max-height: ${18 * 3}px;
  overflow: hidden;
`;

export const ResolvedViewIconWrapper = styled.div`
  margin-top: ${token('space.050', '4px')};
`;

export interface ThumbnailProps {
  src: string;
}

export const Thumbnail = styled.div`
  ${borderRadius}
  ${csssize(48)}
  float: right;
  margin: ${token('space.050', '4px')} 0 ${token('space.150', '12px')}
    ${token('space.150', '12px')};
  background-color: ${token('color.skeleton', colors.N30)};
  background-image: url(${({ src }: ThumbnailProps) => src});
  background-size: cover;
`;

export const UsersWrapper = styled.div`
  margin-top: ${token('space.100', '8px')};
`;

export const ActionsWrapper = styled.div`
  margin-top: ${token('space.100', '8px')};
  text-align: right;

  > * {
    margin-top: ${token('space.050', '4px')};
  }

  > * + * {
    margin-left: ${token('space.050', '4px')};
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
