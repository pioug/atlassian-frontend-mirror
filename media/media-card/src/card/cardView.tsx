import React, { type MouseEvent, useEffect, useState, useRef, useMemo } from 'react';
import { type MessageDescriptor } from 'react-intl-next';

import {
	type MediaItemType,
	type FileDetails,
	type ImageResizeMode,
	type FileIdentifier,
} from '@atlaskit/media-client';
import {
	withAnalyticsEvents,
	type WithAnalyticsEventsProps,
	type UIAnalyticsEvent,
} from '@atlaskit/analytics-next';
import { MimeTypeIcon } from '@atlaskit/media-ui/mime-type-icon';
import SpinnerIcon from '@atlaskit/spinner';
import Tooltip from '@atlaskit/tooltip';
import { useMergeRefs } from 'use-callback-ref';
import { messages } from '@atlaskit/media-ui';

import {
	type CardStatus,
	type CardPreview,
	type MediaCardCursor,
	type CardDimensions,
	type TitleBoxIcon,
} from '../types';
import { type MediaFilePreview } from '@atlaskit/media-file-preview';
import { createAndFireMediaCardEvent } from '../utils/analytics';
import { type CardAction } from './actions';
import { ImageRenderer } from './ui/imageRenderer/imageRenderer';
import { TitleBox } from './ui/titleBox/titleBox';
import { FailedTitleBox } from './ui/titleBox/failedTitleBox';
import { ProgressBar } from './ui/progressBar/progressBar';
import { PlayButton } from './ui/playButton/playButton';
import { TickBox } from './ui/tickBox/tickBox';
import { Blanket } from './ui/blanket/blanket';
import { ActionsBar } from './ui/actionsBar/actionsBar';
import { IconWrapper } from './ui/iconWrapper/iconWrapper';
import {
	PreviewUnavailable,
	CreatingPreview,
	FailedToUpload,
	FailedToLoad,
} from './ui/iconMessage';
import { isUploadError, type MediaCardError } from '../errors';
import { Wrapper, ImageContainer } from './ui/wrapper';
import { fileCardImageViewSelector } from './classnames';
import { useBreakpoint } from './useBreakpoint';
import OpenMediaViewerButton from './ui/openMediaViewerButton/openMediaViewerButton';
import { useCurrentValueRef } from '../utils/useCurrentValueRef';
import { SvgView } from './svgView';

export interface CardViewProps {
	readonly identifier?: FileIdentifier;
	readonly disableOverlay?: boolean;
	readonly resizeMode?: ImageResizeMode;
	readonly dimensions: CardDimensions;
	readonly actions?: Array<CardAction>;
	readonly selectable?: boolean;
	readonly selected?: boolean;
	readonly alt?: string;
	readonly testId?: string;
	readonly titleBoxBgColor?: string;
	readonly titleBoxIcon?: TitleBoxIcon;
	readonly status: CardStatus;
	readonly mediaItemType: MediaItemType;
	readonly mediaCardCursor?: MediaCardCursor;
	readonly metadata?: FileDetails;
	readonly error?: MediaCardError;
	readonly onClick?: (
		event: React.MouseEvent<HTMLDivElement | HTMLButtonElement>,
		analyticsEvent?: UIAnalyticsEvent,
	) => void;
	readonly openMediaViewerButtonRef?: React.Ref<HTMLButtonElement>;
	readonly shouldOpenMediaViewer?: boolean;
	readonly onMouseEnter?: (event: MouseEvent<HTMLDivElement>) => void;
	readonly onDisplayImage?: () => void;
	// FileCardProps
	readonly cardPreview?: MediaFilePreview;
	readonly progress?: number;
	readonly innerRef?: React.Ref<HTMLDivElement>;
	readonly onImageLoad?: (cardPreview: MediaFilePreview) => void;
	readonly onImageError?: (cardPreview: MediaFilePreview) => void;
	readonly onSvgError?: (error: MediaCardError) => void;
	readonly onSvgLoad?: () => void;
	readonly nativeLazyLoad?: boolean;
	readonly forceSyncDisplay?: boolean;
	// Used to disable animation for testing purposes
	disableAnimation?: boolean;
	shouldHideTooltip?: boolean;
	overriddenCreationDate?: number;
}

export type CardViewBaseProps = CardViewProps & WithAnalyticsEventsProps;

export interface RenderConfigByStatus {
	renderTypeIcon?: boolean;
	iconMessage?: JSX.Element;
	renderImageRenderer?: boolean;
	renderSvgView?: boolean;
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

export const CardViewBase = ({
	identifier,
	innerRef = null,
	onImageLoad,
	onImageError,
	dimensions,
	onClick,
	onMouseEnter,
	testId,
	metadata,
	status,
	selected,
	selectable,
	cardPreview,
	mediaCardCursor,
	shouldHideTooltip,
	progress,
	alt,
	resizeMode,
	onDisplayImage,
	nativeLazyLoad,
	forceSyncDisplay,
	actions,
	disableOverlay,
	titleBoxBgColor,
	titleBoxIcon,
	error,
	disableAnimation,
	openMediaViewerButtonRef = null,
	shouldOpenMediaViewer,
	overriddenCreationDate,
	onSvgError,
	onSvgLoad,
}: CardViewBaseProps) => {
	const [didSvgRender, setDidSvgRender] = useState<boolean>(false);
	const [didImageRender, setDidImageRender] = useState<boolean>(false);
	const divRef = useRef<HTMLDivElement>(null);
	const prevCardPreviewRef = useRef<MediaFilePreview | undefined>();
	const breakpoint = useBreakpoint(dimensions?.width, divRef);

	useEffect(() => {
		// We should only switch didImageRender to false when cardPreview goes undefined, not when it is changed. as this method could be triggered after onImageLoad callback, falling on a race condition
		if (prevCardPreviewRef.current && !cardPreview) {
			setDidImageRender(false);
		}
		prevCardPreviewRef.current = cardPreview;
	}, [cardPreview]);

	const handleOnImageLoad = (prevCardPreview: CardPreview) => {
		if (prevCardPreview.dataURI !== cardPreview?.dataURI) {
			return;
		}
		/*
      We render the icon & icon message always, even if there is cardPreview available.
      If the image fails to load/render, the icon will remain, i.e. the user won't see a change until the root card decides to chage status to error.
      If the image renders successfully, we switch this variable to hide the icon & icon message behind the thumbnail in case the image has transparency.
      It is less likely that root component replaces a suceeded cardPreview for a failed one than the opposite case. Therefore we prefer to hide the icon instead show when the image fails, for a smoother transition
    */
		setDidImageRender(true);
		onImageLoad?.(cardPreview);
	};

	const handleOnImageError = (prevCardPreview: CardPreview) => {
		if (prevCardPreview.dataURI !== cardPreview?.dataURI) {
			return;
		}
		setDidImageRender(false);
		onImageError?.(cardPreview);
	};

	const shouldRenderPlayButton = () => {
		const { mediaType } = metadata || {};
		if (mediaType !== 'video' || !cardPreview) {
			return false;
		}
		return true;
	};

	const mergedRef = useMergeRefs([divRef, innerRef]);

	const getRenderConfigByStatus = (): RenderConfigByStatus => {
		const { name, mediaType, mimeType } = metadata || {};
		const isZeroSize = metadata && metadata.size === 0;

		const defaultConfig: RenderConfigByStatus = {
			renderTypeIcon: !didImageRender && !didSvgRender,
			renderImageRenderer: !didSvgRender,
			renderSvgView: mimeType === 'image/svg+xml',
			renderPlayButton: !!cardPreview && mediaType === 'video',
			renderBlanket: !disableOverlay,
			renderTitleBox: !disableOverlay,
			renderTickBox: !disableOverlay && !!selectable,
		};

		const loadingConfig = {
			...defaultConfig,
			renderPlayButton: false,
			renderTypeIcon: false,
			renderSpinner: !didImageRender && !didSvgRender,
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
				if (status === 'failed-processing' && mimeType === 'image/svg+xml') {
					return loadingConfig;
				}

				const baseErrorConfig = {
					...defaultConfig,
					renderTypeIcon: true,
					renderImageRenderer: false,
					renderSvgView: false,
					renderTitleBox: false,
					renderPlayButton: false,
				};

				let iconMessage;
				let customTitleMessage;
				if (isUploadError(error)) {
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
				return loadingConfig;
		}
	};

	const {
		renderTypeIcon,
		iconMessage,
		renderImageRenderer,
		renderSvgView,
		renderSpinner,
		renderPlayButton,
		renderBlanket,
		renderProgressBar,
		renderTitleBox,
		renderFailedTitleBox,
		renderTickBox,
		isFixedBlanket,
		customTitleMessage,
	} = getRenderConfigByStatus();
	const shouldDisplayBackground =
		!cardPreview || !disableOverlay || status === 'error' || status === 'failed-processing';
	const isPlayButtonClickable = shouldRenderPlayButton() && !!disableOverlay;
	const isTickBoxSelectable = !disableOverlay && !!selectable && !selected;
	// Disable tooltip for Media Single
	const shouldDisplayTooltip = !disableOverlay && !shouldHideTooltip;

	const { mediaType, mimeType, name, createdAt } = metadata || {};

	const isTitleBoxVisible = renderTitleBox && name;
	const hasVisibleTitleBox = !!(isTitleBoxVisible || renderFailedTitleBox);

	const metadataRef = useCurrentValueRef(metadata);

	const actionsWithDetails = useMemo(() => {
		if (!actions) {
			return [];
		}

		return actions.map((action: CardAction) => ({
			...action,
			handler: () => {
				if (!metadataRef.current) {
					action.handler();
				} else {
					action.handler({ type: 'file', details: metadataRef.current });
				}
			},
		}));
	}, [actions, metadataRef]);

	const onSvgLoadBase = () => {
		setDidSvgRender(true);
		onSvgLoad?.();
	};

	const contents = (
		<React.Fragment>
			<ImageContainer
				centerElements={didSvgRender}
				testId={fileCardImageViewSelector}
				mediaName={name}
				status={status}
				progress={progress}
				selected={selected}
				source={cardPreview?.source}
			>
				{renderTypeIcon && (
					<IconWrapper breakpoint={breakpoint} hasTitleBox={hasVisibleTitleBox}>
						<MimeTypeIcon
							testId="media-card-file-type-icon"
							mediaType={mediaType}
							mimeType={mimeType}
							name={name}
						/>
						{iconMessage}
					</IconWrapper>
				)}
				{renderSpinner && (
					<IconWrapper breakpoint={breakpoint} hasTitleBox={hasVisibleTitleBox}>
						<SpinnerIcon testId="media-card-loading" interactionName="media-card-loading" />
					</IconWrapper>
				)}
				{renderSvgView && identifier && (
					<SvgView
						identifier={identifier}
						resizeMode={resizeMode || 'crop'}
						onError={onSvgError}
						onLoad={onSvgLoadBase}
						wrapperRef={divRef}
					/>
				)}
				{renderImageRenderer && (
					<ImageRenderer
						cardPreview={cardPreview}
						mediaType={metadata?.mediaType || 'unknown'}
						alt={alt ?? name}
						resizeMode={resizeMode}
						onDisplayImage={onDisplayImage}
						onImageLoad={handleOnImageLoad}
						onImageError={handleOnImageError}
						nativeLazyLoad={nativeLazyLoad}
						forceSyncDisplay={forceSyncDisplay}
					/>
				)}
				{renderPlayButton && (
					<IconWrapper breakpoint={breakpoint} hasTitleBox={hasVisibleTitleBox}>
						<PlayButton />
					</IconWrapper>
				)}
				{renderBlanket && <Blanket isFixed={isFixedBlanket} />}
				{renderTitleBox && (
					<TitleBox
						name={name}
						createdAt={overriddenCreationDate ?? createdAt}
						breakpoint={breakpoint}
						titleBoxIcon={titleBoxIcon}
						titleBoxBgColor={titleBoxBgColor}
						hidden={!isTitleBoxVisible}
					/>
				)}
				{renderFailedTitleBox && (
					<FailedTitleBox breakpoint={breakpoint} customMessage={customTitleMessage} />
				)}
				{renderProgressBar && (
					<ProgressBar
						progress={progress}
						breakpoint={breakpoint}
						positionBottom={!hasVisibleTitleBox}
					/>
				)}
				{renderTickBox && <TickBox selected={selected} />}
			</ImageContainer>
			{disableOverlay || !actions || actions.length === 0 ? null : (
				<ActionsBar filename={name} actions={actionsWithDetails} />
			)}
		</React.Fragment>
	);

	return (
		<React.Fragment>
			{shouldOpenMediaViewer && (
				<OpenMediaViewerButton
					fileName={name ?? ''}
					innerRef={openMediaViewerButtonRef}
					onClick={onClick}
				/>
			)}
			<Wrapper
				testId={testId || 'media-card-view'}
				dimensions={dimensions}
				onClick={onClick}
				onMouseEnter={onMouseEnter}
				innerRef={mergedRef}
				breakpoint={breakpoint}
				mediaCardCursor={mediaCardCursor}
				disableOverlay={!!disableOverlay}
				selected={!!selected}
				displayBackground={shouldDisplayBackground}
				isPlayButtonClickable={isPlayButtonClickable}
				isTickBoxSelectable={isTickBoxSelectable}
				shouldDisplayTooltip={shouldDisplayTooltip}
			>
				{shouldDisplayTooltip ? (
					<Tooltip content={name} position="bottom" tag="div">
						{contents}
					</Tooltip>
				) : (
					contents
				)}
			</Wrapper>
		</React.Fragment>
	);
};

export const CardView = withAnalyticsEvents({
	onClick: createAndFireMediaCardEvent({
		eventType: 'ui',
		action: 'clicked',
		actionSubject: 'mediaCard',
		attributes: {},
	}),
})(CardViewBase);
