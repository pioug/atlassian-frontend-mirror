import { isMimeTypeSupportedByBrowser } from '@atlaskit/media-common';
import { type CardStatus, type FilePreviewStatus } from '../../types';
import {
	isPreviewableFileState,
	type FileState,
	isPreviewableType,
	isImageRepresentationReady,
} from '@atlaskit/media-client';
import { isSupportedLocalPreview } from './helpers';

// TODO: align these checks with helpers from Media Client
// https://product-fabric.atlassian.net/browse/BMPT-1300
export const extractFilePreviewStatus = (
	fileState: FileState,
	isBannedLocalPreview: boolean,
): FilePreviewStatus => {
	const hasFilesize = 'size' in fileState && !!fileState.size;
	const { mediaType } = ('mediaType' in fileState && fileState) || {};
	const { mimeType } = ('mimeType' in fileState && fileState) || {};

	const isPreviewable = !!mediaType && isPreviewableType(mediaType);

	// Local preview is available only if it's supported by browser and supported by Media Card (isSupportedLocalPreview)
	// For example, SVGs are mime type NOT supported by browser but media type supported by Media Card (image)
	// Then, local Preview NOT available
	const hasLocalPreview =
		!isBannedLocalPreview &&
		isPreviewableFileState(fileState) &&
		isSupportedLocalPreview(mediaType) &&
		!!mimeType &&
		isMimeTypeSupportedByBrowser(mimeType);

	const hasRemotePreview = isImageRepresentationReady(fileState);
	const hasPreview = hasLocalPreview || hasRemotePreview;

	const isSupportedByBrowser = !!mimeType && isMimeTypeSupportedByBrowser(mimeType);

	return {
		hasFilesize,
		isPreviewable,
		hasPreview,
		isSupportedByBrowser,
	};
};

// CXP-2723 TODO: Review this in relation to removing status from the hook
export const isPreviewableStatus = (
	cardStatus: CardStatus,
	{ isPreviewable, hasPreview, isSupportedByBrowser }: FilePreviewStatus,
) => {
	return (
		hasPreview &&
		isPreviewable &&
		(cardStatus === 'complete' ||
			cardStatus === 'loading-preview' ||
			cardStatus === 'uploading' ||
			// For Video, we can have local or remote preview while processing.
			// Then, we only want to show the thumbnail if the file is supported by the browser,
			// this way we prevent playing unsupported videos that are not procesed
			(cardStatus === 'processing' && isSupportedByBrowser))
	);
};
