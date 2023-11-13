/** @jsx jsx */
import { jsx } from '@emotion/react';
import {
  CSSProperties,
  forwardRef,
  MouseEvent,
  ReactNode,
  useMemo,
} from 'react';
import { MediaType } from '@atlaskit/media-client';
import {
  arrowStyles,
  arrowsWrapperStyles,
  audioCoverStyles,
  audioPlayerStyles,
  audioStyles,
  baselineExtendStyles,
  blanketStyles,
  closeButtonWrapperStyles,
  contentWrapperStyles,
  customAudioPlayerWrapperStyles,
  customVideoPlayerWrapperStyles,
  defaultCoverWrapperStyles,
  downloadButtonWrapperStyles,
  errorImageStyles,
  errorMessageWrapperStyles,
  formattedMessageWrapperStyles,
  hdIconGroupWrapperStyles,
  hdIconWrapperStyles,
  headerStyles,
  headerWrapperStyles,
  imageWrapperStyles,
  imgStyles,
  leftHeaderStyles,
  leftWrapperStyles,
  listWrapperStyles,
  medatadataTextWrapperStyles,
  metadataFileNameStyles,
  metadataIconWrapperStyles,
  metadataSubTextStyles,
  metadataWrapperStyles,
  pdfWrapperStyles,
  rightHeaderStyles,
  rightWrapperStyles,
  sidebarWrapperStyles,
  spinnerWrapperStyles,
  videoStyles,
  zoomControlsWrapperStyles,
  zoomLevelIndicatorStyles,
  zoomWrapperStyles,
} from './styles';
import { TouchScrollable } from 'react-scrolllock';
import { useMergeRefs } from 'use-callback-ref';

type Children = {
  children: ReactNode;
};
type ClassName = {
  className: string;
};

type DataTestID = {
  'data-testid'?: string | undefined;
};

type BlanketProps = DataTestID & Children & ClassName;
// We are keeping this data-testid since JIRA is still using it in their codebase to perform checks. Before removing this, we need to ensure this 'media-viewer-popup' test id is not being used anywhere else in other codebases
export const Blanket = ({
  'data-testid': datatestId,
  className,
  children,
}: BlanketProps) => (
  <div css={blanketStyles} data-testid={datatestId} className={className}>
    {children}
  </div>
);

type HeaderWrapperProps = {
  isArchiveSideBarVisible: boolean;
};

export const HeaderWrapper = ({
  className,
  children,
  isArchiveSideBarVisible,
}: ClassName & Children & HeaderWrapperProps) => {
  return (
    <div
      css={headerWrapperStyles({ isArchiveSideBarVisible })}
      className={className}
    >
      {children}
    </div>
  );
};

HeaderWrapper.displayName = 'HeaderWrapper';

export const ListWrapper = ({ children }: Children) => (
  <div css={listWrapperStyles}>{children}</div>
);
ListWrapper.displayName = 'ListWrapper';

export const ArrowsWrapper = ({ children }: Children) => (
  <div css={arrowsWrapperStyles}>{children}</div>
);

export const CloseButtonWrapper = ({
  className,
  children,
}: ClassName & Children) => (
  <div css={closeButtonWrapperStyles} className={className}>
    {children}
  </div>
);

type ContentWrapperProps = {
  isSidebarVisible: boolean | undefined;
} & Children;

export const ContentWrapper = ({
  isSidebarVisible,
  children,
}: ContentWrapperProps) => (
  <div css={contentWrapperStyles({ isSidebarVisible })}>{children}</div>
);

export const ZoomWrapper = ({ className, children }: ClassName & Children) => (
  <div css={zoomWrapperStyles} className={className}>
    {children}
  </div>
);

export const ZoomControlsWrapper = ({ children }: Children) => (
  <div css={zoomControlsWrapperStyles}>{children}</div>
);

export const ZoomLevelIndicator = ({ children }: Children) => (
  <span css={zoomLevelIndicatorStyles}>{children}</span>
);

export const HDIconGroupWrapper = ({
  className,
  children,
}: ClassName & Children) => (
  <div css={hdIconGroupWrapperStyles} className={className}>
    {children}
  </div>
);

export const HDIconWrapper = ({ children }: Children) => (
  <div css={hdIconWrapperStyles}>{children}</div>
);

type ErrorMessageWrapperProps = DataTestID & Children;

export const ErrorMessageWrapper = ({
  'data-testid': datatestId,
  children,
}: ErrorMessageWrapperProps) => (
  <div css={errorMessageWrapperStyles} data-testid={datatestId}>
    {children}
  </div>
);

type ErrorImageProps = {
  alt: string | undefined;
  src: string;
};

export const ErrorImage = ({ src, alt }: ErrorImageProps) => (
  <img css={errorImageStyles} alt={alt} src={src} />
);

type VideoProps = {
  controls: boolean;
  src: string;
  autoPlay: boolean;
};

export const Video = ({ autoPlay, controls, src }: VideoProps) => (
  // eslint-disable-next-line jsx-a11y/media-has-caption
  <video css={videoStyles} autoPlay={autoPlay} controls={controls} src={src} />
);

const PDFWrapperBody = forwardRef<
  HTMLDivElement,
  { innerRef: React.Ref<HTMLDivElement> } & PDFWrapperProps
>(({ innerRef, 'data-testid': datatestId, children }, ref) => {
  const bodyRef = useMergeRefs([ref, innerRef]);
  return (
    <div css={pdfWrapperStyles} ref={bodyRef} data-testid={datatestId}>
      {children}
    </div>
  );
});

type PDFWrapperProps = DataTestID & Children;
export const PDFWrapper = forwardRef<HTMLDivElement, PDFWrapperProps>(
  (props, ref) => {
    return (
      <TouchScrollable>
        <PDFWrapperBody innerRef={ref} {...props} />
      </TouchScrollable>
    );
  },
);

export const Arrow = ({ className, children }: ClassName & Children) => (
  <span css={arrowStyles} className={className}>
    {children}
  </span>
);

export type LeftWrapperProps = {
  isArchiveSideBarVisible: boolean;
};

export const LeftWrapper = ({
  children,
  isArchiveSideBarVisible,
}: Children & LeftWrapperProps) => (
  <div css={leftWrapperStyles({ isArchiveSideBarVisible })}>{children}</div>
);

export const RightWrapper = ({ children }: Children) => (
  <div css={rightWrapperStyles}>{children}</div>
);

// header.tsx
export type HeaderProps = {
  isArchiveSideBarVisible: boolean;
};

export const Header = ({
  children,
  isArchiveSideBarVisible,
  className,
}: Children & HeaderProps & ClassName) => (
  <div css={headerStyles({ isArchiveSideBarVisible })} className={className}>
    {children}
  </div>
);

export const LeftHeader = ({ children }: Children) => (
  <div css={leftHeaderStyles}>{children}</div>
);

export type ImageWrapperProps = {
  onClick: (event: MouseEvent<HTMLDivElement>) => void;
  style: CSSProperties;
} & Children &
  DataTestID;

export const ImageWrapper = forwardRef(
  (
    {
      children,
      'data-testid': datatestId,
      onClick,
      style,
      className,
    }: ImageWrapperProps & ClassName,
    ref,
  ) => (
    <div
      data-testid={datatestId}
      onClick={onClick}
      ref={ref as React.RefObject<HTMLDivElement>}
      css={imageWrapperStyles}
      style={style}
      className={className}
    >
      {children}
    </div>
  ),
);

export const BaselineExtend = () => <div css={baselineExtendStyles} />;

export type ImgProps = {
  canDrag: boolean;
  isDragging: boolean;
  shouldPixelate: boolean;
  src: string;
  style: CSSProperties;
  onLoad: (ev: React.SyntheticEvent<HTMLImageElement>) => void;
  onMouseDown: (ev: MouseEvent<{}>) => void;
  onError: (() => void) | undefined;
} & DataTestID &
  ClassName;

export const Img = ({
  canDrag,
  isDragging,
  shouldPixelate,
  'data-testid': datatestId,
  src,
  style,
  onLoad,
  onError,
  onMouseDown,
  className,
}: ImgProps) => {
  const cursor = useMemo(() => {
    if (canDrag && isDragging) {
      return 'grabbing';
    } else if (canDrag) {
      return 'grab';
    } else {
      return 'auto';
    }
  }, [canDrag, isDragging]);
  return (
    <img
      className={className}
      css={imgStyles({ cursor, shouldPixelate })}
      data-testid={datatestId}
      src={src}
      style={style}
      onLoad={onLoad}
      onError={onError}
      onMouseDown={onMouseDown}
    />
  );
};

export const MedatadataTextWrapper = ({ children }: Children) => (
  <div css={medatadataTextWrapperStyles}>{children}</div>
);

export const MetadataWrapper = ({ children }: Children) => (
  <div css={metadataWrapperStyles}>{children}</div>
);

type MetadataFileNameProps = DataTestID & Children;

export const MetadataFileName = ({
  'data-testid': datatestId,
  children,
}: MetadataFileNameProps) => (
  <div css={metadataFileNameStyles} data-testid={datatestId}>
    {children}
  </div>
);

type MetadataSubTextProps = DataTestID & Children;

export const MetadataSubText = ({
  'data-testid': datatestId,
  children,
}: MetadataSubTextProps) => (
  <div css={metadataSubTextStyles} data-testid={datatestId}>
    {children}
  </div>
);

export const MetadataIconWrapper = ({ children }: Children) => (
  <div css={metadataIconWrapperStyles}>{children}</div>
);

export interface IconWrapperProps {
  type: MediaType;
}

export const RightHeader = ({ children }: Children) => (
  <div css={rightHeaderStyles}>{children}</div>
);

export const CustomAudioPlayerWrapper = ({ children }: Children) => (
  <div css={customAudioPlayerWrapperStyles}>{children}</div>
);

type AudioPlayerProps = DataTestID & Children;

export const AudioPlayer = ({
  'data-testid': datatestId,
  children,
}: AudioPlayerProps) => (
  <div css={audioPlayerStyles} data-testid={datatestId}>
    {children}
  </div>
);

AudioPlayer.displayName = 'AudioPlayer';

type AudioProps = {
  autoPlay: boolean;
  controls: boolean;
  src: string | undefined;
  preload: string;
};

export const Audio = forwardRef(
  ({ autoPlay, controls, src, preload }: AudioProps, ref) => (
    // eslint-disable-next-line jsx-a11y/media-has-caption
    <audio
      css={audioStyles}
      ref={ref as React.RefObject<HTMLAudioElement>}
      autoPlay={autoPlay}
      controls={controls}
      src={src}
      preload={preload}
    />
  ),
);

type AudioCoverProps = {
  alt: string | undefined;
  src: string;
};

export const AudioCover = ({ src, alt }: AudioCoverProps) => (
  <img css={audioCoverStyles} alt={alt} src={src} />
);

export const DefaultCoverWrapper = ({ children }: Children) => (
  <div css={defaultCoverWrapperStyles}>{children}</div>
);

export const DownloadButtonWrapper = ({ children }: Children) => (
  <div css={downloadButtonWrapperStyles}>{children}</div>
);

type CustomVideoPlayerWrapperProps = DataTestID & Children;

export const CustomVideoPlayerWrapper = ({
  'data-testid': datatestId,
  children,
}: CustomVideoPlayerWrapperProps) => (
  <div css={customVideoPlayerWrapperStyles} data-testid={datatestId}>
    {children}
  </div>
);

type SidebarWrapperProps = DataTestID & Children;

export const SidebarWrapper = ({
  'data-testid': datatestId,
  children,
}: SidebarWrapperProps) => (
  <div css={sidebarWrapperStyles} data-testid={datatestId}>
    {children}
  </div>
);

export const SpinnerWrapper = ({ children }: Children) => (
  <div css={spinnerWrapperStyles}>{children}</div>
);

export const FormattedMessageWrapper = ({ children }: Children) => (
  <span css={formattedMessageWrapperStyles}>{children}</span>
);
