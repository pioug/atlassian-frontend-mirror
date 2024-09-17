import React from 'react';
import { Component } from 'react';
import { hideControlsClassName, MediaButton } from '@atlaskit/media-ui';
import ZoomOutIcon from '@atlaskit/icon/core/migration/zoom-out--media-services-zoom-out';
import ZoomInIcon from '@atlaskit/icon/core/migration/zoom-in--media-services-zoom-in';
import { type ZoomLevel } from './domain/zoomLevel';
import {
	ZoomWrapper,
	ZoomCenterControls,
	ZoomRightControls,
	ZoomLevelIndicator,
} from './styleWrappers';
import { withAnalyticsEvents, type WithAnalyticsEventsProps } from '@atlaskit/analytics-next';
import { fireAnalytics } from './analytics/';
import { createZoomInButtonClickEvent } from './analytics/events/ui/zoomInButtonClicked';
import { createZoomOutButtonClickedEvent } from './analytics/events/ui/zoomOutButtonClicked';
import { injectIntl, type WrappedComponentProps } from 'react-intl-next';
import { messages } from '@atlaskit/media-ui';

export type ZoomControlsProps = React.PropsWithChildren<
	Readonly<{
		onChange: (newZoomLevel: ZoomLevel) => void;
		zoomLevel: ZoomLevel;
	}> &
		WithAnalyticsEventsProps
>;

export class ZoomControlsBase extends Component<ZoomControlsProps & WrappedComponentProps, {}> {
	zoomIn = () => {
		const { onChange, zoomLevel, createAnalyticsEvent } = this.props;
		if (zoomLevel.canZoomIn) {
			const zoom = zoomLevel.zoomIn();

			fireAnalytics(createZoomInButtonClickEvent(zoom.value), createAnalyticsEvent);
			onChange(zoom);
		}
	};

	zoomOut = () => {
		const { onChange, zoomLevel, createAnalyticsEvent } = this.props;
		if (zoomLevel.canZoomOut) {
			const zoom = zoomLevel.zoomOut();

			fireAnalytics(createZoomOutButtonClickedEvent(zoom.value), createAnalyticsEvent);
			onChange(zoom);
		}
	};

	render() {
		const {
			zoomLevel,
			intl: { formatMessage },
			children,
		} = this.props;

		return (
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
			<ZoomWrapper className={hideControlsClassName}>
				<ZoomCenterControls>
					<MediaButton
						isDisabled={!zoomLevel.canZoomOut}
						onClick={this.zoomOut}
						iconBefore={
							<ZoomOutIcon
								color="currentColor"
								spacing="spacious"
								label={formatMessage(messages.zoom_out)}
							/>
						}
					/>
					<MediaButton
						isDisabled={!zoomLevel.canZoomIn}
						onClick={this.zoomIn}
						iconBefore={
							<ZoomInIcon
								color="currentColor"
								spacing="spacious"
								label={formatMessage(messages.zoom_in)}
							/>
						}
					/>
				</ZoomCenterControls>
				<ZoomRightControls>
					{children}
					<ZoomLevelIndicator>{zoomLevel.asPercentage}</ZoomLevelIndicator>
				</ZoomRightControls>
			</ZoomWrapper>
		);
	}
}

// @ts-ignore: [PIT-1685] Fails in post-office due to backwards incompatibility issue with React 18
export const ZoomControls: React.ComponentType<React.PropsWithChildren<ZoomControlsProps>> =
	withAnalyticsEvents({})(injectIntl(ZoomControlsBase));
