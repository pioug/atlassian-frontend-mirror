import React from 'react';
import { Component } from 'react';
import { createPortal } from 'react-dom';

import { injectIntl, type WrappedComponentProps } from 'react-intl';

import withAnalyticsEvents, {
	type WithAnalyticsEventsProps,
} from '@atlaskit/analytics-next/withAnalyticsEvents';
import Button from '@atlaskit/button/default/button';
import AddIcon from '@atlaskit/icon/core/add';
import MinusIcon from '@atlaskit/icon/core/minus';
import ZoomInIcon from '@atlaskit/icon/core/zoom-in';
import ZoomOutIcon from '@atlaskit/icon/core/zoom-out';
import { hideControlsClassName } from '@atlaskit/media-ui/classNames';
import MediaButton from '@atlaskit/media-ui/MediaButton';
import { messages } from '@atlaskit/media-ui/messages';
import Tooltip from '@atlaskit/tooltip/Tooltip';

import { createZoomInButtonClickEvent } from './analytics/events/ui/zoomInButtonClicked';
import { createZoomOutButtonClickedEvent } from './analytics/events/ui/zoomOutButtonClicked';
import { fireAnalytics } from './analytics/fireAnalytics';
import { ZoomLevel } from './domain/zoomLevel';
import { withInsetViewerFooter, type WithInsetViewerFooterProps } from './insetViewerContext';
import {
	ZoomWrapper,
	ZoomCenterControls,
	ZoomRightControls,
	ZoomLevelIndicator,
} from './styleWrappers';
import { ViewerIconButton } from './viewer-icon-button';

export type ZoomControlsProps = React.PropsWithChildren<
	Readonly<{
		onChange: (newZoomLevel: ZoomLevel) => void;
		onResetZoom?: () => void;
		zoomLevel: ZoomLevel;
	}> &
		WithAnalyticsEventsProps
>;

export class ZoomControlsBase extends Component<
	ZoomControlsProps & WrappedComponentProps & WithInsetViewerFooterProps,
	{}
> {
	zoomIn = (): void => {
		const { onChange, zoomLevel, createAnalyticsEvent } = this.props;
		if (zoomLevel.canZoomIn) {
			const zoom = zoomLevel.zoomIn();

			fireAnalytics(createZoomInButtonClickEvent(zoom.value), createAnalyticsEvent);
			onChange(zoom);
		}
	};

	zoomOut = (): void => {
		const { onChange, zoomLevel, createAnalyticsEvent } = this.props;
		if (zoomLevel.canZoomOut) {
			const zoom = zoomLevel.zoomOut();

			fireAnalytics(createZoomOutButtonClickedEvent(zoom.value), createAnalyticsEvent);
			onChange(zoom);
		}
	};

	zoomToFit = (): void => {
		const { onResetZoom, onChange, zoomLevel } = this.props;
		if (onResetZoom) {
			onResetZoom();
			return;
		}
		onChange(new ZoomLevel(zoomLevel.initialValue));
	};

	render(): React.JSX.Element | null {
		const {
			zoomLevel,
			intl: { formatMessage },
			children,
			isInsetViewer,
			mediaFooterControls,
		} = this.props;

		if (isInsetViewer) {
			if (!mediaFooterControls) {
				return null;
			}

			const zoomPercentage = `${Math.round(zoomLevel.value * 100)}%`;

			return createPortal(
				<ZoomWrapper>
					<ZoomCenterControls>
						<ViewerIconButton
							isDisabled={!zoomLevel.canZoomOut}
							onClick={this.zoomOut}
							icon={MinusIcon}
							label={formatMessage(messages.zoom_out)}
						/>
						<Tooltip content={formatMessage(messages.zoom_to_fit)} position="top" tag="span">
							<Button
								appearance="subtle"
								// Names the current zoom as well, since the label replaces the visible percentage.
								aria-label={formatMessage(messages.zoom_to_fit_with_level, {
									zoomLevel: zoomPercentage,
								})}
								onClick={this.zoomToFit}
								spacing="default"
								testId="zoom-level-indicator"
							>
								{zoomPercentage}
							</Button>
						</Tooltip>
						<ViewerIconButton
							isDisabled={!zoomLevel.canZoomIn}
							onClick={this.zoomIn}
							icon={AddIcon}
							label={formatMessage(messages.zoom_in)}
						/>
					</ZoomCenterControls>
					{children ? <ZoomRightControls>{children}</ZoomRightControls> : null}
				</ZoomWrapper>,
				mediaFooterControls,
			);
		}

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
	withAnalyticsEvents({})(
		injectIntl(withInsetViewerFooter(ZoomControlsBase), { forwardRef: true }),
	);
