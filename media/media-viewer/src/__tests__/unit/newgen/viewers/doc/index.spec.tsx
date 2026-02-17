import React from 'react';
import {
	globalMediaEventEmitter,
	type MediaViewedEventPayload,
	type FileState,
	type ProcessedFileState,
	type ProcessingFileState,
	type PreviewableFileState,
} from '@atlaskit/media-client';
import {
	renderWithIntl,
	fakeMediaClient,
	expectFunctionToHaveBeenCalledWith,
	nextTick,
} from '@atlaskit/media-test-helpers';
import { screen } from '@testing-library/react';
import { MediaViewerError } from '../../../../../errors';
import { DocViewer } from '../../../../../viewers/doc/index';
import { getObjectUrlFromFileState } from '../../../../../utils/getObjectUrlFromFileState';

jest.mock('../../../../../utils/getObjectUrlFromFileState', () => ({
	__esModule: true,
	getObjectUrlFromFileState: jest.fn().mockResolvedValue('object-url-from-filestate'),
}));
const traceContext = { traceId: 'some-trace-id' };

function createFixture(
	_fetchPromise: Promise<any>,
	item: FileState,
	collectionName?: string,
	mockReturnGetArtifactURL?: Promise<string>,
) {
	const mediaClient = fakeMediaClient();
	const onError = jest.fn();

	jest
		.spyOn(mediaClient.file, 'getArtifactURL')
		.mockReturnValue(
			mockReturnGetArtifactURL ||
				Promise.resolve('some-base-url/document?client=some-client-id&token=some-token'),
		);

	jest
		.spyOn(mediaClient.file, 'getFileBinaryURL')
		.mockReturnValue(
			mockReturnGetArtifactURL ||
				Promise.resolve('some-base-url/binary?client=some-client-id&token=some-token'),
		);

	const result = renderWithIntl(
		<DocViewer
			item={item}
			mediaClient={mediaClient}
			collectionName={collectionName}
			onSuccess={() => {}}
			onError={onError}
			traceContext={traceContext}
		/>,
	);
	return { mediaClient, result, onError };
}

const item: ProcessedFileState = {
	id: 'some-id',
	status: 'processed',
	name: 'my pdf',
	size: 11222,
	mediaType: 'doc',
	mimeType: 'application/pdf',
	artifacts: {
		'document.pdf': {
			url: '/pdf',
			processingStatus: 'succeeded',
		},
	},
	representations: {},
};

const previewableItem: ProcessingFileState & PreviewableFileState = {
	id: 'some-id',
	status: 'processing',
	name: 'my pdf',
	size: 11222,
	mediaType: 'doc',
	mimeType: 'application/pdf',
	preview: {
		value: new Blob([], { type: 'application/pdf' }),
		origin: 'local',
	},
};
// FIXME: Skipping these tests as they have been causing side-effects to other test failures on CI. Follow-up ticket: https://product-fabric.atlassian.net/browse/CXP-2780
// Build References:
// https://bitbucket.org/atlassian/atlassian-frontend/pipelines/results/2028778/steps/%7B0a5ea66e-5c36-48b2-b6df-e0893fd3b6af%7D#line=5-61290
// https://bitbucket.org/atlassian/atlassian-frontend/pipelines/results/2029845/steps/{b861b857-1de4-45f9-b9bd-9538e39c4847}#line=5-42939
// https://bitbucket.org/atlassian/atlassian-frontend/pipelines/results/2029983/steps/{705070ed-dc23-4793-b71a-7647e5897f98}#line=5-42832
// https://bitbucket.org/atlassian/atlassian-frontend/pipelines/results/2028621/steps/%7B40ebb21f-cd44-44e2-bd70-bdc5b69130e4%7D#line=5-61336
describe.skip('DocViewer', () => {
	beforeEach(() => {
		jest.spyOn(globalMediaEventEmitter, 'emit');
	});

	afterEach(() => {
		jest.restoreAllMocks();
	});

	const getSuccessDocument = async () => {
		const fetchPromise = Promise.resolve();
		const { result } = createFixture(fetchPromise, item);
		await nextTick();
		await nextTick();
		await nextTick();
		return result;
	};

	const getPreviewableDocument = async () => {
		const fetchPromise = Promise.resolve();
		const { result, mediaClient } = createFixture(fetchPromise, previewableItem);
		await nextTick();
		await nextTick();
		await nextTick();
		return { result, mediaClient };
	};

	it('assigns a document content when successful', async () => {
		await getSuccessDocument();
		await nextTick();
		// DocViewer shows DocumentViewer on success - check for document scroll root
		expect(document.getElementById('document-scroll-root') ?? screen.queryByRole('document')).toBeTruthy();
	});

	it('triggers media-viewed when successful', async () => {
		await getSuccessDocument();
		expect(globalMediaEventEmitter.emit).toHaveBeenCalledTimes(1);
		expectFunctionToHaveBeenCalledWith(globalMediaEventEmitter.emit, [
			'media-viewed',
			{
				fileId: 'some-id',
				viewingLevel: 'full',
			} as MediaViewedEventPayload,
		]);
	});

	it('shows an indicator while loading', async () => {
		createFixture(new Promise(() => {}), item);
		// Spinner has role="img" with loading label
		expect(screen.getByRole('img', { name: /loading/i })).toBeInTheDocument();
	});

	it('MSW-720: passes collectionName to getArtifactURL', async () => {
		const collectionName = 'some-collection';
		const fetchPromise = Promise.resolve();
		const { mediaClient } = createFixture(fetchPromise, item, collectionName);
		await nextTick();
		await nextTick();
		await nextTick();
		expect((mediaClient.file.getArtifactURL as jest.Mock).mock.calls[0]?.[2]).toEqual(collectionName);
	});

	it('should call getFileBinaryURL when status is failed-processing', async () => {
		const collectionName = 'some-collection';
		const fetchPromise = Promise.resolve();
		const { mediaClient } = createFixture(
			fetchPromise,
			{ ...item, status: 'failed-processing' },
			collectionName,
		);
		await nextTick();
		await nextTick();
		await nextTick();
		expect((mediaClient.file.getFileBinaryURL as jest.Mock).mock.calls[0]?.[1]).toEqual(
			collectionName,
		);
		expect((mediaClient.file.getFileBinaryURL as jest.Mock).mock.calls[0]?.[2]).toEqual(2940);
	});

	it('should call onError when an error happens', async () => {
		const error = new MediaViewerError('docviewer-fetch-url');
		const fetchPromise = Promise.resolve();
		const { onError } = createFixture(
			fetchPromise,
			item,
			undefined,
			Promise.reject(new MediaViewerError('docviewer-fetch-url')),
		);
		await nextTick();
		await nextTick();
		expect(onError).toBeCalledWith(error);
	});

	it('should use local preview when available', async () => {
		const { mediaClient } = await getPreviewableDocument();
		await nextTick();
		expect(getObjectUrlFromFileState).toHaveBeenCalledWith(previewableItem);
		expect(mediaClient.file.getArtifactURL as jest.Mock).toHaveBeenCalledTimes(0);
	});
});
