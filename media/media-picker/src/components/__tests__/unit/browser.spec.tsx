import React from 'react';

jest.mock('../../../service/uploadServiceImpl');

import { render, screen, userEvent } from '@atlassian/testing-library';
import Button from '@atlaskit/button/standard-button';
import { fakeMediaClient } from '@atlaskit/media-test-helpers';

import { type BrowseFn, Browser, BrowserBase } from '../../browser/browser';
import { type BrowserConfig } from '../../../types';
import { UploadServiceImpl } from '../../../service/uploadServiceImpl';

const MockedUploadServiceImpl = jest.mocked(UploadServiceImpl);

type UploadServiceMock = {
	addFiles: jest.Mock;
	addFile: jest.Mock;
	cancel: jest.Mock;
	setUploadParams: jest.Mock;
};

const getLatestUploadServiceMock = (): UploadServiceMock => {
	const instances = MockedUploadServiceImpl.mock.instances;
	return instances[instances.length - 1] as unknown as UploadServiceMock;
};

const getFileInput = () => screen.getByTestId('media-picker-file-input') as HTMLInputElement;

describe('Browser', () => {
	const mediaClient = fakeMediaClient();
	const browseConfig: BrowserConfig = {
		uploadParams: { collection: 'collectionA' },
	};

	afterEach(() => {
		jest.clearAllMocks();
	});

	it('should add upload files when user picks some', async () => {
		const user = userEvent.setup();
		render(<Browser mediaClient={mediaClient} config={{ ...browseConfig, multiple: true }} />);

		const file = new File(['hello'], 'hello.txt', { type: 'text/plain' });
		await user.upload(getFileInput(), [file]);

		const uploadService = getLatestUploadServiceMock();
		expect(uploadService.addFiles).toHaveBeenCalledTimes(1);
		expect(uploadService.addFiles).toHaveBeenCalledWith([file]);
	});

	it('should provide a function to onBrowseFn callback property and call click function on native input element', () => {
		const onBrowseFnMock = jest.fn<void, [() => void]>();
		render(<Browser mediaClient={mediaClient} config={browseConfig} onBrowseFn={onBrowseFnMock} />);

		const inputEl = getFileInput();
		const clickSpy = jest.spyOn(inputEl, 'click');

		expect(onBrowseFnMock).toHaveBeenCalledTimes(1);
		onBrowseFnMock.mock.calls[0][0]();
		expect(clickSpy).toHaveBeenCalled();
	});

	it('should provide a function to onCancelFn callback property and call uploadService.cancel', () => {
		const onCancelFnMock = jest.fn<void, [(uniqueIdentifier: string) => void]>();
		render(<Browser mediaClient={mediaClient} config={browseConfig} onCancelFn={onCancelFnMock} />);

		expect(onCancelFnMock).toHaveBeenCalledTimes(1);
		onCancelFnMock.mock.calls[0][0]('some-id');
		expect(getLatestUploadServiceMock().cancel).toHaveBeenCalled();
	});

	it('should render with children', async () => {
		const user = userEvent.setup();
		render(
			<Browser mediaClient={mediaClient} config={browseConfig}>
				{(browse: BrowseFn) => <Button onClick={browse}>Upload</Button>}
			</Browser>,
		);

		const inputEl = getFileInput();
		const clickSpy = jest.spyOn(inputEl, 'click');

		await user.click(screen.getByRole('button', { name: 'Upload' }));

		expect(clickSpy).toHaveBeenCalled();
	});

	it('should call onError if invalid replaceFileId given', () => {
		const onError = jest.fn();
		render(
			<Browser
				mediaClient={mediaClient}
				config={{
					...browseConfig,
					replaceFileId: 'some-invalid-id',
				}}
				onError={onError}
			/>,
		);

		expect(onError).toHaveBeenCalledWith({
			error: {
				description: 'Invalid replaceFileId format',
				fileId: 'some-invalid-id',
				name: 'invalid_uuid',
			},
			fileId: 'some-invalid-id',
		});
	});

	it('should emit fail event if invalid replaceFileId given', () => {
		const createAnalyticsEvent = jest.fn().mockReturnValue({ fire: jest.fn() });
		render(
			<BrowserBase
				mediaClient={mediaClient}
				config={{
					...browseConfig,
					replaceFileId: 'some-invalid-id',
				}}
				createAnalyticsEvent={createAnalyticsEvent}
			/>,
		);

		expect(createAnalyticsEvent).toHaveBeenCalledWith({
			action: 'failed',
			actionSubject: 'mediaUpload',
			actionSubjectId: 'localMedia',
			attributes: {
				failReason: 'invalid_uuid',
				status: 'fail',
				uuid: 'some-invalid-id',
			},
			eventType: 'operational',
		});
	});

	it('should force multiple to false if replaceFileId passed', () => {
		render(
			<Browser
				mediaClient={mediaClient}
				config={{
					...browseConfig,
					multiple: true,
					replaceFileId: 'some-file-id',
				}}
			/>,
		);

		expect(getFileInput()).not.toHaveAttribute('multiple');
	});

	it('should add single upload file when user picks some passing replaceFileId', async () => {
		const user = userEvent.setup();
		render(
			<Browser
				mediaClient={mediaClient}
				config={{
					...browseConfig,
					replaceFileId: 'some-file-id',
				}}
			/>,
		);

		const file = new File(['hello'], 'hello.txt', { type: 'text/plain' });
		await user.upload(getFileInput(), file);

		const uploadService = getLatestUploadServiceMock();
		expect(uploadService.addFile).toHaveBeenCalledTimes(1);
		expect(uploadService.addFile).toHaveBeenCalledWith(file, 'some-file-id');
	});

	it('should not introduce any accessibility violations', async () => {
		render(
			<Browser mediaClient={mediaClient} config={browseConfig}>
				{(browse: BrowseFn) => <Button onClick={browse}>Upload</Button>}
			</Browser>,
		);
		await expect(document.body).toBeAccessible();
	});

	it('should use latest UploadParams during upload', async () => {
		const user = userEvent.setup();
		const onBrowseFnMock = jest.fn();
		const { rerender } = render(
			<Browser mediaClient={mediaClient} config={browseConfig} onBrowseFn={onBrowseFnMock} />,
		);

		const newBrowseConfig: BrowserConfig = {
			uploadParams: { collection: 'collectionB' },
		};

		rerender(
			<Browser mediaClient={mediaClient} config={newBrowseConfig} onBrowseFn={onBrowseFnMock} />,
		);

		const file = new File(['hello'], 'hello.txt', { type: 'text/plain' });
		await user.upload(getFileInput(), file);

		const uploadService = getLatestUploadServiceMock();
		expect(uploadService.setUploadParams).toHaveBeenCalledTimes(1);
		expect(uploadService.setUploadParams).toHaveBeenCalledWith(newBrowseConfig.uploadParams);
	});
});
