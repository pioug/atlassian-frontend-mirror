/**
 * @jsxRuntime classic
 * @jsx jsx
 */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';
import React, { type MouseEvent, useState, useRef, useEffect, useCallback } from 'react';
import { type FileIdentifier, type ImageResizeMode } from '@atlaskit/media-client';
import {
	withAnalyticsEvents,
	type WithAnalyticsEventsProps,
	type UIAnalyticsEvent,
} from '@atlaskit/analytics-next';
import { type CardDimensions, type CardStatus, type MediaCardCursor } from '../../types';
import { type MediaFilePreview } from '@atlaskit/media-file-preview';
import { createAndFireMediaCardEvent } from '../../utils/analytics';
import { ImageRenderer } from '../ui/imageRenderer/imageRenderer';
import { ProgressBar } from '../ui/progressBar/progressBar';
import { Blanket } from '../ui/blanket/blanket';
import { Wrapper, ImageContainer } from '../ui/wrapper';
import { fileCardImageViewSelector } from '../classnames';
import { useBreakpoint } from '../useBreakpoint';

import MediaSvg, { type MediaSVGError } from '@atlaskit/media-svg';
import { calculateSvgDimensions } from './helpers';
import OpenMediaViewerButton from '../ui/openMediaViewerButton/openMediaViewerButton';
import { MediaCardError } from '../../errors';
import { getErrorReason } from './errors';

export type OnClickFn = (
	event: React.MouseEvent<HTMLDivElement | HTMLButtonElement>,
	analyticsEvent?: UIAnalyticsEvent,
) => void;

export interface SvgViewBaseOwnProps {
	readonly testId?: string;
	identifier: FileIdentifier;
	readonly status: CardStatus;
	readonly cardDimensions: CardDimensions;
	readonly onClick?: OnClickFn;
	readonly onMouseEnter?: (event: MouseEvent<HTMLDivElement>) => void;
	readonly selected?: boolean;
	readonly fileName?: string;
	readonly cardPreview?: MediaFilePreview;
	readonly mediaCardCursor?: MediaCardCursor;
	readonly progress?: number;
	readonly alt?: string;
	readonly resizeMode: ImageResizeMode;
	readonly onLoad: () => void;
	readonly onError: (error: MediaCardError) => void;
	readonly shouldOpenMediaViewer?: boolean;
	readonly openMediaViewerButtonRef?: React.Ref<HTMLButtonElement>;
}

export type SvgViewProps = SvgViewBaseOwnProps & WithAnalyticsEventsProps;

export const SvgViewBase = ({
	identifier,
	cardDimensions,
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
	onLoad,
	onError,
}: SvgViewProps) => {
	const [didSvgRender, setDidSvgRender] = useState<boolean>(false);
	const [didPreviewRender, setDidPreviewRender] = useState<boolean>(false);
	const [svgDimensions, setSvgDimensions] = useState<React.CSSProperties>();
	const imgRef = useRef<HTMLImageElement>(null);
	const wrapperRef = useRef<HTMLDivElement>(null);
	const breakpoint = useBreakpoint(cardDimensions.width, wrapperRef);

	const svgStatus = status === 'uploading' ? status : didSvgRender ? 'complete' : 'loading-svg';

	const calculateDimensions = useCallback(
		(targetImgElem: HTMLImageElement) => {
			if (!wrapperRef.current || !targetImgElem) {
				return;
			}
			setSvgDimensions(calculateSvgDimensions(targetImgElem, wrapperRef.current, resizeMode));
		},
		[resizeMode],
	);

	const onSvgLoad = (evt: React.SyntheticEvent<HTMLImageElement, Event>) => {
		calculateDimensions(evt.currentTarget);
		setDidSvgRender(true);
		onLoad();
	};

	const onSvgError = (err: MediaSVGError) => {
		const error = new MediaCardError(getErrorReason(err.primaryReason), err.secondaryError);
		onError(error);
	};

	const onPreviewLoad = () => {
		setDidPreviewRender(true);
	};

	useEffect(() => {
		if (imgRef.current) {
			calculateDimensions(imgRef.current);
		}
	}, [imgRef, calculateDimensions]);

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
				dimensions={cardDimensions}
				onClick={onClick}
				onMouseEnter={onMouseEnter}
				innerRef={wrapperRef}
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
					status={svgStatus}
					progress={progress}
					selected={selected}
					source={cardPreview?.source}
				>
					<MediaSvg
						testId="media-card-svg"
						identifier={identifier}
						onLoad={onSvgLoad}
						onError={onSvgError}
						style={{
							visibility: didSvgRender ? 'visible' : 'hidden',
							// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop
							...svgDimensions,
						}}
						ref={imgRef}
					/>
					{!didSvgRender && (
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
