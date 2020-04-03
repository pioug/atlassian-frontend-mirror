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
import { channel } from './analytics';
import { ZoomControlsGasPayload, createZoomEvent } from './analytics/zoom';
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
      this.fireAnalytics(createZoomEvent('zoomIn', zoom.value));
      onChange(zoom);
    }
  };

  zoomOut = () => {
    const { onChange, zoomLevel } = this.props;
    if (zoomLevel.canZoomOut) {
      const zoom = zoomLevel.zoomOut();
      this.fireAnalytics(createZoomEvent('zoomOut', zoom.value));
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
            appearance={'toolbar' as any}
            isDisabled={!zoomLevel.canZoomOut}
            onClick={this.zoomOut}
            iconBefore={
              <ZoomOutIcon label={formatMessage(messages.zoom_out)} />
            }
          />
          <MediaButton
            appearance={'toolbar' as any}
            isDisabled={!zoomLevel.canZoomIn}
            onClick={this.zoomIn}
            iconBefore={<ZoomInIcon label={formatMessage(messages.zoom_in)} />}
          />
        </ZoomControlsWrapper>
        <ZoomLevelIndicator>{zoomLevel.asPercentage}</ZoomLevelIndicator>
      </ZoomWrapper>
    );
  }

  private fireAnalytics = (payload: ZoomControlsGasPayload) => {
    const { createAnalyticsEvent } = this.props;
    if (createAnalyticsEvent) {
      const ev = createAnalyticsEvent(payload);
      ev.fire(channel);
    }
  };
}

export const ZoomControls = withAnalyticsEvents({})(
  injectIntl(ZoomControlsBase),
);
