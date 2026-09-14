/* eslint-disable @repo/internal/deprecations/deprecation-ticket-required -- VOLTC-139 tracks removal of these deprecated re-export shims. */
/**
 * @deprecated Use `import { StoryBookAuthProvider } from '@atlaskit/media-client/test-helpers/auth-provider'` instead.
 */
export { StoryBookAuthProvider } from './authProvider';
/**
 * @deprecated Use `import { createStorybookMediaClient } from '@atlaskit/media-client/test-helpers/media-client-provider'` instead.
 */
export { createStorybookMediaClient } from './createStorybookMediaClient';
/**
 * @deprecated Use `import { createStorybookMediaClientConfig } from '@atlaskit/media-client/test-helpers/media-client-provider'` instead.
 */
export { createStorybookMediaClientConfig } from './createStorybookMediaClientConfig';
/**
 * @deprecated Use `import { createUploadMediaClient } from '@atlaskit/media-client/test-helpers/media-client-provider'` instead.
 */
export { createUploadMediaClient } from './createUploadMediaClient';
/**
 * @deprecated Use `import { createUploadMediaClientConfig } from '@atlaskit/media-client/test-helpers/media-client-provider'` instead.
 */
export { createUploadMediaClientConfig } from './createUploadMediaClientConfig';
/**
 * @deprecated Use `import { defaultBaseUrl, defaultParams } from '@atlaskit/media-client/test-helpers/media-client-provider'` instead.
 */
export { defaultBaseUrl, defaultParams } from './mediaClientProvider';
/**
 * @deprecated Use `import { collectionNames, defaultCollectionName, defaultMediaPickerCollectionName, fileCollectionName, onlyAnimatedGifsCollectionName } from '@atlaskit/media-client/test-helpers/collection-names'` instead.
 */
export {
	collectionNames,
	defaultCollectionName,
	defaultMediaPickerCollectionName,
	fileCollectionName,
	onlyAnimatedGifsCollectionName,
} from './collectionNames';
/**
 * @deprecated Use `import { animatedFileId, archiveFileId, atlassianLogoUrl, audioFileDetails, audioFileId, audioNoCoverFileId, bigDocFileId, docFileDetails, docFileId, emptyImageFileId, errorFileId, externalImageIdentifier, externalSmallImageIdentifier, externaBrokenlIdentifier, genericDataURI, genericFileDetails, genericFileId, gifFileId, imageFileDetails, imageFileId, largeImageFileId, largePdfFileId, noMetadataFileId, passwordProtectedPdfFileId, smallImageFileId, unknownFileDetails, unknownFileId, verticalImageFileId, videoFileDetails, videoFileId, videoHorizontalFileId, videoLargeFileId, videoProcessingFailedId, videoSquareFileId, wideImageFileId, zipFileId, zipFileWithNestedFolderId, zipItemLargeInnerFileId, zipItemMultipleFoldersAtRootId, zipJiraArchiveFileId, zipEncryptedFileId, codeFileId, emailFileId, emailUnsupportedFileId, vrVideoDetails, svgFileIds } from '@atlaskit/media-client/test-helpers/example-media-items'` instead.
 */
export {
	animatedFileId,
	archiveFileId,
	atlassianLogoUrl,
	audioFileDetails,
	audioFileId,
	audioNoCoverFileId,
	bigDocFileId,
	docFileDetails,
	docFileId,
	emptyImageFileId,
	errorFileId,
	externalImageIdentifier,
	externalSmallImageIdentifier,
	externaBrokenlIdentifier,
	genericDataURI,
	genericFileDetails,
	genericFileId,
	gifFileId,
	imageFileDetails,
	imageFileId,
	largeImageFileId,
	largePdfFileId,
	noMetadataFileId,
	passwordProtectedPdfFileId,
	smallImageFileId,
	unknownFileDetails,
	unknownFileId,
	verticalImageFileId,
	videoFileDetails,
	videoFileId,
	videoHorizontalFileId,
	videoLargeFileId,
	videoProcessingFailedId,
	videoSquareFileId,
	wideImageFileId,
	zipFileId,
	zipFileWithNestedFolderId,
	zipItemLargeInnerFileId,
	zipItemMultipleFoldersAtRootId,
	zipJiraArchiveFileId,
	zipEncryptedFileId,
	codeFileId,
	emailFileId,
	emailUnsupportedFileId,
	vrVideoDetails,
	svgFileIds,
} from './exampleMediaItems';
export const authProviderBaseURL = 'https://media.staging.atl-paas.net';
/**
 * @deprecated Use `import { defaultMediaPickerAuthProvider } from '@atlaskit/media-client/test-helpers/media-picker-auth-provider'` instead.
 */
export { defaultMediaPickerAuthProvider } from './defaultMediaPickerAuthProvider';
/**
 * @deprecated Use `import { mediaPickerAuthProvider } from '@atlaskit/media-client/test-helpers/media-picker-auth-provider'` instead.
 */
export { mediaPickerAuthProvider } from './mediaPickerAuthProvider';
/**
 * @deprecated Use `import { fakeMediaClient } from '@atlaskit/media-client/test-helpers/fake-media-client'` instead.
 */
export { fakeMediaClient } from './fakeMediaClient';

export type {
	CreateMockedMediaApiResult,
	SetItems,
	GetItem,
} from './MockedMediaApi/MockedMediaApi';
/**
 * @deprecated Use `import { merge } from '@atlaskit/media-client/test-helpers/mocked-media-api/helpers'` instead.
 */
export { merge } from './MockedMediaApi/merge';
/**
 * @deprecated Use `import { getIdentifier } from '@atlaskit/media-client/test-helpers/mocked-media-api/helpers'` instead.
 */
export { getIdentifier } from './MockedMediaApi/getIdentifier';
/**
 * @deprecated Use `import { createEmptyFileItem } from '@atlaskit/media-client/test-helpers/mocked-media-api/helpers'` instead.
 */
export { createEmptyFileItem } from './MockedMediaApi/createEmptyFileItem';
/**
 * @deprecated Use `import { copy } from '@atlaskit/media-client/test-helpers/mocked-media-api/helpers'` instead.
 */
export { copy } from './MockedMediaApi/copy';
/**
 * @deprecated Use `import { assign } from '@atlaskit/media-client/test-helpers/mocked-media-api/helpers'` instead.
 */
export { assign } from './MockedMediaApi/assign';
/**
 * @deprecated Use `import { createMockedMediaApi } from '@atlaskit/media-client/test-helpers/mocked-media-api'` instead.
 */
export { createMockedMediaApi } from './MockedMediaApi/MockedMediaApi';
export type { PartialResponseFileItem } from './MockedMediaApi/types';
/**
 * @deprecated Use `import { createUploadingFileState } from '@atlaskit/media-client/test-helpers/mocked-media-api/helpers'` instead.
 */
export { createUploadingFileState } from './MockedMediaApi/createUploadingFileState';
/**
 * @deprecated Use `import { createFileState } from '@atlaskit/media-client/test-helpers/mocked-media-api/helpers'` instead.
 */
export { createFileState } from './MockedMediaApi/createFileState';
/**
 * @deprecated Use `import { createErrorFileState } from '@atlaskit/media-client/test-helpers/mocked-media-api/helpers'` instead.
 */
export { createErrorFileState } from './MockedMediaApi/createErrorFileState';
/**
 * @deprecated Use `import { createProcessingFileItem } from '@atlaskit/media-client/test-helpers/mocked-media-api/helpers'` instead.
 */
export { createProcessingFileItem } from './MockedMediaApi/createProcessingFileItem';
/**
 * @deprecated Use `import { createMediaStoreError } from '@atlaskit/media-client/test-helpers/media-client-errors'` instead.
 */
export { createMediaStoreError } from './createMediaStoreError';
/**
 * @deprecated Use `import { createPollingMaxAttemptsError } from '@atlaskit/media-client/test-helpers/media-client-errors'` instead.
 */
export { createPollingMaxAttemptsError } from './createPollingMaxAttemptsError';
/**
 * @deprecated Use `import { createRateLimitedError } from '@atlaskit/media-client/test-helpers/media-client-errors'` instead.
 */
export { createRateLimitedError } from './createRateLimitedError';
/**
 * @deprecated Use `import { createServerUnauthorizedError } from '@atlaskit/media-client/test-helpers/media-client-errors'` instead.
 */
export { createServerUnauthorizedError } from './createServerUnauthorizedError';
