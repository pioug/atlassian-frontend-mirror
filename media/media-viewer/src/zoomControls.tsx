import React from 'react';
import { Component } from 'react';
import { hideControlsClassName, MediaButton } from '@atlaskit/media-ui';
import ZoomOutIcon from '@atlaskit/icon/glyph/media-services/zoom-out';
import ZoomInIcon from '@atlaskit/icon/glyph/media-services/zoom-in';
import { ZoomLevel } from './domain/zoomLevel';
import { ZoomWrapper, ZoomControlsWrapper, ZoomLevelIndicator } from './styled';
import {
  withAnalyticsEvents,
  WithAnalyticsEventsProps,
} from '@atlaskit/analytics-next';
import { fireAnalytics } from './analytics/';
import { createZoomInButtonClickEvent } from './analytics/events/ui/zoomInButtonClicked';
import { createZoomOutButtonClickedEvent } from './analytics/events/ui/zoomOutButtonClicked';
import { injectIntl, InjectedIntlProps } from 'react-intl';
import { messages } from '@atlaskit/media-ui';

export type ZoomControlsProps = Readonly<{
  onChange: (newZoomLevel: ZoomLevel) => void;
  zoomLevel: ZoomLevel;
}> &
  WithAnalyticsEventsProps;

export class ZoomControlsBase extends Component<
  ZoomControlsProps & InjectedIntlProps,
  {}
> {
  zoomIn = () => {
    const { onChange, zoomLevel } = this.props;
    if (zoomLevel.canZoomIn) {
      const zoom = zoomLevel.zoomIn();
      fireAnalytics(createZoomInButtonClickEvent(zoom.value), this.props);
      onChange(zoom);
    }
  };

  zoomOut = () => {
    const { onChange, zoomLevel } = this.props;
    if (zoomLevel.canZoomOut) {
      const zoom = zoomLevel.zoomOut();
      fireAnalytics(createZoomOutButtonClickedEvent(zoom.value), this.props);
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

export const ZoomControls = withAnalyticsEvents({})(
  injectIntl(ZoomControlsBase),
);
