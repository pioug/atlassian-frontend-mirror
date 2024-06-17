/** @jsx jsx */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';
import React, { type MouseEvent, useState, useRef } from 'react';
import { type FileIdentifier, type ImageResizeMode } from '@atlaskit/media-client';
import {
	withAnalyticsEvents,
	type WithAnalyticsEventsProps,
	type UIAnalyticsEvent,
} from '@atlaskit/analytics-next';
import { type CardStatus, type MediaCardCursor, type CardDimensions } from '../../../types';
import { type MediaFilePreview } from '@atlaskit/media-file-preview';
import { createAndFireMediaCardEvent } from '../../../utils/analytics';
import { ImageRenderer } from '../../ui/imageRenderer/imageRenderer';
import { ProgressBar } from '../../ui/progressBar/progressBar';
import { Blanket } from '../../ui/blanket/blanket';
import { Wrapper, ImageContainer } from '../../ui/wrapper';
import { fileCardImageViewSelector } from '../../classnames';
import { useBreakpoint } from '../../useBreakpoint';

import MediaSvg, { type MediaSvgProps } from '@atlaskit/media-svg';
import { calculateSvgDimensions } from './helpers';
import OpenMediaViewerButton from '../../ui/openMediaViewerButton/openMediaViewerButton';

export const convertResizeMode = (
	resizeMode?: ImageResizeMode,
): React.CSSProperties['objectFit'] => {
	switch (resizeMode) {
		case 'crop':
			return 'cover';
		case 'fit':
		case 'full-fit':
			return 'scale-down';
		case 'stretchy-fit':
			return 'contain';
		default:
			return;
	}
};

export type OnClickFn = (
	event: React.MouseEvent<HTMLDivElement | HTMLButtonElement>,
	analyticsEvent?: UIAnalyticsEvent,
) => void;

export interface SvgViewBaseOwnProps {
	readonly testId?: string;
	identifier: FileIdentifier;
	readonly status: CardStatus;
	readonly dimensions: CardDimensions;
	readonly onClick?: OnClickFn;
	readonly onMouseEnter?: (event: MouseEvent<HTMLDivElement>) => void;
	readonly selected?: boolean;
	readonly fileName?: string;
	readonly cardPreview?: MediaFilePreview;
	readonly mediaCardCursor?: MediaCardCursor;
	readonly progress?: number;
	readonly alt?: string;
	readonly resizeMode?: ImageResizeMode;
	readonly onImageLoad?: (cardPreview: MediaFilePreview) => void;
	readonly onImageError?: (cardPreview: MediaFilePreview) => void;
	readonly shouldOpenMediaViewer?: boolean;
	readonly openMediaViewerButtonRef?: React.Ref<HTMLButtonElement>;
}

export type SvgViewProps = SvgViewBaseOwnProps & WithAnalyticsEventsProps;

export const SvgViewBase = ({
	identifier,
	dimensions,
	onClick,
	onMouseEnter,
	testId,
	status,
	selected,
	fileName,
	cardPreview,
	mediaCardCursor,
	progress,
	alt,
	resizeMode,
	shouldOpenMediaViewer,
	openMediaViewerButtonRef = null,
}: SvgViewProps) => {
	const [didSvgRender, setDidSvgRender] = useState<boolean>(false);
	const [didPreviewRender, setDidPreviewRender] = useState<boolean>(false);
	const [svgDimensions, setSvgDimensions] = useState<MediaSvgProps['dimensions']>();
	const divRef = useRef<HTMLDivElement>(null);
	const breakpoint = useBreakpoint(dimensions?.width, divRef);

	const onSvgLoad = (evt: React.SyntheticEvent<HTMLImageElement, Event>) => {
		setSvgDimensions(calculateSvgDimensions(evt.currentTarget, resizeMode));
		setDidSvgRender(true);
	};
	const onPreviewLoad = () => {
		setDidPreviewRender(true);
	};

	return (
		<React.Fragment>
			{shouldOpenMediaViewer && (
				<OpenMediaViewerButton
					fileName={fileName ?? ''}
					innerRef={openMediaViewerButtonRef}
					onClick={onClick}
				/>
			)}
			<Wrapper
				testId={testId || 'media-card-svg-wrapper'}
				dimensions={dimensions}
				onClick={onClick}
				onMouseEnter={onMouseEnter}
				innerRef={divRef}
				mediaCardCursor={mediaCardCursor}
				selected={!!selected}
				breakpoint={breakpoint}
				disableOverlay={true}
				displayBackground={!didSvgRender && !didPreviewRender}
				isTickBoxSelectable={false}
				shouldDisplayTooltip={false}
				isPlayButtonClickable={false}
			>
				<ImageContainer
					centerElements
					testId={fileCardImageViewSelector}
					mediaName={fileName}
					status={status}
					progress={progress}
					selected={selected}
					source={cardPreview?.source}
				>
					<MediaSvg
						testId="media-card-svg"
						identifier={identifier}
						dimensions={svgDimensions}
						onLoad={onSvgLoad}
						style={{
							visibility: didSvgRender ? 'visible' : 'hidden',
							objectFit: convertResizeMode(resizeMode),
						}}
					/>
					{!!cardPreview && !didSvgRender && (
						<ImageRenderer
							cardPreview={cardPreview}
							onImageLoad={onPreviewLoad}
							mediaType={'image'}
							alt={alt}
							resizeMode={resizeMode}
						/>
					)}
					{status === 'uploading' && <Blanket isFixed={true} />}
					{status === 'uploading' && (
						<ProgressBar progress={progress} breakpoint={breakpoint} positionBottom={true} />
					)}
				</ImageContainer>
			</Wrapper>
		</React.Fragment>
	);
};

export const SvgView = withAnalyticsEvents({
	onClick: createAndFireMediaCardEvent({
		eventType: 'ui',
		action: 'clicked',
		actionSubject: 'mediaCard',
		attributes: {},
	}),
})(SvgViewBase);
