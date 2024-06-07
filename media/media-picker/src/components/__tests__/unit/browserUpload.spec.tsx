import React from 'react';
import { mount } from 'enzyme';

import {
	expectFunctionToHaveBeenCalledWith,
	fakeMediaClient,
	flushPromises,
} from '@atlaskit/media-test-helpers';
import { Browser } from '../../browser/browser';
import {
	type TouchFileDescriptor,
	createMediaSubject,
	fromObservable,
} from '@atlaskit/media-client';
import { type LocalUploadConfig } from '../../types';
import { type BrowserConfig, type UploadErrorEventPayload } from '../../../types';

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
		mediaClient.file.touchFiles = jest.fn(
			(descriptors: TouchFileDescriptor[], collection?: string) =>
				Promise.resolve({
					created: descriptors.map(({ fileId }) => ({
						fileId,
						uploadId,
					})),
					rejected: [],
				}),
		);
		const onUploadsStart = jest.fn();
		const browser = mount(
			<Browser mediaClient={mediaClient} config={browseConfig} onUploadsStart={onUploadsStart} />,
		);
		const fileContents = 'file contents';
		const file = new Blob([fileContents], { type: 'text/plain' });

		browser.find('input').simulate('change', { target: { files: [file] } });

		await flushPromises();

		expect(onUploadsStart).toHaveBeenCalledWith({
			files: [
				{
					creationDate: Date.now(),
					id: uuidRegexMatcher,
					name: undefined,
					occurrenceKey: uuidRegexMatcher,
					size: 13,
					type: 'text/plain',
				},
			],
			traceContext: { traceId: expect.any(String) },
		});
	});

	it('should fire an uploaded success event on end', async () => {
		mediaClient.file.touchFiles = jest.fn(
			(descriptors: TouchFileDescriptor[], collection?: string) => {
				return Promise.resolve({
					created: descriptors.map(({ fileId }) => ({
						fileId,
						uploadId,
					})),
					rejected: [],
				});
			},
		);
		const onEnd = jest.fn();
		const browser = mount(
			<Browser mediaClient={mediaClient} config={browseConfig} onEnd={onEnd} />,
		);
		const fileContents = 'file contents';
		const file = new Blob([fileContents], { type: 'text/plain' });

		browser.find('input').simulate('change', { target: { files: [file] } });

		await flushPromises();

		fileStateObservable.next({
			id: 'file id',
			mediaType: 'doc',
			name: '',
			mimeType: 'text/plain',
			size: 13,
			status: 'processing',
		});

		expect(onEnd).toHaveBeenCalledWith({
			file: {
				creationDate: Date.now(),
				id: uuidRegexMatcher,
				name: undefined,
				occurrenceKey: uuidRegexMatcher,
				size: 13,
				type: 'text/plain',
			},
			traceContext: { traceId: expect.any(String) },
		});
	});

	it('should fire an uploaded fail event on end', async () => {
		const error = new Error('oops');
		mediaClient.file.touchFiles = jest.fn(
			(descriptors: TouchFileDescriptor[], collection?: string) =>
				Promise.resolve({
					created: descriptors.map(({ fileId }) => ({
						fileId,
						uploadId,
					})),
					rejected: [],
				}),
		);
		const onError: jest.MockedFunction<(payload: UploadErrorEventPayload) => void> = jest.fn();
		const browser = mount(
			<Browser mediaClient={mediaClient} config={browseConfig} onError={onError} />,
		);
		const fileContents = 'file contents';
		const file = new Blob([fileContents], { type: 'text/plain' });

		browser.find('input').simulate('change', { target: { files: [file] } });

		await flushPromises();

		fileStateObservable.error(error);

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
