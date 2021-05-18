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
import {
  NewFileExperienceWrapper,
  CardImageContainer,
  calcBreakpointSize,
} from './ui/styled';
import { ImageRenderer } from './ui/imageRenderer/imageRenderer';
import { TitleBox } from './ui/titleBox/titleBox';
import { FailedTitleBox } from './ui/titleBox/failedTitleBox';
import { ProgressBar } from './ui/progressBar/progressBar';
import { PlayButton } from './ui/playButton/playButton';
import { TickBox } from './ui/tickBox/tickBox';
import { Blanket } from './ui/blanket/styled';
import { ActionsBar } from './ui/actionsBar/actionsBar';
import Tooltip from '@atlaskit/tooltip';
import { Breakpoint } from './ui/common';
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
}

export interface CardViewState {
  elementWidth?: number;
  isImageFailedToLoad: boolean;
}

export type CardViewProps = CardViewOwnProps & WithAnalyticsEventsProps;

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
  saveElementWidth() {
    const { dimensions } = this.props;
    if (!dimensions) {
      return;
    }

    const { width } = dimensions;

    if (width && isValidPercentageUnit(width) && this.divRef.current) {
      const elementWidth = getElementDimension(this.divRef.current, 'width');
      this.setState({ elementWidth });
    }
  }

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

  private renderSpinner() {
    const { status, dataURI } = this.props;
    if (!['loading'].includes(status) || dataURI) {
      return null;
    }
    const hasTitleBox = this.showTitleBox() || this.showFailedTitleBox();

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

  private renderPlayButton = () => {
    if (!this.shouldRenderPlayButton()) {
      return null;
    }
    const hasTitleBox = this.showTitleBox() || this.showFailedTitleBox();
    return (
      <IconWrapper breakpoint={this.breakpoint} hasTitleBox={hasTitleBox}>
        <PlayButton />;
      </IconWrapper>
    );
  };

  private renderBlanket() {
    const { disableOverlay, status, metadata } = this.props;
    const { mediaType } = metadata || {};
    if (disableOverlay && (status !== 'uploading' || mediaType === 'video')) {
      return null;
    }
    const isFixed = status === 'uploading';

    return <Blanket isFixed={isFixed} />;
  }

  private showTitleBox(): boolean {
    const { isImageFailedToLoad } = this.state;
    const { metadata, disableOverlay, status, dataURI, error } = this.props;
    const { name } = metadata || {};

    if (error && isPollingError(error)) {
      return true;
    }

    const noErrorWithUri = !!dataURI || status !== 'error';

    return (
      (!!name && !isImageFailedToLoad && !disableOverlay && noErrorWithUri) ||
      isRateLimitedError(error)
    );
  }

  private showFailedTitleBox(): boolean {
    const { isImageFailedToLoad } = this.state;
    const { status, dataURI, metadata, error } = this.props;

    if (error && isPollingError(error)) {
      return false;
    }

    const failedProcessingWithMetadata = !!(
      status === 'failed-processing' && metadata
    );

    const nonFailingStates = [
      'loading',
      'processing',
      'uploading',
      'complete',
    ].includes(status);

    return (
      isImageFailedToLoad ||
      (!dataURI && !(nonFailingStates || failedProcessingWithMetadata))
    );
  }

  private renderTitleBox() {
    const { metadata, titleBoxBgColor, titleBoxIcon } = this.props;
    const { name, createdAt } = metadata || {};

    if (!this.showTitleBox() || !name) {
      return null;
    }
    return (
      <TitleBox
        name={name}
        createdAt={createdAt}
        breakpoint={this.breakpoint}
        titleBoxBgColor={titleBoxBgColor}
        titleBoxIcon={titleBoxIcon}
      />
    );
  }

  private renderFailedTitleBox() {
    if (!this.showFailedTitleBox()) {
      return null;
    }
    return <FailedTitleBox breakpoint={this.breakpoint} />;
  }

  private renderProgressBar() {
    const { status, progress } = this.props;
    return (
      status === 'uploading' && (
        <ProgressBar
          progress={progress}
          breakpoint={this.breakpoint}
          positionBottom={!this.showTitleBox()}
        />
      )
    );
  }

  private renderCreatingPreviewText() {
    const { isImageFailedToLoad } = this.state;
    const { status, dataURI, metadata } = this.props;
    const isZeroSize =
      !!(metadata && metadata.size === 0) && status === 'processing';
    if (
      (!isImageFailedToLoad && (dataURI || status === 'loading')) ||
      isZeroSize
    ) {
      return null;
    }

    return status === 'processing' && <CreatingPreview />;
  }

  private renderPreviewUnavailableText() {
    const { status, metadata, error } = this.props;

    const isZeroSize = !!(metadata && metadata.size === 0);

    if (!metadata || isZeroSize) {
      return null;
    }

    if (error && isPollingError(error)) {
      return <PreviewCurrentlyUnavailable />;
    }
    return status === 'failed-processing' && <PreviewUnavailable />;
  }

  private renderRateLimitedText = () => {
    const { metadata, error, disableOverlay } = this.props;
    const shouldRender =
      isRateLimitedError(error) && !disableOverlay && metadata;
    if (!shouldRender) {
      return null;
    }
    return <RateLimited />;
  };

  private renderImageRenderer() {
    const { isImageFailedToLoad } = this.state;
    const {
      dataURI,
      metadata: { mediaType = 'unknown' } = {},
      previewOrientation,
      alt,
      resizeMode,
      onDisplayImage,
      mediaItemType,
    } = this.props;

    return (
      dataURI &&
      !isImageFailedToLoad && (
        <ImageRenderer
          dataURI={dataURI}
          mediaType={mediaType}
          mediaItemType={mediaItemType}
          previewOrientation={previewOrientation}
          alt={alt}
          resizeMode={resizeMode}
          onDisplayImage={onDisplayImage}
          onImageError={this.onImageLoadError}
        />
      )
    );
  }

  private shouldRenderTickBox(): boolean {
    const { selectable, disableOverlay } = this.props;
    return !disableOverlay && !!selectable;
  }

  private renderTickBox() {
    const { selected } = this.props;
    return this.shouldRenderTickBox() && <TickBox selected={selected} />;
  }

  private renderMediaTypeIcon() {
    const { isImageFailedToLoad } = this.state;
    const { status, dataURI, metadata, error } = this.props;
    const { mediaType, mimeType, name } = metadata || {};
    if (!isImageFailedToLoad && (dataURI || status === 'loading')) {
      return null;
    }

    const hasTitleBox =
      this.showTitleBox() ||
      this.showFailedTitleBox() ||
      isRateLimitedError(error);

    return (
      <IconWrapper breakpoint={this.breakpoint} hasTitleBox={hasTitleBox}>
        <MimeTypeIcon mediaType={mediaType} mimeType={mimeType} name={name} />
        {this.renderRateLimitedText()}
        {this.renderCreatingPreviewText()}
        {this.renderPreviewUnavailableText()}
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

  private renderFileNewExperienceContents = () => {
    const {
      progress,
      selected,
      status,
      metadata,
      disableOverlay,
      error,
    } = this.props;
    const { name } = metadata || {};

    /***
     * TODO:
     * Having UI elements rendering completely independent from each other
     * and having their own conditions to render is becoming hard to handle.
     * We should group them into specific views coming from the card flow designs found in
     * https://product-fabric.atlassian.net/wiki/spaces/FIL/pages/1751948766/Error+and+Failure+states+documentation
     * */

    if (error && isPollingError(error)) {
      // do nothing, render regular card
      // TODO: send fail event with proper failReason?
      // perhaps part of https://product-fabric.atlassian.net/browse/BMPT-970
    } else if (isRateLimitedError(error) && !disableOverlay) {
      // When a card is rate limited
      // disableOverlay so that media-image isn't accounted for
      // the reason being, media-image is not affected by rate limitation, and does not need these custom
      // rate limited states
      // If theres metadata, we signify to the user that they can still preview the card in the viewer
      if (metadata) {
        return (
          <CardImageContainer>
            {this.renderMediaTypeIcon()}
            {this.renderTitleBox()}
          </CardImageContainer>
        );
      }
      // cannot preview in the viewer: card is completely borked
      else {
        return <LoadingRateLimited />;
      }
    }
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
          {this.renderSpinner()}
          {this.renderMediaTypeIcon()}
          {this.renderImageRenderer()}
          {this.renderPlayButton()}
          {this.renderBlanket()}
          {this.renderTickBox()}
          {this.renderProgressBar()}
          {this.renderFailedTitleBox()}
          {this.renderTitleBox()}
        </CardImageContainer>
        {this.renderActionsBar()}
      </>
    );
  };

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
    const { mediaType, name } = metadata || {};
    const shouldUsePointerCursor =
      status !== 'error' && status !== 'failed-processing';
    const shouldDisplayBackground = !dataURI || !disableOverlay;
    const isPlayButtonClickable = !!(
      this.shouldRenderPlayButton() && disableOverlay
    );
    const isTickBoxSelectable = !!(
      this.shouldRenderTickBox() &&
      selectable &&
      !selected
    );
    // Make tooltip optional for media singles - images, videos.
    // Intention is to show full file name when it's truncate in titlebox,
    // and to hide it when no titlebox exists.
    const shouldDisplayTooltip = !!name && !disableOverlay;
    return (
      <NewFileExperienceWrapper
        data-testid={testId || 'media-card-view'}
        dimensions={dimensions}
        appearance={appearance}
        onClick={onClick}
        onMouseEnter={onMouseEnter}
        innerRef={this.divRef}
        mediaType={mediaType}
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
            {this.renderFileNewExperienceContents()}
          </Tooltip>
        ) : (
          this.renderFileNewExperienceContents()
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
      />
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
