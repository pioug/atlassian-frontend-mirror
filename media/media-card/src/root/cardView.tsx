import React from 'react';
import { MouseEvent } from 'react';
import { FileDetails, ImageResizeMode } from '@atlaskit/media-client';
import {
  withAnalyticsEvents,
  WithAnalyticsEventsProps,
  UIAnalyticsEvent,
} from '@atlaskit/analytics-next';

import { SharedCardProps, CardStatus, CardDimensionValue } from '../index';
import { FileCard } from '../files';
import { breakpointSize } from '../utils/breakpoint';
import {
  defaultImageCardDimensions,
  getDefaultCardDimensions,
} from '../utils/cardDimensions';
import { isValidPercentageUnit } from '../utils/isValidPercentageUnit';
import { getCSSUnitValue } from '../utils/getCSSUnitValue';
import { getElementDimension } from '../utils/getElementDimension';
import { Wrapper } from './styled';
import { createAndFireMediaEvent } from '../utils/analytics';

export interface CardViewOwnProps extends SharedCardProps {
  readonly status: CardStatus;
  readonly metadata?: FileDetails;
  readonly resizeMode?: ImageResizeMode;

  readonly onRetry?: () => void;
  readonly onClick?: (
    event: React.MouseEvent<HTMLDivElement>,
    analyticsEvent?: UIAnalyticsEvent,
  ) => void;
  readonly onMouseEnter?: (event: MouseEvent<HTMLDivElement>) => void;
  readonly onDisplayImage?: () => void;

  // FileCardProps
  readonly dataURI?: string;
  readonly progress?: number;
  readonly disableOverlay?: boolean;
  readonly previewOrientation?: number;
}

export interface CardViewState {
  elementWidth?: number;
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
  state: CardViewState = {};
  divRef: React.RefObject<HTMLDivElement> = React.createRef();

  static defaultProps: Partial<CardViewOwnProps> = {
    appearance: 'auto',
  };

  componentDidMount() {
    this.saveElementWidth();
  }

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

  // If the dimensions.width is a percentage, we need to transform it
  // into a pixel value in order to get the right breakpoints applied.
  saveElementWidth() {
    const { dimensions } = this.props;
    if (!dimensions) {
      return;
    }

    const { width } = dimensions;

    if (width && isValidPercentageUnit(width)) {
      const elementWidth = getElementDimension(this, 'width');

      this.setState({ elementWidth });
    }
  }

  render() {
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
        appearance={appearance}
        dimensions={wrapperDimensions}
        onClick={onClick}
        onMouseEnter={onMouseEnter}
        innerRef={this.divRef}
      >
        {this.renderFile()}
      </Wrapper>
    );
  }

  private renderFile = () => {
    const {
      status,
      metadata,
      dataURI,
      progress,
      onRetry,
      resizeMode,
      appearance,
      dimensions,
      actions,
      selectable,
      selected,
      disableOverlay,
      previewOrientation,
      alt,
      onDisplayImage,
    } = this.props;

    return (
      <FileCard
        status={status}
        details={metadata}
        dataURI={dataURI}
        alt={alt}
        progress={progress}
        onRetry={onRetry}
        resizeMode={resizeMode}
        appearance={appearance}
        dimensions={dimensions}
        actions={actions}
        selectable={selectable}
        selected={selected}
        disableOverlay={disableOverlay}
        previewOrientation={previewOrientation}
        onDisplayImage={onDisplayImage}
      />
    );
  };
}

export const CardView = withAnalyticsEvents({
  onClick: createAndFireMediaEvent({
    eventType: 'ui',
    action: 'clicked',
    actionSubject: 'mediaCard',
  }),
})(CardViewBase);
