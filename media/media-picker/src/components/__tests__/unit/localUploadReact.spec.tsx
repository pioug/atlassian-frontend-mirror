jest.mock('../../../service/uploadServiceImpl');

import {
	LocalUploadComponentReact,
	type LocalUploadComponentBaseProps,
} from '../../localUploadReact';
import { render, screen, waitFor } from '@testing-library/react';

import React from 'react';
import {
	type MediaFile,
	type UploadEventPayloadMap,
	type UploadErrorEventPayload,
	type UploadEndEventPayload,
	type UploadPreviewUpdateEventPayload,
	type UploadsStartEventPayload,
	type UploadRejectionData,
	type FileSizeLimitExceededData,
	type FileEmptyData,
} from '../../../types';
import { fg } from '@atlaskit/platform-feature-flags';
import { type UploadService } from '../../../service/types';
import { SCALE_FACTOR_DEFAULT } from '../../../util/getPreviewFromImage';
import * as ufoWrapper from '../../../util/ufoExperiences';
import { type UploadComponent } from '../../component';
import { fakeMediaClient } from '@atlaskit/media-test-helpers';

jest.mock('@atlaskit/platform-feature-flags');

const imageFile: MediaFile = {
	id: 'some-id',
	name: 'some-name',
	size: 12345,
	creationDate: Date.now(),
	type: 'image/jpg',
};

// Skipping as tests timing out due to open handles (#hot-112198)
describe.skip('LocalUploadReact', () => {
	const onUploadsStart = jest.fn();
	const onPreviewUpdate = jest.fn();
	const onEnd = jest.fn();
	const onError = jest.fn();
	const onUploadRejection = jest.fn();

	const mediaClient = fakeMediaClient();

	const config = {
		uploadParams: {
			onUploadRejection,
		},
	};

	const mockstartMediaUploadUfoExperience = jest.spyOn(ufoWrapper, 'startMediaUploadUfoExperience');

	const mocksucceedMediaUploadUfoExperience = jest.spyOn(
		ufoWrapper,
		'succeedMediaUploadUfoExperience',
	);

	const mockfailMediaUploadUfoExperience = jest.spyOn(ufoWrapper, 'failMediaUploadUfoExperience');

	afterEach(() => {
		jest.resetAllMocks();
	});

	it('should call onUploadsStart with proper arguments and should start UFO experience', () => {
		let uploadComponent: UploadComponent<UploadEventPayloadMap>;
		class DummyLocalUploadComponent extends LocalUploadComponentReact<LocalUploadComponentBaseProps> {
			constructor(props: LocalUploadComponentBaseProps) {
				super(props, 'browser');
				uploadComponent = this.uploadComponent;
			}

			render() {
				return null;
			}
		}

		const files: UploadsStartEventPayload = {
			files: [imageFile],
			traceContext: {
				traceId: 'test-trace-id',
			},
		};
		render(
			<DummyLocalUploadComponent
				mediaClient={mediaClient}
				config={config}
				onUploadsStart={onUploadsStart}
				onPreviewUpdate={onPreviewUpdate}
				onEnd={onEnd}
				onError={onError}
			/>,
		);
		onUploadRejection.mockImplementation(() => true);

		uploadComponent!.emitUploadsStart(files.files, files.traceContext);

		expect(onUploadsStart).toHaveBeenCalledWith(files);
		expect(mockstartMediaUploadUfoExperience).toHaveBeenCalledTimes(1);
		expect(mockstartMediaUploadUfoExperience).toHaveBeenCalledWith(
			expect.any(String),
			expect.any(String),
		);
	});

	it('should call onPreviewUpdate with proper arguments', () => {
		let uploadComponent: UploadComponent<UploadEventPayloadMap>;
		class DummyLocalUploadComponent extends LocalUploadComponentReact<LocalUploadComponentBaseProps> {
			constructor(props: LocalUploadComponentBaseProps) {
				super(props, 'browser');
				uploadComponent = this.uploadComponent;
			}

			render() {
				return null;
			}
		}

		const preview: UploadPreviewUpdateEventPayload = {
			file: imageFile,
			preview: {
				dimensions: {
					width: 100,
					height: 200,
				},
				scaleFactor: SCALE_FACTOR_DEFAULT,
			},
		};
		render(
			<DummyLocalUploadComponent
				mediaClient={mediaClient}
				config={config}
				onUploadsStart={onUploadsStart}
				onPreviewUpdate={onPreviewUpdate}
				onEnd={onEnd}
				onError={onError}
			/>,
		);
		onUploadRejection.mockImplementation(() => true);

		uploadComponent!.emitUploadPreviewUpdate(preview.file, preview.preview);
		expect(onPreviewUpdate).toHaveBeenCalledWith({
			file: preview.file,
			preview: preview.preview,
		});
	});

	it('should call onEnd and UFO succeeded experience event with proper arguments', () => {
		let uploadComponent: UploadComponent<UploadEventPayloadMap>;
		class DummyLocalUploadComponent extends LocalUploadComponentReact<LocalUploadComponentBaseProps> {
			constructor(props: LocalUploadComponentBaseProps) {
				super(props, 'browser');
				uploadComponent = this.uploadComponent;
			}

			render() {
				return null;
			}
		}
		render(
			<DummyLocalUploadComponent
				mediaClient={mediaClient}
				config={config}
				onUploadsStart={onUploadsStart}
				onPreviewUpdate={onPreviewUpdate}
				onEnd={onEnd}
				onError={onError}
			/>,
		);
		const file: UploadEndEventPayload = {
			file: imageFile,
			traceContext: {
				traceId: 'test-trace-id',
			},
		};

		uploadComponent!.emitUploadEnd(file.file, file.traceContext);

		expect(onEnd).toHaveBeenCalledWith(file);
		expect(mocksucceedMediaUploadUfoExperience).toHaveBeenCalledWith(imageFile.id, {
			fileId: imageFile.id,
			fileSize: imageFile.size,
			fileMimetype: imageFile.type,
		});
	});

	it('should cal onError and UFO failed experience event with proper arguments', () => {
		(fg as jest.Mock).mockImplementation((fgName) => fgName === 'add_media_picker_error_detail');
		let uploadComponent: UploadComponent<UploadEventPayloadMap>;
		class DummyLocalUploadComponent extends LocalUploadComponentReact<LocalUploadComponentBaseProps> {
			constructor(props: LocalUploadComponentBaseProps) {
				super(props, 'browser');
				uploadComponent = this.uploadComponent;
			}

			render() {
				return null;
			}
		}
		render(
			<DummyLocalUploadComponent
				mediaClient={mediaClient}
				config={config}
				onUploadsStart={onUploadsStart}
				onPreviewUpdate={onPreviewUpdate}
				onEnd={onEnd}
				onError={onError}
			/>,
		);

		const error = new Error('failed to upload');

		const payload: UploadErrorEventPayload = {
			fileId: imageFile.id,
			error: {
				name: 'object_create_fail',
				description: 'error',
				rawError: error,
			},
			traceContext: {
				traceId: 'test-trace-id',
			},
		};

		uploadComponent!.emitUploadError(payload.fileId, payload.error, payload.traceContext);

		expect(onError).toHaveBeenCalledWith(payload);
		expect(mockfailMediaUploadUfoExperience).toHaveBeenCalledWith(imageFile.id, {
			failReason: payload.error.name,
			error: 'unknown',
			request: undefined,
			fileAttributes: {
				fileId: imageFile.id,
			},
			uploadDurationMsec: -1,
			errorDetail: error.message,
		});
	});

	it('should call config onFileRejection callback', () => {
		const data: UploadRejectionData = {
			reason: 'fileSizeLimitExceeded',
			fileName: 'test.png',
			limit: 100,
		};

		let uploadService: UploadService;
		class DummyLocalUploadComponent extends LocalUploadComponentReact<LocalUploadComponentBaseProps> {
			constructor(props: LocalUploadComponentBaseProps) {
				super(props, 'browser');
				uploadService = this.uploadService;
			}

			render() {
				return null;
			}
		}
		render(
			<DummyLocalUploadComponent
				mediaClient={mediaClient}
				config={config}
				onUploadsStart={onUploadsStart}
				onPreviewUpdate={onPreviewUpdate}
				onEnd={onEnd}
				onError={onError}
			/>,
		);

		const onFileRejectionInUploadService = jest.spyOn(uploadService!, 'onFileRejection');

		const fileRejectionCallback = onFileRejectionInUploadService.mock.calls[0][0];
		fileRejectionCallback(data);

		expect(onUploadRejection).toHaveBeenCalledWith(data);
	});

	describe('addFlag', () => {
		const fileSizeLimitExceededData: FileSizeLimitExceededData = {
			reason: 'fileSizeLimitExceeded',
			fileName: 'test.png',
			limit: 100,
		};

		const fileEmptyData: FileEmptyData = {
			reason: 'fileEmpty',
			fileName: 'test.png',
		};

		it.each([
			['fileSizeLimitExceeded', fileSizeLimitExceededData],
			['fileEmpty', fileEmptyData],
		])('should call the addFlag for %s when config callback returns false', (_type, data) => {
			onUploadRejection.mockImplementation(() => false);

			let uploadService: UploadService;
			class DummyLocalUploadComponent extends LocalUploadComponentReact<LocalUploadComponentBaseProps> {
				constructor(props: LocalUploadComponentBaseProps) {
					super(props, 'browser');
					uploadService = this.uploadService;
				}

				render() {
					return this.state.errorFlags.map((flag) => <p>{flag.fileName}</p>);
				}
			}
			render(
				<DummyLocalUploadComponent
					mediaClient={mediaClient}
					config={config}
					onUploadsStart={onUploadsStart}
					onPreviewUpdate={onPreviewUpdate}
					onEnd={onEnd}
					onError={onError}
				/>,
			);

			const onFileRejectionInUploadService = jest.spyOn(uploadService!, 'onFileRejection');

			const argument = onFileRejectionInUploadService.mock.calls[0][0];
			argument(data);

			expect(onUploadRejection).toHaveBeenCalledWith(data);
			waitFor(() => {
				expect(screen.getByText('test.png')).toBeInTheDocument();
			});
		});
	});

	it('should set the onFileRejection callback for UploadService to the default implementation when the config is missing callback', () => {
		let uploadService: UploadService;
		class DummyLocalUploadComponent extends LocalUploadComponentReact<LocalUploadComponentBaseProps> {
			constructor(props: LocalUploadComponentBaseProps) {
				super(props, 'browser');
				uploadService = this.uploadService;
			}

			render() {
				return null;
			}
		}
		render(
			<DummyLocalUploadComponent
				mediaClient={mediaClient}
				config={config}
				onUploadsStart={onUploadsStart}
				onPreviewUpdate={onPreviewUpdate}
				onEnd={onEnd}
				onError={onError}
			/>,
		);

		const onFileRejectionInUploadService = jest.spyOn(uploadService!, 'onFileRejection');
		expect(onFileRejectionInUploadService).not.toHaveBeenCalledWith(onUploadRejection);
	});
});
