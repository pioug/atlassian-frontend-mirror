jest.mock('@atlaskit/media-client', () => {
	const actualModule = jest.requireActual('@atlaskit/media-client');
	return {
		...actualModule,
		request: jest.fn().mockResolvedValue({
			text: jest.fn().mockResolvedValue('some-src'),
			arrayBuffer: jest.fn().mockResolvedValue(new ArrayBuffer(0)),
		}),
	};
});
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { IntlProvider } from 'react-intl-next';
import {
	globalMediaEventEmitter,
	type MediaViewedEventPayload,
	type ProcessedFileState,
} from '@atlaskit/media-client';
import {
	fakeMediaClient,
	expectFunctionToHaveBeenCalledWith,
	asMockFunction,
} from '@atlaskit/media-test-helpers';
import { MediaViewerError } from '../../../../../errors';
import { CodeViewer, type Props } from '../../../../../viewers/codeViewer/index';
import { msgToText } from '../../../../../viewers/codeViewer/msg-parser';
import { ffTest } from '@atlassian/feature-flags-test-utils';
jest.mock('@codemirror/language-data', () => {
	return {
		languages: [],
	};
});

jest.mock('../../../../../viewers/codeViewer/msg-parser', () => ({
	__esModule: true,
	msgToText: jest.fn(),
}));

function createFixture(
	fetchPromise: Promise<any>,
	codeItem: ProcessedFileState,
	collectionName?: string,
	mockReturnGetFileBinaryURL?: Promise<string>,
	props: Partial<Props> = {},
) {
	const mediaClient = fakeMediaClient();
	const onClose = jest.fn(() => fetchPromise);
	const onSuccess = jest.fn();
	const onError = jest.fn();

	jest
		.spyOn(mediaClient.file, 'getFileBinaryURL')
		.mockReturnValue(
			mockReturnGetFileBinaryURL ||
				Promise.resolve('some-base-url/document?client=some-client-id&token=some-token'),
		);

	const el = render(
		<IntlProvider locale="en">
			<CodeViewer
				item={codeItem}
				mediaClient={mediaClient}
				collectionName={collectionName}
				onSuccess={onSuccess}
				onError={onError}
				traceContext={{ traceId: 'some-trace-id' }}
				{...props}
			/>
		</IntlProvider>,
	);

	return { mediaClient, el, onClose, onSuccess, onError };
}

const codeItem: ProcessedFileState = {
	id: 'some-id',
	status: 'processed',
	name: 'code.py',
	size: 11222,
	mediaType: 'unknown',
	mimeType: 'unknown',
	artifacts: {
		'document.pdf': {
			url: '/pdf',
			processingStatus: 'succeeded',
		},
	},
	representations: {},
};

const emailItem: ProcessedFileState = {
	id: 'some-id',
	status: 'processed',
	name: 'emailItem.msg',
	size: 11222,
	mediaType: 'unknown',
	mimeType: 'unknown',
	artifacts: {
		'document.pdf': {
			url: '/pdf',
			processingStatus: 'succeeded',
		},
	},
	representations: {},
};

describe('CodeViewer', () => {
	beforeEach(() => {
		jest.spyOn(globalMediaEventEmitter, 'emit');
	});

	afterEach(() => {
		jest.restoreAllMocks();
	});
	it('assigns a document content when successful', async () => {
		const fetchPromise = Promise.resolve();
		createFixture(fetchPromise, codeItem);
		await waitFor(() => expect(screen.queryByLabelText('Loading file...')).not.toBeInTheDocument());
		expect(screen.getByTestId('code-block')).toBeInTheDocument();
	});

	it('triggers media-viewed when successful', async () => {
		const fetchPromise = Promise.resolve();
		createFixture(fetchPromise, codeItem);
		await waitFor(() => expect(screen.queryByLabelText('Loading file...')).not.toBeInTheDocument());

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
		const fetchPromise = Promise.resolve();
		createFixture(fetchPromise, codeItem);

		expect(screen.queryByLabelText('Loading file...')).toBeInTheDocument();
	});

	it('MSW-720: passes collectionName to getFileBinaryURL', async () => {
		const collectionName = 'some-collection';
		const fetchPromise = Promise.resolve();
		const { mediaClient } = createFixture(fetchPromise, codeItem, collectionName);
		await waitFor(() => expect(screen.queryByLabelText('Loading file...')).not.toBeInTheDocument());

		expect((mediaClient.file.getFileBinaryURL as jest.Mock).mock.calls[0][1]).toEqual(
			collectionName,
		);
	});

	it('should call onError when an error happens', async () => {
		const error = new MediaViewerError('codeviewer-fetch-src');
		const fetchPromise = Promise.resolve();
		const { onError } = createFixture(fetchPromise, codeItem, undefined, Promise.reject(error));
		await waitFor(() => expect(screen.queryByLabelText('Loading file...')).not.toBeInTheDocument());

		expect(onError).toHaveBeenCalledWith(error);
	});
});

describe('EmailViewer', () => {
	beforeEach(() => {
		jest.spyOn(globalMediaEventEmitter, 'emit');
	});

	afterEach(() => {
		jest.restoreAllMocks();
	});

	describe('when email contents have FAILED to parse', () => {
		it('should not emit media-viewed', async () => {
			asMockFunction(msgToText).mockImplementation(() => {
				return { error: 'error message here' };
			});
			const fetchPromise = Promise.resolve();
			createFixture(fetchPromise, emailItem);
			await waitFor(() =>
				expect(screen.queryByLabelText('Loading file...')).not.toBeInTheDocument(),
			);

			expect(globalMediaEventEmitter.emit).toHaveBeenCalledTimes(0);
		});

		it('assign preview failed content', async () => {
			const fetchPromise = Promise.resolve();
			createFixture(fetchPromise, emailItem);
			await waitFor(() =>
				expect(screen.queryByLabelText('Loading file...')).not.toBeInTheDocument(),
			);
			expect(screen.getByText('Something went wrong.')).toBeInTheDocument();
		});
	});

	describe('when email contents have SUCCESSFULLY parsed', () => {
		it('should email media-viewed', async () => {
			asMockFunction(msgToText).mockImplementation(() => {
				return 'sample email message here';
			});
			const fetchPromise = Promise.resolve();
			createFixture(fetchPromise, emailItem);
			await waitFor(() =>
				expect(screen.queryByLabelText('Loading file...')).not.toBeInTheDocument(),
			);
			expect(globalMediaEventEmitter.emit).toHaveBeenCalledTimes(1);
		});

		it('assign successful content', async () => {
			const fetchPromise = Promise.resolve();
			createFixture(fetchPromise, emailItem);
			await waitFor(() =>
				expect(screen.queryByLabelText('Loading file...')).not.toBeInTheDocument(),
			);
			expect(screen.getByText('sample email message here')).toBeInTheDocument();
		});
	});

	describe('Code Viewer Advanced', () => {
		ffTest(
			'media_advanced_text_viewer',
			async () => {
				const fetchPromise = Promise.resolve();
				const { onSuccess } = createFixture(fetchPromise, codeItem);
				await waitFor(() =>
					expect(screen.queryByLabelText('Loading file...')).not.toBeInTheDocument(),
				);

				expect(onSuccess).toHaveBeenCalled();
				expect(screen.getByText('some-src')).toBeInTheDocument();
			},
			async () => {
				const fetchPromise = Promise.resolve();
				const { onSuccess } = createFixture(fetchPromise, codeItem);
				await waitFor(() =>
					expect(screen.queryByLabelText('Loading file...')).not.toBeInTheDocument(),
				);

				expect(onSuccess).toHaveBeenCalled();
				expect(screen.getByText('some')).toBeInTheDocument();
			},
		);
	});

	//TODO, test error handling (i.e when email cannot be parsed)
});
