export { StoryBookAuthProvider } from './authProvider';
export { fakeMediaClient, getDefaultMediaClientConfig } from './fakeMediaClient';
export {
	createStorybookMediaClient,
	createStorybookMediaClientConfig,
	createUploadMediaClient,
	createUploadMediaClientConfig,
	defaultBaseUrl,
	defaultParams,
} from './mediaClientProvider';
export { StoryList } from './story-list';
export type { StoryListItem, StoryListProps } from './story-list';
export {
	remoteImage,
	smallImage,
	smallTransparentImage,
	tallImage,
	wideImage,
	wideTransparentImage,
	VRTestSmallImage,
} from './images';
export { videoURI } from './dataURIs/videoURI';
export { videoPreviewURI } from './dataURIs/videoPreviewURI';
export { waitUntil } from './waitUntil';
export { flushPromises } from './flushPromises';
export { Matrix } from './story-styles';
export {
	collectionNames,
	defaultCollectionName,
	defaultMediaPickerCollectionName,
	fileCollectionName,
	onlyAnimatedGifsCollectionName,
} from './collectionNames';
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
	zipFileWithHtmlId,
	codeFileId,
	emailFileId,
	emailUnsupportedFileId,
	htmlFileId,
	videoMp4SaganAliensId,
	vrVideoDetails,
} from './exampleMediaItems';
export { createMouseEvent } from './createMouseEvent';
export type { MouseEventProps } from './createMouseEvent';
export { createTouchEvent } from './createTouchEvent';
export type { TouchEventProps } from './createTouchEvent';
export const authProviderBaseURL = 'https://media.staging.atl-paas.net/items';
export { MEDIA_BASE_URL, MEDIA_PLAYGROUND_BASE_URL } from './mediaBaseURLS';
export { mediaPickerAuthProvider } from './mediaPickerAuthProvider';
export {
	generateFilesFromTestData,
	MediaMock,
	mediaMock,
	isMediaMockOptedIn,
	mediaMockQueryOptInFlag,
} from './mocks/media-mock';
export type {
	MockCollections,
	MockFile,
	MockFileInputParams,
	MediaMockConfig,
	MediaMockControlsBackdoor,
} from './mocks/media-mock';
export { awaitError } from './await-error';
export { nextTick, sleep } from './nextTick';
export { timeoutPromise } from './timeoutPromise';
export {
	asMock,
	asMockFunction,
	asMockReturnValue,
	asMockFunctionReturnValue,
	asMockFunctionResolvedValue,
	expectConstructorToHaveBeenCalledWith,
	expectFunctionToHaveBeenCalledWith,
	expectToEqual,
} from './jestHelpers';
export type {
	ExpectConstructorToHaveBeenCalledWith,
	ExpectFunctionToHaveBeenCalledWith,
	JestSpy,
	JestFunction,
} from './jestHelpers';
export { I18NWrapper } from './I18nWrapper';
export type { I18NWrapperProps, I18NWrapperState } from './I18nWrapper';
export {
	mountWithIntlContext,
	mountWithIntlWrapper,
	shallowWithIntlContext,
} from './mountWithIntlContext';
export { fakeIntl } from './fakeI18n';
export { mockCanvas } from './mockCanvas';
export { default as KeyboardEventWithKeyCode } from './keyboardEventWithKeyCode';
export {
	mockFileReader,
	mockFileReaderError,
	mockFileReaderWithError,
	unmockFileReader,
} from './fileReader';
export {
	loadImageMockSetup,
	mockLoadImage,
	mockLoadImageError,
	unMockLoadImage,
} from './mockLoadImage';
export {
	ClipboardMockFile,
	MockDataTransfer,
	MockDragEvent,
	MockFileList,
	getMockClipboardEvent,
} from './clipboardEventMocks';
export { getMediaAuthProvider } from './getMediaAuthProvider';
export { addGlobalEventEmitterListeners } from './globalEventEmitterListeners';
export { fakeImage } from './utils/mockData';
export { enableMediaUfoLogger } from './ufoLogger';

export { enableMockGlobalImage, disableMockGlobalImage } from './MockGlobalImage';

export { exampleMediaFeatureFlags } from './example-mediaFeatureFlags';
export { dataURItoBlob } from './mockData/utils';
export { mapDataUriToBlob } from './utils/index';

export { default as FeatureFlagsWrapper } from './featureFlagsWrapper';
export {
	// Simulation tools
	FileStateFactory,
	MediaClientMock,
	createIdentifier,
	createFileDetails,
	createFileState,
	useRunSimulation,
	// Predefined simulations
	simulateProcessed,
	simulateProcessing,
	simulateImmediateFailProcessing,
	simulateUpload,
	simulateError,
	simulateErrorState,
	simulateManyProcessed,
	simulateEmptyDetails,
	simulateUpdateFileId,
	simulateAlwaysLoading,
	simulateAlwaysProcessing,
} from './fileStateFactory';
export type {
	FileStateFactoryOptions,
	MediaClientMockOptions,
	Simulation,
	SimulationUtils,
	SimulationSettings,
	SimulationFactory,
	StandardSimulation,
} from './fileStateFactory';

export { DocsContentTabs } from './docs-content-tabs';
