/* eslint-disable @atlaskit/design-system/ensure-design-token-usage */
import { css } from '@emotion/react';
import { MediaType } from '@atlaskit/media-client';
import { layers, borderRadius } from '@atlaskit/theme/constants';
import { token } from '@atlaskit/tokens';
import { ellipsis, hideControlsClassName } from '@atlaskit/media-ui';
import { ArchiveSideBarWidth } from './viewers/archiveSidebar/styles';
import { headerAndSidebarBackgroundColor } from './viewers/modalSpinner';

const overlayZindex = layers.modal() + 10;
const sidebarWidth = 416;

export const blanketColor = '#22272B';

export const blanketStyles = css`
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background-color: ${blanketColor};
  z-index: ${overlayZindex};
  display: flex;
`;

export type HeaderWrapperProps = {
  isArchiveSideBarVisible: boolean;
};

export const headerWrapperStyles = ({
  isArchiveSideBarVisible,
}: HeaderWrapperProps) =>
  // eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage-spacing
  css`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 98px;
    opacity: 0.85;
    background: linear-gradient(
        to bottom,
        ${headerAndSidebarBackgroundColor},
        rgba(14, 22, 36, 0)
      )
      no-repeat;
    background-position: ${isArchiveSideBarVisible
      ? `${ArchiveSideBarWidth}px 0`
      : '0'};
    color: #c7d1db;
    font-weight: 500;
    padding-top: 15px;
    padding: ${token('space.300', '24px')};
    box-sizing: border-box;
    pointer-events: none;
    z-index: ${overlayZindex + 1};
  `;

export interface ContentWrapperProps {
  showControls: boolean;
}

export const listWrapperStyles = css`
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const arrowsWrapperStyles = css`
  display: flex;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  left: 0;
  width: 100%;
`;

export const closeButtonWrapperStyles = css`
  position: absolute;
  top: ${token('space.300', '24px')};
  right: ${token('space.250', '20px')};
  z-index: ${overlayZindex + 2};
`;

export const contentWrapperStyles = ({
  isSidebarVisible,
}: {
  isSidebarVisible?: boolean;
}) => css`
  width: ${isSidebarVisible ? `calc(100% - ${sidebarWidth}px)` : '100%'};
`;

export const zoomWrapperStyles = css`
  width: 100%;
  position: absolute;
  bottom: 0;
  height: 98px;
  background-image: linear-gradient(
    to top,
    ${headerAndSidebarBackgroundColor},
    rgba(14, 22, 36, 0)
  );
  opacity: 0.85;
  pointer-events: none;
`;

// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage-spacing
export const zoomControlsWrapperStyles = css`
  width: 100%;
  position: absolute;
  text-align: center;
  bottom: 10px;
  button {
    margin-right: 10px;
  }
  > * {
    pointer-events: all;
  }
`;

// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage-spacing
export const zoomLevelIndicatorStyles = css`
  position: absolute;
  right: ${token('space.300', '24px')};
  bottom: 22px;
  color: #c7d1db;
  pointer-events: all;
`;

// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage-spacing
export const hdIconGroupWrapperStyles = css`
  position: absolute;
  right: 69px;
  bottom: ${token('space.200', '16px')};
`;

export const hdIconWrapperStyles = css`
  display: inline-block;
  vertical-align: top;
  margin-left: calc(-1 * ${token('space.300', '24px')});
`;

export const errorMessageWrapperStyles = css`
  text-align: center;
  color: #c7d1db;
  p {
    line-height: 100%;
  }
`;

// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage-spacing
export const errorImageStyles = css`
  margin-bottom: 10px;
  user-select: none;
`;

export const videoStyles = css`
  width: 100vw;
  height: 100vh;
`;

export const pdfWrapperStyles = css`
  overflow: auto;
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;

  .${hideControlsClassName} {
    position: fixed;
  }
`;

export const arrowStyles = css`
  cursor: pointer;

  svg {
    filter: drop-shadow(0px 1px 1px rgb(9 30 66 / 25%))
      drop-shadow(0px 0px 1px rgb(9 30 66 / 31%));
  }

  && button {
    height: inherit;
    background: none;

    &:hover {
      svg {
        color: #b6c2cf;
      }
    }

    &:active {
      svg {
        color: #c7d1db;
      }
    }
  }
`;

const arrowWrapperStyles = css`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  padding: ${token('space.250', '20px')};
`;

export type LeftWrapperProps = {
  isArchiveSideBarVisible: boolean;
};

export const leftWrapperStyles = ({
  isArchiveSideBarVisible,
}: LeftWrapperProps) => css`
  ${arrowWrapperStyles}
  text-align: left;
  left: ${isArchiveSideBarVisible ? `${ArchiveSideBarWidth}px` : '0'};
`;

export const rightWrapperStyles = css`
  ${arrowWrapperStyles}
  text-align: right;
  right: 0;
`;

// header.tsx
export type HeaderProps = {
  isArchiveSideBarVisible: boolean;
};

export const headerStyles = ({ isArchiveSideBarVisible }: HeaderProps) => css`
  display: flex;
  padding-left: ${isArchiveSideBarVisible ? `${ArchiveSideBarWidth}px` : '0'};
`;

export const leftHeaderStyles = css`
  flex: 1;
  overflow: hidden;
  > * {
    pointer-events: all;
  }
`;

export const imageWrapperStyles = css`
  width: 100vw;
  height: 100vh;
  overflow: auto;
  text-align: center;
  vertical-align: middle;
  white-space: nowrap;
`;

export const baselineExtendStyles = css`
  height: 100%;
  display: inline-block;
  vertical-align: middle;
`;

export type ImgProps = {
  cursor: string;
  shouldPixelate: boolean;
};

export const imgStyles = ({ cursor, shouldPixelate }: ImgProps) => css`
  display: inline-block;
  vertical-align: middle;
  position: relative;
  cursor: ${cursor};
  ${shouldPixelate
    ? `/* Prevent images from being smoothed when scaled up */
    image-rendering: optimizeSpeed; /* Legal fallback */
    image-rendering: -moz-crisp-edges; /* Firefox        */
    image-rendering: -o-crisp-edges; /* Opera          */
    image-rendering: -webkit-optimize-contrast; /* Safari         */
    image-rendering: optimize-contrast; /* CSS3 Proposed  */
    image-rendering: crisp-edges; /* CSS4 Proposed  */
    image-rendering: pixelated; /* CSS4 Proposed  */
    -ms-interpolation-mode: nearest-neighbor; /* IE8+           */`
    : ``}
`;

export const medatadataTextWrapperStyles = css`
  overflow: hidden;
`;

export const metadataWrapperStyles = css`
  display: flex;
`;

export const metadataFileNameStyles = css`
  &::first-letter {
    text-transform: uppercase;
  }
  ${ellipsis()};
`;

export const metadataSubTextStyles = css`
  color: #c7d1db;
  ${ellipsis()};
`;

export const metadataIconWrapperStyles = css`
  padding-top: ${token('space.050', '4px')};
  padding-right: ${token('space.150', '12px')};
`;

export interface IconWrapperProps {
  type: MediaType;
}

export const rightHeaderStyles = css`
  text-align: right;
  margin-right: ${token('space.500', '40px')};
  min-width: 200px;
  > * {
    pointer-events: all;
  }
`;

export const customAudioPlayerWrapperStyles = css`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
`;

export const audioPlayerStyles = css`
  background-color: ${blanketColor};
  border-radius: ${borderRadius()};
  align-items: center;
  justify-content: center;
  width: 400px;
  height: 400px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  position: relative;
`;

export const audioStyles = css`
  width: 100%;
  position: absolute;
  bottom: 0;
  left: 0;
`;

export const audioCoverStyles = css`
  width: 100%;
  height: 100%;
  object-fit: scale-down;
  background-color: #000;
`;

export const defaultCoverWrapperStyles = css`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;

  > * {
    transform: scale(2);
  }
`;

// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage-spacing
export const downloadButtonWrapperStyles = css`
  margin-top: 28px;
  text-align: center;

  button {
    &:hover,
    &:active {
      color: #161a1d !important;
    }
  }
`;

export const customVideoPlayerWrapperStyles = css`
  video {
    flex: 1;
    width: 100vw;
    height: 100vh;
    max-height: 100vh;
  }
`;

export const sidebarWrapperStyles = css`
  top: 0;
  right: 0;
  width: ${sidebarWidth}px;
  height: 100vh;
  overflow: hidden auto;
  background-color: ${token(
    'elevation.surface',
    headerAndSidebarBackgroundColor,
  )};
  color: ${token('color.text', '#c7d1db')};
`;

export const spinnerWrapperStyles = css`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
`;

export const formattedMessageWrapperStyles = css``;
