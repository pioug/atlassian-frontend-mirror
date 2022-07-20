/** @jsx jsx */
import { jsx } from '@emotion/react';
import React, { MouseEvent } from 'react';
import { MessageDescriptor } from 'react-intl-next';

import { MediaItemType, FileDetails } from '@atlaskit/media-client';
import {
  withAnalyticsEvents,
  WithAnalyticsEventsProps,
  UIAnalyticsEvent,
} from '@atlaskit/analytics-next';
import { getMediaFeatureFlag } from '@atlaskit/media-common';
import { MimeTypeIcon } from '@atlaskit/media-ui/mime-type-icon';
import SpinnerIcon from '@atlaskit/spinner';
import Tooltip from '@atlaskit/tooltip';
import { toHumanReadableMediaSize, messages } from '@atlaskit/media-ui';
import { isRateLimitedError, isPollingError } from '@atlaskit/media-client';

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
import { createAndFireMediaCardEvent } from '../utils/analytics';
import { attachDetailsToActions } from '../actions';
import { getErrorMessage } from '../utils/getErrorMessage';
import { cardImageContainerStyles, calcBreakpointSize } from './ui/styles';
import { ImageRenderer } from './ui/imageRenderer/imageRenderer';
import { TitleBox } from './ui/titleBox/titleBox';
import { FailedTitleBox } from './ui/titleBox/failedTitleBox';
import { ProgressBar } from './ui/progressBar/progressBar';
import { PlayButton } from './ui/playButton/playButton';
import { TickBox } from './ui/tickBox/tickBox';
import { Blanket } from './ui/blanket/blanket';
import { ActionsBar } from './ui/actionsBar/actionsBar';
import { Breakpoint } from './ui/common';
import { IconWrapper } from './ui/iconWrapper/iconWrapper';
import {
  PreviewUnavailable,
  CreatingPreview,
  FailedToUpload,
  PreviewCurrentlyUnavailable,
  FailedToLoad,
} from './ui/iconMessage';
import { isUploadError, MediaCardError } from '../errors';
import { CardPreview } from '..';
import { MediaCardCursor } from '../types';
import { NewFileExperienceWrapper } from './ui/newFileExperience/newFileExperienceWrapper';
import { Wrapper } from './cardViewWrapper';

export interface CardViewOwnProps extends SharedCardProps {
  readonly status: CardStatus;
  readonly mediaItemType: MediaItemType;
  readonly mediaCardCursor?: MediaCardCursor;
  readonly metadata?: FileDetails;
  readonly error?: MediaCardError;
  readonly onClick?: (
    event: React.MouseEvent<HTMLDivElement>,
    analyticsEvent?: UIAnalyticsEvent,
  ) => void;
  readonly onMouseEnter?: (event: MouseEvent<HTMLDivElement>) => void;
  readonly onDisplayImage?: () => void;
  // FileCardProps
  readonly cardPreview?: CardPreview;
  readonly progress?: number;
  // CardView can't implement forwardRef as it needs to pass and at the same time
  // handle the HTML element internally. There is no standard way to do this.
  // Therefore, we restrict the use of refs to callbacks only, not RefObjects.
  readonly innerRef?: (instance: HTMLDivElement | null) => void;
  readonly onImageLoad: (cardPreview: CardPreview) => void;
  readonly onImageError: (cardPreview: CardPreview) => void;
  readonly nativeLazyLoad?: boolean;
  readonly forceSyncDisplay?: boolean;
  // Used to disable animation for testing purposes
  disableAnimation?: boolean;
}

export interface CardViewState {
  elementWidth?: number;
  didImageRender: boolean;
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
  renderTickBox?: boolean;
  customTitleMessage?: MessageDescriptor;
}

/**
 * This is classic vanilla CardView class. To create an instance of class one would need to supply
 * `createAnalyticsEvent` prop to satisfy it's Analytics Events needs.
 */
export class CardViewBase extends React.Component<
  CardViewProps,
  CardViewState
> {
  state: CardViewState = { didImageRender: false };
  divRef: React.RefObject<HTMLDivElement> = React.createRef();

  static defaultProps: Partial<CardViewOwnProps> = {
    appearance: 'auto',
  };

  componentDidMount() {
    this.saveElementWidth();
    const { innerRef } = this.props;
    !!innerRef && !!this.divRef.current && innerRef(this.divRef.current);
  }

  componentDidUpdate({ cardPreview: prevCardPreview }: CardViewProps) {
    const { cardPreview } = this.props;
    // We should only switch didImageRender to false
    // when cardPreview goes undefined, not when it is updated.
    // as this method could be triggered after onImageLoad callback,
    // falling on a race condition
    !!prevCardPreview &&
      !cardPreview &&
      this.setState({ didImageRender: false });
  }

  private onImageLoad = (prevCardPreview: CardPreview) => {
    const { onImageLoad, cardPreview } = this.props;
    if (prevCardPreview.dataURI !== cardPreview?.dataURI) {
      return;
    }
    // We render the icon & icon message always, even if there is cardPreview available.
    // If the image fails to load/render, the icon will remain, i.e. the user won't see a change until
    // the root card decides to chage status to error.
    // If the image renders successfully, we switch this variable to hide the icon & icon message
    // behind the thumbnail in case the image has transparency.
    // It is less likely that root component replaces a suceeded cardPreview for a failed one
    // than the opposite case. Therefore we prefer to hide the icon instead show when the image fails,
    // for a smoother transition
    this.setState({ didImageRender: true });
    onImageLoad && onImageLoad(cardPreview);
  };

  private onImageError = (cardPreview: CardPreview) => {
    const { onImageError } = this.props;
    this.setState({ didImageRender: false });
    onImageError && onImageError(cardPreview);
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
        testId={testId || 'media-card-view'}
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
    const { metadata, cardPreview } = this.props;
    const { mediaType } = metadata || {};
    if (mediaType !== 'video' || !cardPreview) {
      return false;
    }
    return true;
  }

  private renderPlayButton(hasTitleBox: boolean) {
    return (
      <IconWrapper breakpoint={this.breakpoint} hasTitleBox={hasTitleBox}>
        <PlayButton />
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

  private renderFailedTitleBox(customMessage?: MessageDescriptor) {
    return (
      <FailedTitleBox
        breakpoint={this.breakpoint}
        customMessage={customMessage}
      />
    );
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
      cardPreview,
      metadata: { mediaType = 'unknown' } = {},
      alt,
      resizeMode,
      onDisplayImage,
      nativeLazyLoad,
      forceSyncDisplay,
    } = this.props;

    return (
      !!cardPreview && (
        <ImageRenderer
          cardPreview={cardPreview}
          mediaType={mediaType}
          alt={alt}
          resizeMode={resizeMode}
          onDisplayImage={onDisplayImage}
          onImageLoad={this.onImageLoad}
          onImageError={this.onImageError}
          nativeLazyLoad={nativeLazyLoad}
          forceSyncDisplay={forceSyncDisplay}
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
      cardPreview,
      mediaCardCursor,
    } = this.props;

    const { name } = metadata || {};
    const shouldDisplayBackground =
      !cardPreview ||
      !disableOverlay ||
      status === 'error' ||
      status === 'failed-processing';
    const isPlayButtonClickable = !!(
      this.shouldRenderPlayButton() && disableOverlay
    );
    const isTickBoxSelectable = !disableOverlay && !!selectable && !selected;
    // Disable tooltip for Media Single
    const shouldDisplayTooltip = !disableOverlay;

    return (
      <NewFileExperienceWrapper
        testId={testId || 'media-card-view'}
        dimensions={dimensions}
        appearance={appearance}
        onClick={onClick}
        onMouseEnter={onMouseEnter}
        innerRef={this.divRef}
        breakpoint={this.breakpoint}
        mediaCardCursor={mediaCardCursor}
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
      cardPreview,
      status,
      mediaItemType,
      metadata,
      progress,
      resizeMode,
      dimensions,
      selectable,
      selected,
      disableOverlay,
      alt,
      onDisplayImage,
      actions,
    } = this.props;
    const { dataURI, orientation } = cardPreview || {};

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
        previewOrientation={orientation}
        alt={alt}
        onImageLoad={this.onImageLoad}
        onImageError={this.onImageError}
        cardPreview={cardPreview}
      />
    );
  };

  private getRenderConfigByStatus = (): RenderConfigByStatus => {
    const {
      cardPreview,
      status,
      metadata,
      disableOverlay,
      error,
      selectable,
      disableAnimation,
    } = this.props;

    const { name, mediaType } = metadata || {};
    const { didImageRender } = this.state;
    const isZeroSize = !!(metadata && metadata.size === 0);

    const defaultConfig: RenderConfigByStatus = {
      renderTypeIcon: !didImageRender,
      renderImageRenderer: !!cardPreview,
      renderPlayButton: !!cardPreview && mediaType === 'video',
      renderBlanket: !disableOverlay,
      renderTitleBox: !disableOverlay && !!name,
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
        return {
          ...defaultConfig,
          iconMessage:
            !didImageRender && !isZeroSize ? (
              <CreatingPreview disableAnimation={disableAnimation} />
            ) : undefined,
        };
      case 'complete':
        return defaultConfig;
      case 'error':
      case 'failed-processing':
        const baseErrorConfig = {
          ...defaultConfig,
          renderTypeIcon: true,
          renderImageRenderer: false,
          renderTitleBox: false,
          renderPlayButton: false,
        };

        let iconMessage;
        let customTitleMessage;
        const { secondaryError } = error || {};
        if (
          isRateLimitedError(secondaryError) ||
          isPollingError(secondaryError)
        ) {
          iconMessage = <PreviewCurrentlyUnavailable />;
        } else if (isUploadError(error)) {
          iconMessage = <FailedToUpload />;
          customTitleMessage = messages.failed_to_upload;
        } else if (!metadata) {
          iconMessage = <FailedToLoad />;
        } else {
          iconMessage = <PreviewUnavailable />;
        }

        if (!disableOverlay) {
          const renderFailedTitleBox = !name || !!customTitleMessage;
          return {
            ...baseErrorConfig,
            renderTitleBox: !!name && !customTitleMessage,
            renderFailedTitleBox,
            iconMessage: !renderFailedTitleBox ? iconMessage : undefined,
            customTitleMessage,
          };
        }
        return {
          ...baseErrorConfig,
          iconMessage,
        };
      case 'loading-preview':
      case 'loading':
      default:
        return {
          ...defaultConfig,
          renderPlayButton: false,
          renderTypeIcon: false,
          renderSpinner: !didImageRender,
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
      customTitleMessage,
    } = this.getRenderConfigByStatus();
    const { progress, selected, status, metadata } = this.props;

    const { name } = metadata || {};
    const hasTitleBox = !!renderTitleBox || !!renderFailedTitleBox;

    return (
      <React.Fragment>
        <div
          css={cardImageContainerStyles}
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
          {renderFailedTitleBox &&
            this.renderFailedTitleBox(customTitleMessage)}
          {renderProgressBar && this.renderProgressBar(!hasTitleBox)}
          {renderTickBox && this.renderTickBox()}
        </div>
        {this.renderActionsBar()}
      </React.Fragment>
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
