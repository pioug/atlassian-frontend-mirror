import React from 'react';

jest.mock('../../../service/uploadServiceImpl');

import { render } from '@atlassian/testing-library';
import { FabricChannel } from '@atlaskit/analytics-listeners';
import { AnalyticsListener } from '@atlaskit/analytics-next';
import { MEDIA_CONTEXT } from '@atlaskit/analytics-namespaced-context/MediaAnalyticsContext';
import { ClipboardMockFile, fakeMediaClient } from '@atlaskit/media-test-helpers';

import { LocalFileSource } from '../../../service/types';
import { Clipboard } from '../../clipboard/clipboard';
import { type ClipboardConfig } from '../../../types';
import { UploadServiceImpl } from '../../../service/uploadServiceImpl';

const MockedUploadServiceImpl = jest.mocked(UploadServiceImpl);

type UploadServiceMock = {
	addFilesWithSource: jest.Mock;
};

const getLatestUploadServiceMock = (): UploadServiceMock => {
	const instances = MockedUploadServiceImpl.mock.instances;
	return instances[instances.length - 1] as unknown as UploadServiceMock;
};

type CapturedHandler = (event: unknown) => void;

describe('Clipboard', () => {
	const mediaClient = fakeMediaClient();
	let documentPasteHandlers: CapturedHandler[];
	let containerPasteHandlers: CapturedHandler[];

	const legacyConfig: ClipboardConfig = {
		uploadParams: {},
	};

	const container = document.body;
	const config: ClipboardConfig = {
		container,
		uploadParams: {},
	};

	beforeEach(() => {
		documentPasteHandlers = [];
		containerPasteHandlers = [];

		jest
			.spyOn(document, 'addEventListener')
			.mockImplementation((event: string, cb: EventListenerOrEventListenerObject) => {
				if (event === 'paste' && typeof cb === 'function') {
					documentPasteHandlers.push(cb as CapturedHandler);
				}
			});

		jest
			.spyOn(container, 'addEventListener')
			.mockImplementation((event: string, cb: EventListenerOrEventListenerObject) => {
				if (event === 'paste' && typeof cb === 'function') {
					containerPasteHandlers.push(cb as CapturedHandler);
				}
			});
	});

	afterEach(() => {
		jest.resetAllMocks();
	});

	const lastDocumentPasteHandler = () => documentPasteHandlers[documentPasteHandlers.length - 1];
	const lastContainerPasteHandler = () => containerPasteHandlers[containerPasteHandlers.length - 1];

	it('(Legacy mechanism) should disable event handler if event target is html input element', () => {
		render(<Clipboard mediaClient={mediaClient} config={legacyConfig} />);

		const event = {
			target: document.createElement('input'),
			clipboardData: {
				files: [new ClipboardMockFile()],
				types: [],
			},
		};

		lastDocumentPasteHandler()(event);

		expect(getLatestUploadServiceMock().addFilesWithSource).toHaveBeenCalledTimes(0);
	});

	it('(Legacy mechanism) should call this.uploadService.addFilesWithSource() when a paste event is dispatched with a single file', () => {
		render(<Clipboard mediaClient={mediaClient} config={legacyConfig} />);

		const event = {
			clipboardData: {
				files: [new ClipboardMockFile()],
				types: [],
			},
		};

		lastDocumentPasteHandler()(event);

		expect(getLatestUploadServiceMock().addFilesWithSource).toHaveBeenCalledTimes(1);
	});

	it('(Legacy mechanism) should NOT call this.uploadService.addFilesWithSource() when a paste event is dispatched without a file', () => {
		render(<Clipboard mediaClient={mediaClient} config={legacyConfig} />);

		const event = {
			clipboardData: {
				files: [],
				types: [],
			},
		};

		lastDocumentPasteHandler()(event);

		expect(getLatestUploadServiceMock().addFilesWithSource).not.toHaveBeenCalled();
	});

	it('(Legacy mechanism) should call this.uploadService.addFilesWithSource() when a paste event is dispatched with multiple files', () => {
		render(<Clipboard mediaClient={mediaClient} config={legacyConfig} />);

		const mockFile1 = new ClipboardMockFile();
		const mockFile2 = new ClipboardMockFile();

		const event = {
			clipboardData: {
				files: [mockFile1, mockFile2],
				types: [],
			},
		};

		lastDocumentPasteHandler()(event);

		const uploadService = getLatestUploadServiceMock();
		expect(uploadService.addFilesWithSource).toHaveBeenCalledTimes(1);
		const passedFiles = uploadService.addFilesWithSource.mock.calls[0][0];
		expect(passedFiles[0].file).toEqual(mockFile1);
		expect(passedFiles[1].file).toEqual(mockFile2);
		expect(passedFiles[0].source).toEqual(LocalFileSource.PastedFile);
		expect(passedFiles[1].source).toEqual(LocalFileSource.PastedFile);
	});

	it('(Legacy mechanism) should not trigger errors when event.clipboardData is undefined', () => {
		render(<Clipboard mediaClient={mediaClient} config={legacyConfig} />);

		const event = {};
		lastDocumentPasteHandler()(event);

		expect(getLatestUploadServiceMock().addFilesWithSource).toHaveBeenCalledTimes(0);
	});

	it('(Legacy mechanism) should detect pasted screenshots from clipboard event data', () => {
		render(<Clipboard mediaClient={mediaClient} config={legacyConfig} />);

		const mockFile = new ClipboardMockFile();
		const event = {
			clipboardData: {
				files: [mockFile],
				types: ['some-type'],
			},
		};
		lastDocumentPasteHandler()(event);

		const uploadService = getLatestUploadServiceMock();
		const passedFiles = uploadService.addFilesWithSource.mock.calls[0][0];
		expect(passedFiles[0].file).toEqual(mockFile);
		expect(passedFiles[0].source).toEqual(LocalFileSource.PastedScreenshot);
	});

	it('(Legacy mechanism) should remove event handler only when there are no more clipboard instances left', () => {
		const { unmount: unmountFirst } = render(
			<Clipboard mediaClient={mediaClient} config={legacyConfig} />,
		);
		const firstUploadService = getLatestUploadServiceMock();

		const mockFile = new ClipboardMockFile();
		const event = {
			clipboardData: {
				files: [mockFile],
				types: [],
			},
		};

		const { unmount: unmountSecond } = render(
			<Clipboard mediaClient={mediaClient} config={legacyConfig} />,
		);
		const secondUploadService = getLatestUploadServiceMock();

		lastDocumentPasteHandler()(event);

		expect(firstUploadService.addFilesWithSource).toHaveBeenCalledTimes(0);
		expect(secondUploadService.addFilesWithSource).toHaveBeenCalledTimes(1);

		unmountSecond();

		lastDocumentPasteHandler()(event);

		expect(firstUploadService.addFilesWithSource).toHaveBeenCalledTimes(1);

		unmountFirst();
	});

	it('(Legacy mechanism) should fire Analytics Event on files picked', () => {
		const analyticsHandler = jest.fn();

		render(
			<AnalyticsListener channel={FabricChannel.media} onEvent={analyticsHandler}>
				<Clipboard mediaClient={mediaClient} config={legacyConfig} />
			</AnalyticsListener>,
		);

		const mockFile1 = new ClipboardMockFile();
		const mockFile2 = new ClipboardMockFile();

		const event = {
			clipboardData: {
				files: [mockFile1, mockFile2],
				types: [],
			},
		};

		lastDocumentPasteHandler()(event);

		expect(getLatestUploadServiceMock().addFilesWithSource).toHaveBeenCalledTimes(1);
		expect(analyticsHandler).toHaveBeenCalledTimes(1);
		expect(analyticsHandler).toHaveBeenCalledWith(
			expect.objectContaining({
				context: [
					{
						packageName: expect.any(String),
						packageVersion: expect.any(String),
						componentName: 'clipboard',
						component: 'clipboard',
						[MEDIA_CONTEXT]: {
							featureFlags: undefined,
						},
					},
				],
				payload: {
					eventType: 'ui',
					action: 'pasted',
					actionSubject: 'clipboard',
					attributes: {
						fileCount: 2,
						fileAttributes: expect.arrayContaining([
							{ fileMimetype: '', fileSize: 0, fileSource: 'pastedFile' },
							{ fileMimetype: '', fileSize: 0, fileSource: 'pastedFile' },
						]),
					},
				},
			}),
			FabricChannel.media,
		);
	});

	it('should call this.uploadService.addFilesWithSource() when a paste event is dispatched with a single file', () => {
		render(<Clipboard mediaClient={mediaClient} config={config} />);

		const event = {
			clipboardData: {
				files: [new ClipboardMockFile()],
				types: [],
			},
		};

		lastContainerPasteHandler()(event);

		expect(getLatestUploadServiceMock().addFilesWithSource).toHaveBeenCalledTimes(1);
	});

	it('should call this.uploadService.addFilesWithSource() when a paste event is dispatched with a single file (onPaste without return value)', () => {
		const configWithOnPaste: ClipboardConfig = {
			...config,
			onPaste: () => {
				return undefined;
			},
		};
		render(<Clipboard mediaClient={mediaClient} config={configWithOnPaste} />);

		const event = {
			clipboardData: {
				files: [new ClipboardMockFile()],
				types: [],
			},
		};

		lastContainerPasteHandler()(event);

		expect(getLatestUploadServiceMock().addFilesWithSource).toHaveBeenCalledTimes(1);
	});

	it('should call this.uploadService.addFilesWithSource() when a paste event is dispatched with a single file (onPaste returns `false`)', () => {
		const configWithOnPaste: ClipboardConfig = { ...config, onPaste: () => false };
		render(<Clipboard mediaClient={mediaClient} config={configWithOnPaste} />);

		const event = {
			clipboardData: {
				files: [new ClipboardMockFile()],
				types: [],
			},
		};

		lastContainerPasteHandler()(event);

		expect(getLatestUploadServiceMock().addFilesWithSource).toHaveBeenCalledTimes(1);
	});

	it('should not call this.uploadService.addFilesWithSource() when a paste event is dispatched with a single file (onPaste returns `true`)', () => {
		const configWithOnPaste: ClipboardConfig = { ...config, onPaste: () => true };
		render(<Clipboard mediaClient={mediaClient} config={configWithOnPaste} />);

		const event = {
			clipboardData: {
				files: [new ClipboardMockFile()],
				types: [],
			},
		};

		lastContainerPasteHandler()(event);

		expect(getLatestUploadServiceMock().addFilesWithSource).toHaveBeenCalledTimes(0);
	});

	it('should not call this.uploadService.addFilesWithSource() when a paste event is dispatched without a file', () => {
		render(<Clipboard mediaClient={mediaClient} config={config} />);

		const event = {
			clipboardData: {
				files: [],
				types: [],
			},
		};

		lastContainerPasteHandler()(event);

		expect(getLatestUploadServiceMock().addFilesWithSource).not.toHaveBeenCalled();
	});

	it('should call this.uploadService.addFilesWithSource() when a paste event is dispatched with multiple files', () => {
		render(<Clipboard mediaClient={mediaClient} config={config} />);

		const mockFile1 = new ClipboardMockFile();
		const mockFile2 = new ClipboardMockFile();

		const event = {
			clipboardData: {
				files: [mockFile1, mockFile2],
				types: [],
			},
		};

		lastContainerPasteHandler()(event);

		const uploadService = getLatestUploadServiceMock();
		expect(uploadService.addFilesWithSource).toHaveBeenCalledTimes(1);
		const passedFiles = uploadService.addFilesWithSource.mock.calls[0][0];
		expect(passedFiles[0].file).toEqual(mockFile1);
		expect(passedFiles[1].file).toEqual(mockFile2);
		expect(passedFiles[0].source).toEqual(LocalFileSource.PastedFile);
		expect(passedFiles[1].source).toEqual(LocalFileSource.PastedFile);
	});

	it('should not trigger errors when event.clipboardData is undefined', () => {
		render(<Clipboard mediaClient={mediaClient} config={config} />);

		const event = {};
		lastContainerPasteHandler()(event);

		expect(getLatestUploadServiceMock().addFilesWithSource).toHaveBeenCalledTimes(0);
	});

	it('should detect pasted screenshots from clipboard event data', () => {
		render(<Clipboard mediaClient={mediaClient} config={config} />);

		const mockFile = new ClipboardMockFile();
		const event = {
			clipboardData: {
				files: [mockFile],
				types: ['some-type'],
			},
		};

		lastContainerPasteHandler()(event);

		const uploadService = getLatestUploadServiceMock();
		const passedFiles = uploadService.addFilesWithSource.mock.calls[0][0];
		expect(passedFiles[0].file).toEqual(mockFile);
		expect(passedFiles[0].source).toEqual(LocalFileSource.PastedScreenshot);
	});

	it('should fire Analytics Event on files picked', () => {
		const analyticsHandler = jest.fn();

		render(
			<AnalyticsListener channel={FabricChannel.media} onEvent={analyticsHandler}>
				<Clipboard mediaClient={mediaClient} config={config} />
			</AnalyticsListener>,
		);

		const mockFile1 = new ClipboardMockFile();
		const mockFile2 = new ClipboardMockFile();

		const event = {
			clipboardData: {
				files: [mockFile1, mockFile2],
				types: [],
			},
		};

		lastContainerPasteHandler()(event);

		expect(getLatestUploadServiceMock().addFilesWithSource).toHaveBeenCalledTimes(1);
		expect(analyticsHandler).toHaveBeenCalledTimes(1);
		expect(analyticsHandler).toHaveBeenCalledWith(
			expect.objectContaining({
				context: [
					{
						packageName: expect.any(String),
						packageVersion: expect.any(String),
						componentName: 'clipboard',
						component: 'clipboard',
						[MEDIA_CONTEXT]: {
							featureFlags: undefined,
						},
					},
				],
				payload: {
					eventType: 'ui',
					action: 'pasted',
					actionSubject: 'clipboard',
					attributes: {
						fileCount: 2,
						fileAttributes: expect.arrayContaining([
							{ fileMimetype: '', fileSize: 0, fileSource: 'pastedFile' },
							{ fileMimetype: '', fileSize: 0, fileSource: 'pastedFile' },
						]),
					},
				},
			}),
			FabricChannel.media,
		);
	});

	it('should not introduce any accessibility violations', async () => {
		render(<Clipboard mediaClient={mediaClient} config={config} />);
		await expect(document.body).toBeAccessible();
	});
});
