import React from 'react';
import { Component } from 'react';
import { hideControlsClassName, MediaButton } from '@atlaskit/media-ui';
import ZoomOutIcon from '@atlaskit/icon/glyph/media-services/zoom-out';
import ZoomInIcon from '@atlaskit/icon/glyph/media-services/zoom-in';
import { ZoomLevel } from './domain/zoomLevel';
import {
  ZoomWrapper,
  ZoomControlsWrapper,
  ZoomLevelIndicator,
} from './styleWrappers';
import {
  withAnalyticsEvents,
  WithAnalyticsEventsProps,
} from '@atlaskit/analytics-next';
import { fireAnalytics } from './analytics/';
import { createZoomInButtonClickEvent } from './analytics/events/ui/zoomInButtonClicked';
import { createZoomOutButtonClickedEvent } from './analytics/events/ui/zoomOutButtonClicked';
import { injectIntl, WrappedComponentProps } from 'react-intl-next';
import { messages } from '@atlaskit/media-ui';

export type ZoomControlsProps = Readonly<{
  onChange: (newZoomLevel: ZoomLevel) => void;
  zoomLevel: ZoomLevel;
}> &
  WithAnalyticsEventsProps;

export class ZoomControlsBase extends Component<
  ZoomControlsProps & WrappedComponentProps,
  {}
> {
  zoomIn = () => {
    const { onChange, zoomLevel, createAnalyticsEvent } = this.props;
    if (zoomLevel.canZoomIn) {
      const zoom = zoomLevel.zoomIn();

      fireAnalytics(
        createZoomInButtonClickEvent(zoom.value),
        createAnalyticsEvent,
      );
      onChange(zoom);
    }
  };

  zoomOut = () => {
    const { onChange, zoomLevel, createAnalyticsEvent } = this.props;
    if (zoomLevel.canZoomOut) {
      const zoom = zoomLevel.zoomOut();

      fireAnalytics(
        createZoomOutButtonClickedEvent(zoom.value),
        createAnalyticsEvent,
      );
      onChange(zoom);
    }
  };

  render() {
    const {
      zoomLevel,
      intl: { formatMessage },
    } = this.props;

    return (
      <ZoomWrapper className={hideControlsClassName}>
        <ZoomControlsWrapper>
          <MediaButton
            isDisabled={!zoomLevel.canZoomOut}
            onClick={this.zoomOut}
            iconBefore={
              <ZoomOutIcon label={formatMessage(messages.zoom_out)} />
            }
          />
          <MediaButton
            isDisabled={!zoomLevel.canZoomIn}
            onClick={this.zoomIn}
            iconBefore={<ZoomInIcon label={formatMessage(messages.zoom_in)} />}
          />
        </ZoomControlsWrapper>
        <ZoomLevelIndicator>{zoomLevel.asPercentage}</ZoomLevelIndicator>
      </ZoomWrapper>
    );
  }
}

export const ZoomControls: React.ComponentType<ZoomControlsProps> =
  withAnalyticsEvents({})(injectIntl(ZoomControlsBase));
