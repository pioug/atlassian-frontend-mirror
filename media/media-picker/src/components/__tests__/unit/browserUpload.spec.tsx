import React from 'react';
import { render, screen, userEvent, waitFor } from '@atlassian/testing-library';

import { expectFunctionToHaveBeenCalledWith, fakeMediaClient } from '@atlaskit/media-test-helpers';
import {
	type TouchFileDescriptor,
	createMediaSubject,
	fromObservable,
} from '@atlaskit/media-client';

import { Browser } from '../../browser/browser';
import { type LocalUploadConfig } from '../../types';
import { type BrowserConfig, type UploadErrorEventPayload } from '../../../types';

const getFileInput = () => screen.getByTestId('media-picker-file-input') as HTMLInputElement;
const createTestFile = () => new File(['file contents'], 'hello.txt', { type: 'text/plain' });

describe('Browser upload phases', () => {
	const mediaClient = fakeMediaClient();
	let fileStateObservable = createMediaSubject();
	mediaClient.file.upload = jest.fn(() => {
		return fromObservable(fileStateObservable);
	});

	const browseConfig: BrowserConfig & LocalUploadConfig = {
		uploadParams: {},
	};
	const uploadId = 'upload id';
	const uuidRegexMatcher = expect.stringMatching(
		/[0-9a-fA-F]{8}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{12}/,
	);
	let oldDateNow: () => number;

	beforeEach(() => {
		oldDateNow = Date.now;
		Date.now = () => 111;
		fileStateObservable = createMediaSubject();
	});

	afterEach(() => {
		Date.now = oldDateNow;
	});

	it('should fire a commenced event on uploadsStart', async () => {
		const user = userEvent.setup();
		mediaClient.file.touchFiles = jest.fn((descriptors: TouchFileDescriptor[]) =>
			Promise.resolve({
				created: descriptors.map(({ fileId }) => ({
					fileId,
					uploadId,
				})),
				rejected: [],
			}),
		);
		const onUploadsStart = jest.fn();
		render(
			<Browser mediaClient={mediaClient} config={browseConfig} onUploadsStart={onUploadsStart} />,
		);

		await user.upload(getFileInput(), createTestFile());

		await waitFor(() => {
			expect(onUploadsStart).toHaveBeenCalledWith({
				files: [
					{
						creationDate: Date.now(),
						id: uuidRegexMatcher,
						name: 'hello.txt',
						occurrenceKey: uuidRegexMatcher,
						size: 13,
						type: 'text/plain',
					},
				],
				traceContext: { traceId: expect.any(String) },
			});
		});
	});

	it('should fire an uploaded success event on end', async () => {
		const user = userEvent.setup();
		mediaClient.file.touchFiles = jest.fn((descriptors: TouchFileDescriptor[]) => {
			return Promise.resolve({
				created: descriptors.map(({ fileId }) => ({
					fileId,
					uploadId,
				})),
				rejected: [],
			});
		});
		const onUploadsStart = jest.fn();
		const onEnd = jest.fn();
		render(
			<Browser
				mediaClient={mediaClient}
				config={browseConfig}
				onUploadsStart={onUploadsStart}
				onEnd={onEnd}
			/>,
		);

		await user.upload(getFileInput(), createTestFile());

		await waitFor(() => expect(onUploadsStart).toHaveBeenCalled());

		fileStateObservable.next({
			id: 'file id',
			mediaType: 'doc',
			name: '',
			mimeType: 'text/plain',
			size: 13,
			status: 'processing',
		});

		await waitFor(() => {
			expect(onEnd).toHaveBeenCalledWith({
				file: {
					creationDate: Date.now(),
					id: uuidRegexMatcher,
					name: 'hello.txt',
					occurrenceKey: uuidRegexMatcher,
					size: 13,
					type: 'text/plain',
				},
				traceContext: { traceId: expect.any(String) },
			});
		});
	});

	it('should fire an uploaded fail event on end', async () => {
		const user = userEvent.setup();
		const error = new Error('oops');
		mediaClient.file.touchFiles = jest.fn((descriptors: TouchFileDescriptor[]) =>
			Promise.resolve({
				created: descriptors.map(({ fileId }) => ({
					fileId,
					uploadId,
				})),
				rejected: [],
			}),
		);
		const onError: jest.MockedFunction<(payload: UploadErrorEventPayload) => void> = jest.fn();
		render(<Browser mediaClient={mediaClient} config={browseConfig} onError={onError} />);

		await user.upload(getFileInput(), createTestFile());

		fileStateObservable.error(error);

		await waitFor(() => {
			expectFunctionToHaveBeenCalledWith(onError, [
				{
					error: {
						description: 'oops',
						fileId: uuidRegexMatcher,
						name: 'upload_fail',
						rawError: error,
					},
					fileId: uuidRegexMatcher,
					traceContext: { traceId: expect.any(String) },
				},
			]);
		});
	});

	it('should not introduce any accessibility violations', async () => {
		render(<Browser mediaClient={mediaClient} config={browseConfig} />);
		await expect(document.body).toBeAccessible();
	});
});
