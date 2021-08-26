import styled from 'styled-components';
import { MediaType } from '@atlaskit/media-client';
import { layers, borderRadius } from '@atlaskit/theme/constants';
import { DN30, DN50, DN400, N0 } from '@atlaskit/theme/colors';
import { ellipsis, hideControlsClassName } from '@atlaskit/media-ui';
import { ArchiveSideBarWidth } from './viewers/archiveSidebar/styled';

const overlayZindex = layers.modal() + 10;
const sidebarWidth = 416;

export const blanketColor = DN30;

export const Blanket = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background-color: ${blanketColor};
  z-index: ${overlayZindex};
  display: flex;
`;

export const HeaderWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 98px;
  opacity: 0.85;
  background-image: linear-gradient(to bottom, #0e1624, rgba(14, 22, 36, 0));
  color: #b8c7e0;
  font-weight: 500;
  padding-top: 15px;
  padding: 24px;
  box-sizing: border-box;
  pointer-events: none;
  z-index: ${overlayZindex + 1};
`;

HeaderWrapper.displayName = 'HeaderWrapper';

export interface ContentWrapperProps {
  showControls: boolean;
}

export const ListWrapper = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
`;

ListWrapper.displayName = 'ListWrapper';

export const ArrowsWrapper = styled.div`
  display: flex;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  left: 0;
  width: 100%;
`;

export const CloseButtonWrapper = styled.div`
  position: absolute;
  top: 24px;
  right: 20px;
  z-index: ${overlayZindex + 2};
`;

export const ContentWrapper = styled.div`
  width: ${(props: { isSidebarVisible?: boolean }) =>
    props.isSidebarVisible ? `calc(100% - ${sidebarWidth}px)` : '100%'};
`;

export const ZoomWrapper = styled.div`
  width: 100%;
  position: absolute;
  bottom: 0;
  height: 98px;
  background-image: linear-gradient(to top, #0e1624, rgba(14, 22, 36, 0));
  opacity: 0.85;
  pointer-events: none;
`;

export const ZoomControlsWrapper = styled.div`
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

export const ZoomLevelIndicator = styled.span`
  position: absolute;
  right: 24px;
  bottom: 22px;
  color: #b8c7e0;
  pointer-events: all;
`;

export const HDIconGroupWrapper = styled.div`
  position: absolute;
  right: 69px;
  bottom: 16px;
`;

export const HDIconWrapper = styled.div`
  display: inline-block;
  vertical-align: top;
  margin-left: -24px;
`;

export const ErrorMessageWrapper = styled.div`
  text-align: center;
  color: #b8c7e0;
  p {
    line-height: 100%;
  }
`;

export const ErrorImage = styled.img`
  margin-bottom: 10px;
  user-select: none;
`;

export const Video = styled.video`
  width: 100vw;
  height: 100vh;
`;

export const PDFWrapper = styled.div`
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

export const Arrow = styled.span`
  cursor: pointer;
  && button {
    height: inherit;
    background: none;
  }
  > span {
    color: rgba(27, 38, 56, 0.5);
    fill: #9fb0cc;
    filter: drop-shadow(1px 1px 1px rgba(27, 38, 56, 0.2));

    &:hover {
      color: #fff;
    }
  }
`;

const ArrowWrapper = styled.div`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  padding: 20px;
`;

export const LeftWrapper = styled(ArrowWrapper)`
  text-align: left;
  left: 0;
`;

export const RightWrapper = styled(ArrowWrapper)`
  text-align: right;
  right: 0;
`;

// header.tsx
export type HeaderProps = {
  isArchiveSideBarVisible: boolean;
};

export const Header = styled.div`
  display: flex;
  padding-left: ${({ isArchiveSideBarVisible }: HeaderProps) =>
    isArchiveSideBarVisible ? `${ArchiveSideBarWidth}px` : '0'};
`;

export const LeftHeader = styled.div`
  flex: 1;
  overflow: hidden;
  > * {
    pointer-events: all;
  }
`;

export const ImageWrapper = styled.div`
  width: 100vw;
  height: 100vh;
  overflow: auto;
  text-align: center;
  vertical-align: middle;
  white-space: nowrap;
`;

export const BaselineExtend = styled.div`
  height: 100%;
  display: inline-block;
  vertical-align: middle;
`;

export type ImgProps = {
  canDrag: boolean;
  isDragging: boolean;
  shouldPixelate: boolean;
};

export const Img = styled.img`
  display: inline-block;
  vertical-align: middle;
  position: relative;
  cursor: ${({ canDrag, isDragging }: ImgProps) => {
    if (canDrag && isDragging) {
      return 'grabbing';
    } else if (canDrag) {
      return 'grab';
    } else {
      return 'auto';
    }
  }};
  ${({ shouldPixelate }) =>
    shouldPixelate
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

export const MedatadataTextWrapper = styled.div`
  overflow: hidden;
`;

export const MetadataWrapper = styled.div`
  display: flex;
`;

export const MetadataFileName = styled.div`
  &::first-letter {
    text-transform: uppercase;
  }
  ${ellipsis()};
`;

export const MetadataSubText = styled.div`
  color: ${DN400};
  ${ellipsis()};
`;

export const MetadataIconWrapper = styled.div`
  padding-top: 4px;
  padding-right: 12px;
`;

export interface IconWrapperProps {
  type: MediaType;
}

export const RightHeader = styled.div`
  text-align: right;
  margin-right: 40px;
  min-width: 200px;
  > * {
    pointer-events: all;
  }
`;

export const CustomAudioPlayerWrapper = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
`;

export const AudioPlayer = styled.div`
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

AudioPlayer.displayName = 'AudioPlayer';

export const Audio = styled.audio`
  width: 100%;
  position: absolute;
  bottom: 0;
  left: 0;
`;

export const AudioCover = styled.img`
  width: 100%;
  height: 100%;
  object-fit: scale-down;
  background-color: #000000;
`;

export const DefaultCoverWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;

  > * {
    transform: scale(2);
  }
`;

export const DownloadButtonWrapper = styled.div`
  margin-top: 28px;
  text-align: center;

  button {
    font-weight: bold;
  }
`;

export const CustomVideoPlayerWrapper = styled.div`
  video {
    flex: 1;
    width: 100vw;
    height: 100vh;
    max-height: 100vh;
  }
`;

export const SidebarWrapper = styled.div`
  top: 0;
  right: 0;
  width: ${sidebarWidth}px;
  height: 100vh;
  overflow: hidden auto;
  background-color: ${DN50};
  color: ${N0};
`;

export const SpinnerWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
`;

export const ErrorReasonTip = styled.div`
  font-size: 10pt;
  margin: 10px 0 40px 0;
  color: ${DN400};
`;
