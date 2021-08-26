import React from 'react';
import { MouseEvent } from 'react';
import { MediaItemType, FileDetails } from '@atlaskit/media-client';
import {
  withAnalyticsEvents,
  WithAnalyticsEventsProps,
  UIAnalyticsEvent,
} from '@atlaskit/analytics-next';
import { getMediaFeatureFlag } from '@atlaskit/media-common';
import { SharedCardProps, CardStatus, CardDimensionValue } from '../index';
import { FileCardImageView } from '../files';
import { breakpointSize } from '../utils/breakpoint';
import {
  defaultImageCardDimensions,
  getDefaultCardDimensions,
} from '../utils/cardDimensions';
import { isValidPercentageUnit } from '../utils/isValidPercentageUnit';
import { getCSSUnitValue } from '../utils/getCSSUnitValue';
import { getElementDimension } from '../utils/getElementDimension';
import { Wrapper } from './styled';
import { createAndFireMediaCardEvent } from '../utils/analytics';
import { attachDetailsToActions } from '../actions';
import { getErrorMessage } from '../utils/getErrorMessage';
import { toHumanReadableMediaSize } from '@atlaskit/media-ui';
import { NewFileExperienceWrapper } from './ui/styled';
import { CardImageContainer, calcBreakpointSize } from './ui/styledSSR';
import { ImageRenderer } from './ui/imageRenderer/imageRenderer';
import { TitleBox } from './ui/titleBox/titleBox';
import { FailedTitleBox } from './ui/titleBox/failedTitleBox';
import { ProgressBar } from './ui/progressBar/progressBar';
import { PlayButton } from './ui/playButton/playButton';
import { TickBox } from './ui/tickBox/tickBox';
import { Blanket } from './ui/blanket/styled';
import { ActionsBar } from './ui/actionsBar/actionsBar';
import Tooltip from '@atlaskit/tooltip';
import { Breakpoint } from './ui/Breakpoint';
import { IconWrapper } from './ui/iconWrapper/styled';
import { MimeTypeIcon } from '@atlaskit/media-ui/mime-type-icon';
import SpinnerIcon from '@atlaskit/spinner';
import {
  PreviewUnavailable,
  CreatingPreview,
  RateLimited,
  PreviewCurrentlyUnavailable,
} from './ui/iconMessage';
import { LoadingRateLimited } from './ui/loadingRateLimited/loadingRateLimited';
import { isRateLimitedError, isPollingError } from '@atlaskit/media-client';
import { newFileExperienceClassName } from './card/cardConstants';
export interface CardViewOwnProps extends SharedCardProps {
  readonly status: CardStatus;
  readonly mediaItemType: MediaItemType;
  readonly metadata?: FileDetails;
  readonly error?: Error;

  readonly onClick?: (
    event: React.MouseEvent<HTMLDivElement>,
    analyticsEvent?: UIAnalyticsEvent,
  ) => void;
  readonly onMouseEnter?: (event: MouseEvent<HTMLDivElement>) => void;
  readonly onDisplayImage?: () => void;

  // FileCardProps
  readonly dataURI?: string;
  readonly progress?: number;
  readonly previewOrientation?: number;

  // CardView can't implement forwardRef as it needs to pass and at the same time
  // handle the HTML element internally. There is no standard way to do this.
  // Therefore, we restrict the use of refs to callbacks only, not RefObjects.
  readonly innerRef?: (instance: HTMLDivElement | null) => void;

  // Used to disable animation for testing purposes
  disableAnimation?: boolean;
  timeElapsedTillCommenced?: number;
}

export interface CardViewState {
  elementWidth?: number;
  isImageFailedToLoad: boolean;
}

export type CardViewProps = CardViewOwnProps & WithAnalyticsEventsProps;

export interface RenderConfigByStatus {
  renderTypeIcon?: boolean;
  iconMessage?: JSX.Element;
  renderImageRenderer?: boolean;
  renderPlayButton?: boolean;
  renderTitleBox?: boolean;
  renderBlanket?: boolean;
  isFixedBlanket?: boolean;
  renderProgressBar?: boolean;
  renderSpinner?: boolean;
  renderFailedTitleBox?: boolean;
  renderLoadingRateLimited?: boolean;
  renderTickBox?: boolean;
}

/**
 * This is classic vanilla CardView class. To create an instance of class one would need to supply
 * `createAnalyticsEvent` prop to satisfy it's Analytics Events needs.
 */
export class CardViewBase extends React.Component<
  CardViewProps,
  CardViewState
> {
  state: CardViewState = { isImageFailedToLoad: false };
  divRef: React.RefObject<HTMLDivElement> = React.createRef();

  static defaultProps: Partial<CardViewOwnProps> = {
    appearance: 'auto',
  };

  componentDidMount() {
    this.saveElementWidth();
    const { innerRef } = this.props;
    !!innerRef && !!this.divRef.current && innerRef(this.divRef.current);
  }

  componentDidUpdate({ dataURI: prevDataURI }: CardViewProps) {
    const { dataURI } = this.props;
    if (prevDataURI !== dataURI) {
      this.setState({ isImageFailedToLoad: false });
    }
  }

  private onImageLoadError = () => {
    this.setState({ isImageFailedToLoad: true });
  };

  // This width is only used to calculate breakpoints, dimensions are passed down as
  // integrator pass it to the root component
  private get width(): CardDimensionValue {
    const { elementWidth } = this.state;
    if (elementWidth) {
      return elementWidth;
    }

    const { width } = this.props.dimensions || { width: undefined };

    if (!width) {
      return defaultImageCardDimensions.width;
    }

    return getCSSUnitValue(width);
  }

  private get breakpoint(): Breakpoint {
    const width =
      this.state.elementWidth ||
      (this.props.dimensions ? this.props.dimensions.width : '') ||
      defaultImageCardDimensions.width;

    return calcBreakpointSize(parseInt(`${width}`, 10));
  }

  // If the dimensions.width is a percentage, we need to transform it
  // into a pixel value in order to get the right breakpoints applied.
  saveElementWidth = () => {
    const { dimensions } = this.props;
    if (!dimensions) {
      return;
    }

    const { width } = dimensions;

    if (width && isValidPercentageUnit(width) && !!this.divRef.current) {
      const elementWidth = getElementDimension(this.divRef.current, 'width');
      this.setState({ elementWidth });
    }
  };

  render() {
    const { featureFlags } = this.props;

    if (getMediaFeatureFlag('newCardExperience', featureFlags)) {
      return this.renderFileNewExperience();
    }

    const {
      dimensions,
      appearance,
      onClick,
      onMouseEnter,
      testId,
    } = this.props;

    const wrapperDimensions = dimensions
      ? dimensions
      : getDefaultCardDimensions(appearance);

    return (
      <Wrapper
        data-testid={testId || 'media-card-view'}
        shouldUsePointerCursor={true}
        breakpointSize={breakpointSize(this.width)}
        dimensions={wrapperDimensions}
        onClick={onClick}
        onMouseEnter={onMouseEnter}
        innerRef={this.divRef}
      >
        {this.renderFile()}
      </Wrapper>
    );
  }

  private renderSpinner(hasTitleBox: boolean) {
    return (
      <IconWrapper breakpoint={this.breakpoint} hasTitleBox={hasTitleBox}>
        <SpinnerIcon />
      </IconWrapper>
    );
  }

  private shouldRenderPlayButton() {
    const { metadata, dataURI } = this.props;
    const { mediaType } = metadata || {};
    if (mediaType !== 'video' || !dataURI) {
      return false;
    }
    return true;
  }

  private renderPlayButton(hasTitleBox: boolean) {
    return (
      <IconWrapper breakpoint={this.breakpoint} hasTitleBox={hasTitleBox}>
        <PlayButton />;
      </IconWrapper>
    );
  }

  //This Blanket will provide a shadow backround for uploading status by
  //setting isFixed.
  private renderBlanket(isFixed: boolean) {
    return <Blanket isFixed={isFixed} />;
  }

  private renderTitleBox() {
    const { metadata, titleBoxBgColor, titleBoxIcon } = this.props;
    const { name, createdAt } = metadata || {};

    return (
      !!name && (
        <TitleBox
          name={name}
          createdAt={createdAt}
          breakpoint={this.breakpoint}
          titleBoxIcon={titleBoxIcon}
          titleBoxBgColor={titleBoxBgColor}
        />
      )
    );
  }

  private renderFailedTitleBox() {
    return <FailedTitleBox breakpoint={this.breakpoint} />;
  }

  private renderProgressBar(positionBottom: boolean) {
    const { progress } = this.props;
    return (
      <ProgressBar
        progress={progress}
        breakpoint={this.breakpoint}
        positionBottom={positionBottom}
      />
    );
  }

  private renderImageRenderer() {
    const {
      dataURI,
      metadata: { mediaType = 'unknown' } = {},
      previewOrientation,
      alt,
      resizeMode,
      onDisplayImage,
      mediaItemType,
      timeElapsedTillCommenced,
    } = this.props;

    return (
      !!dataURI && (
        <ImageRenderer
          dataURI={dataURI}
          mediaType={mediaType}
          mediaItemType={mediaItemType}
          previewOrientation={previewOrientation}
          alt={alt}
          resizeMode={resizeMode}
          onDisplayImage={onDisplayImage}
          onImageError={this.onImageLoadError}
          timeElapsedTillCommenced={timeElapsedTillCommenced}
        />
      )
    );
  }

  private renderTickBox() {
    const { selected } = this.props;
    return <TickBox selected={selected} />;
  }

  private renderMediaTypeIcon(
    hasTitleBox: boolean,
    iconMessage: JSX.Element | undefined,
  ) {
    const { metadata } = this.props;
    const { mediaType, mimeType, name } = metadata || {};

    return (
      <IconWrapper breakpoint={this.breakpoint} hasTitleBox={hasTitleBox}>
        <MimeTypeIcon
          testId={'media-card-file-type-icon'}
          mediaType={mediaType}
          mimeType={mimeType}
          name={name}
        />
        {iconMessage}
      </IconWrapper>
    );
  }

  private renderActionsBar() {
    const { disableOverlay, actions, metadata } = this.props;

    const actionsWithDetails =
      metadata && actions ? attachDetailsToActions(actions, metadata) : [];

    if (disableOverlay || !actions || actions.length === 0) {
      return null;
    }
    return <ActionsBar actions={actionsWithDetails} />;
  }

  private renderFileNewExperience = () => {
    const {
      dimensions,
      appearance,
      onClick,
      onMouseEnter,
      testId,
      metadata,
      status,
      selected,
      selectable,
      disableOverlay,
      dataURI,
    } = this.props;
    const { name } = metadata || {};
    const shouldUsePointerCursor =
      status !== 'error' && status !== 'failed-processing';
    const shouldDisplayBackground = !dataURI || !disableOverlay;
    const isPlayButtonClickable = !!(
      this.shouldRenderPlayButton() && disableOverlay
    );
    const isTickBoxSelectable = !disableOverlay && !!selectable && !selected;
    // Make tooltip optional for media singles - images, videos.
    // Intention is to show full file name when it's truncate in titlebox,
    // and to hide it when no titlebox exists.
    const shouldDisplayTooltip = !!name && !disableOverlay;

    return (
      <NewFileExperienceWrapper
        className={newFileExperienceClassName}
        data-testid={testId || 'media-card-view'}
        dimensions={dimensions}
        appearance={appearance}
        onClick={onClick}
        onMouseEnter={onMouseEnter}
        innerRef={this.divRef}
        breakpoint={this.breakpoint}
        shouldUsePointerCursor={shouldUsePointerCursor}
        disableOverlay={!!disableOverlay}
        selected={!!selected}
        displayBackground={shouldDisplayBackground}
        isPlayButtonClickable={isPlayButtonClickable}
        isTickBoxSelectable={isTickBoxSelectable}
        shouldDisplayTooltip={shouldDisplayTooltip}
      >
        {shouldDisplayTooltip ? (
          <Tooltip content={name} position="bottom" tag={'div'}>
            {this.renderNewExperienceCard()}
          </Tooltip>
        ) : (
          this.renderNewExperienceCard()
        )}
      </NewFileExperienceWrapper>
    );
  };

  private renderFile = () => {
    const {
      status,
      mediaItemType,
      metadata,
      dataURI,
      progress,
      resizeMode,
      dimensions,
      selectable,
      selected,
      disableOverlay,
      previewOrientation,
      alt,
      onDisplayImage,
      actions,
      timeElapsedTillCommenced,
    } = this.props;

    const { name, mediaType, mimeType, size } = metadata || {};
    const actionsWithDetails =
      metadata && actions ? attachDetailsToActions(actions, metadata) : [];
    const errorMessage = getErrorMessage(status);
    const fileSize = !size ? '' : toHumanReadableMediaSize(size);

    return (
      <FileCardImageView
        error={errorMessage}
        dimensions={dimensions}
        selectable={selectable}
        selected={selected}
        dataURI={dataURI}
        mediaName={name}
        mediaType={mediaType}
        mimeType={mimeType}
        fileSize={fileSize}
        status={status}
        mediaItemType={mediaItemType}
        progress={progress}
        resizeMode={resizeMode}
        onDisplayImage={onDisplayImage}
        actions={actionsWithDetails}
        disableOverlay={disableOverlay}
        previewOrientation={previewOrientation}
        alt={alt}
        timeElapsedTillCommenced={timeElapsedTillCommenced}
      />
    );
  };

  private getRenderConfigByStatus = (): RenderConfigByStatus => {
    const {
      dataURI,
      status,
      metadata,
      disableOverlay,
      error,
      selectable,
      disableAnimation,
    } = this.props;
    const { name, mediaType } = metadata || {};
    const { isImageFailedToLoad } = this.state;
    const isZeroSize = !!(metadata && metadata.size === 0);

    const defaultConfig: RenderConfigByStatus = {
      renderTypeIcon: isImageFailedToLoad || !dataURI,
      renderImageRenderer: !!dataURI && !isImageFailedToLoad,
      renderPlayButton: !!dataURI && mediaType === 'video',
      renderBlanket: !disableOverlay,
      renderTitleBox: !!name && !disableOverlay,
      renderFailedTitleBox: !!isImageFailedToLoad && !metadata,
      renderTickBox: !disableOverlay && !!selectable,
    };

    switch (status) {
      case 'uploading':
        return {
          ...defaultConfig,
          renderBlanket: !disableOverlay || mediaType !== 'video',
          isFixedBlanket: true,
          renderProgressBar: true,
        };
      case 'processing':
      case 'loading-preview':
        return {
          ...defaultConfig,
          iconMessage:
            (isImageFailedToLoad || !dataURI) && !isZeroSize ? (
              <CreatingPreview disableAnimation={disableAnimation} />
            ) : undefined,
        };
      case 'complete':
        return {
          ...defaultConfig,
          iconMessage:
            !!isImageFailedToLoad && !!metadata ? (
              <PreviewUnavailable />
            ) : undefined,
        };
      case 'error':
        if (error && isPollingError(error)) {
          return {
            ...defaultConfig,
            renderTypeIcon: true,
            renderImageRenderer: false,
            renderTitleBox: !!name,
            renderFailedTitleBox: false,
            iconMessage:
              !!metadata && !isZeroSize ? (
                <PreviewCurrentlyUnavailable />
              ) : undefined,
          };
        } else if (isRateLimitedError(error) && !disableOverlay) {
          return {
            renderTypeIcon: !!metadata,
            renderTitleBox: !!metadata,
            iconMessage: !!metadata ? <RateLimited /> : undefined,
            renderLoadingRateLimited: !metadata,
          };
        } else {
          return {
            ...defaultConfig,
            renderTypeIcon: true,
            renderImageRenderer: false,
            renderTitleBox: false,
            renderFailedTitleBox: true,
          };
        }
      case 'failed-processing':
        return {
          ...defaultConfig,
          renderTypeIcon: true,
          renderImageRenderer: false,
          renderTitleBox: !!name && !disableOverlay,
          renderFailedTitleBox: !metadata,
          iconMessage:
            !!metadata && !isZeroSize ? <PreviewUnavailable /> : undefined,
        };
      case 'loading':
      default:
        return {
          ...defaultConfig,
          renderTypeIcon: false,
          renderSpinner: true,
        };
    }
  };

  private renderNewExperienceCard = () => {
    const {
      renderTypeIcon,
      iconMessage,
      renderImageRenderer,
      renderSpinner,
      renderPlayButton,
      renderBlanket,
      renderProgressBar,
      renderTitleBox,
      renderFailedTitleBox,
      renderTickBox,
      isFixedBlanket,
      renderLoadingRateLimited,
    } = this.getRenderConfigByStatus();
    const { progress, selected, status, metadata } = this.props;

    const { name } = metadata || {};
    const hasTitleBox = !!renderTitleBox || !!renderFailedTitleBox;

    return (
      <>
        <CardImageContainer
          className="media-file-card-view"
          data-testid="media-file-card-view"
          data-test-media-name={name}
          data-test-status={status}
          data-test-progress={progress}
          data-test-selected={selected ? true : undefined}
        >
          {renderTypeIcon && this.renderMediaTypeIcon(hasTitleBox, iconMessage)}
          {renderSpinner && this.renderSpinner(hasTitleBox)}
          {renderImageRenderer && this.renderImageRenderer()}
          {renderPlayButton && this.renderPlayButton(hasTitleBox)}
          {renderBlanket && this.renderBlanket(!!isFixedBlanket)}
          {renderTitleBox && this.renderTitleBox()}
          {renderFailedTitleBox && this.renderFailedTitleBox()}
          {renderProgressBar && this.renderProgressBar(!hasTitleBox)}
          {renderLoadingRateLimited && <LoadingRateLimited />}
          {renderTickBox && this.renderTickBox()}
        </CardImageContainer>
        {this.renderActionsBar()}
      </>
    );
  };
}

export const CardView = withAnalyticsEvents({
  onClick: createAndFireMediaCardEvent({
    eventType: 'ui',
    action: 'clicked',
    actionSubject: 'mediaCard',
    attributes: {},
  }),
})(CardViewBase);
