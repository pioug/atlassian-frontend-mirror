jest.mock('../../../service/uploadServiceImpl');

import {
	LocalUploadComponentReact,
	type LocalUploadComponentBaseProps,
} from '../../localUploadReact';
import { type ReactWrapper, mount } from 'enzyme';
import React from 'react';
import {
	type MediaFile,
	type UploadEventPayloadMap,
	type UploadErrorEventPayload,
	type UploadEndEventPayload,
	type UploadPreviewUpdateEventPayload,
	type UploadsStartEventPayload,
	type UploadRejectionData,
} from '../../../types';
import { type UploadService } from '../../../service/types';
import { SCALE_FACTOR_DEFAULT } from '../../../util/getPreviewFromImage';
import * as ufoWrapper from '../../../util/ufoExperiences';
import { type UploadComponent } from '../../component';
import { fakeMediaClient } from '@atlaskit/media-test-helpers';

const imageFile: MediaFile = {
	id: 'some-id',
	name: 'some-name',
	size: 12345,
	creationDate: Date.now(),
	type: 'image/jpg',
};

const rejectionData1: UploadRejectionData = {
	reason: 'fileSizeLimitExceeded',
	fileName: 'file-name-1.png',
	limit: 10_000,
};
const rejectionData2: UploadRejectionData = {
	reason: 'fileSizeLimitExceeded',
	fileName: 'file-name-2.png',
	limit: 10_000,
};

class DummyLocalUploadComponent extends LocalUploadComponentReact<LocalUploadComponentBaseProps> {
	constructor(props: LocalUploadComponentBaseProps) {
		super(props, 'browser');
	}

	render() {
		return null;
	}
}

describe('LocalUploadReact', () => {
	let localUploadComponent: ReactWrapper<DummyLocalUploadComponent>;
	let localUploadComponentInstance: DummyLocalUploadComponent;
	const onUploadsStart = jest.fn();
	const onPreviewUpdate = jest.fn();
	const onEnd = jest.fn();
	const onError = jest.fn();
	const onUploadRejection = jest.fn();
	let uploadComponent: UploadComponent<UploadEventPayloadMap>;
	let uploadService: UploadService;

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

	beforeEach(() => {
		localUploadComponent = mount(
			<DummyLocalUploadComponent
				mediaClient={mediaClient}
				config={config}
				onUploadsStart={onUploadsStart}
				onPreviewUpdate={onPreviewUpdate}
				onEnd={onEnd}
				onError={onError}
			/>,
		);

		localUploadComponentInstance = localUploadComponent.instance() as DummyLocalUploadComponent;
		uploadComponent = (localUploadComponentInstance as any).uploadComponent;
		uploadService = (localUploadComponentInstance as any).uploadService;
		onUploadRejection.mockImplementation(() => true);
	});

	afterEach(() => {
		jest.resetAllMocks();
	});

	it('should call uploadComponent.emitUploadsStart with proper arguments and should start UFO experience', () => {
		const emitUploadsStart = jest.spyOn(uploadComponent, 'emitUploadsStart');
		const files: UploadsStartEventPayload = {
			files: [imageFile],
			traceContext: {
				traceId: 'test-trace-id',
			},
		};
		(localUploadComponentInstance as any).onFilesAdded(files);
		expect(emitUploadsStart).toBeCalledWith(files.files, files.traceContext);
		expect(onUploadsStart).toBeCalledWith(files);
		expect(mockstartMediaUploadUfoExperience).toBeCalledTimes(1);
		expect(mockstartMediaUploadUfoExperience).toBeCalledWith(
			expect.any(String),
			expect.any(String),
		);
	});

	it('should call uploadComponent.emitUploadPreviewUpdate with proper arguments', () => {
		const emitUploadPreviewUpdate = jest.spyOn(uploadComponent, 'emitUploadPreviewUpdate');
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
		(localUploadComponentInstance as any).onFilePreviewUpdate(preview);
		expect(emitUploadPreviewUpdate).toBeCalledWith(preview.file, preview.preview);
		expect(onPreviewUpdate).toBeCalledWith({
			file: preview.file,
			preview: preview.preview,
		});
	});

	it('should call uploadComponent.emitUploadEnd and UFO failed experience event with proper arguments', () => {
		const emitUploadEnd = jest.spyOn(uploadComponent, 'emitUploadEnd');
		const file: UploadEndEventPayload = {
			file: imageFile,
			traceContext: {
				traceId: 'test-trace-id',
			},
		};

		(localUploadComponentInstance as any).onFileConverting(file);
		expect(emitUploadEnd).toBeCalledWith(file.file, file.traceContext);
		expect(onEnd).toBeCalledWith(file);
		expect(mocksucceedMediaUploadUfoExperience).toBeCalledWith(imageFile.id, {
			fileId: imageFile.id,
			fileSize: imageFile.size,
			fileMimetype: imageFile.type,
		});
	});

	it('should call uploadComponent.emitUploadError and UFO failed experience event with proper arguments', () => {
		const emitUploadError = jest.spyOn(uploadComponent, 'emitUploadError');
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
		(localUploadComponentInstance as any).onUploadError(payload);
		expect(emitUploadError).toBeCalledWith(payload.fileId, payload.error, payload.traceContext);
		expect(onError).toBeCalledWith(payload);
		expect(mockfailMediaUploadUfoExperience).toBeCalledWith(imageFile.id, {
			failReason: payload.error.name,
			error: 'unknown',
			request: undefined,
			fileAttributes: {
				fileId: imageFile.id,
			},
			uploadDurationMsec: -1,
		});
	});

	it('should call config onFileRejection callback', () => {
		const data: UploadRejectionData = {
			reason: 'fileSizeLimitExceeded',
			fileName: 'test.png',
			limit: 100,
		};
		const addFlag = jest.spyOn(localUploadComponentInstance as any, 'addErrorFlag');
		const onFileRejectionInUploadService = jest.spyOn(uploadService, 'onFileRejection');

		const fileRejectionCallback = onFileRejectionInUploadService.mock.calls[0][0];
		fileRejectionCallback(data);

		expect(onUploadRejection).toBeCalledWith(data);
		expect(addFlag).not.toHaveBeenCalled();
	});

	it('should call the addFlag when config callback returns false', () => {
		const data: UploadRejectionData = {
			reason: 'fileSizeLimitExceeded',
			fileName: 'test.png',
			limit: 100,
		};

		onUploadRejection.mockImplementation(() => false);

		const withoutUploadRejectionOverride = mount(
			<DummyLocalUploadComponent
				mediaClient={mediaClient}
				config={config}
				onUploadsStart={onUploadsStart}
				onPreviewUpdate={onPreviewUpdate}
				onEnd={onEnd}
				onError={onError}
			/>,
		);

		const withoutOverideInstance = withoutUploadRejectionOverride.instance() as any;
		const uploadService: UploadService = withoutOverideInstance.uploadService;

		const addFlag = jest.spyOn(withoutOverideInstance as any, 'addErrorFlag');

		const onFileRejectionInUploadService = jest.spyOn(uploadService, 'onFileRejection');

		const argument = onFileRejectionInUploadService.mock.calls[0][0];
		argument(data);

		expect(onUploadRejection).toBeCalledWith(data);
		expect(addFlag).toBeCalledWith(data);
	});

	it('should set the onFileRejection callback for UploadService to the default implementation when the config is missing callback', () => {
		const localUploadWithoutOnFileRejection = mount(
			<DummyLocalUploadComponent
				mediaClient={mediaClient}
				config={{ uploadParams: {} }}
				onUploadsStart={onUploadsStart}
				onPreviewUpdate={onPreviewUpdate}
				onEnd={onEnd}
				onError={onError}
			/>,
		);

		const withoutOnFileRejectionInstance = localUploadWithoutOnFileRejection.instance() as any;
		const uploadService = withoutOnFileRejectionInstance.uploadService;
		const addFlag = withoutOnFileRejectionInstance.addErrorFlag;

		const onFileRejectionInUploadService = jest.spyOn(uploadService, 'onFileRejection');
		expect(onFileRejectionInUploadService).not.toBeCalledWith(onUploadRejection);
		expect(onFileRejectionInUploadService).toBeCalledWith(addFlag);
	});

	describe('addErrorFlag', () => {
		it('should correctly update the state to add a new flag', () => {
			(localUploadComponentInstance as any).addErrorFlag(rejectionData1);
			expect((localUploadComponentInstance as any).state).toEqual({
				errorFlags: [rejectionData1],
			});
		});

		it('should correctly update the state to add multiple new flags', () => {
			(localUploadComponentInstance as any).addErrorFlag(rejectionData1);
			(localUploadComponentInstance as any).addErrorFlag(rejectionData2);
			expect((localUploadComponentInstance as any).state).toEqual({
				errorFlags: [rejectionData1, rejectionData2],
			});
		});
	});

	describe('dismissErrorFlag', () => {
		it('should correctly update the state to remove the first flag', () => {
			(localUploadComponentInstance as any).addErrorFlag(rejectionData1);
			(localUploadComponentInstance as any).addErrorFlag(rejectionData2);
			(localUploadComponentInstance as any).dismissErrorFlag();
			expect((localUploadComponentInstance as any).state).toEqual({
				errorFlags: [rejectionData2],
			});
		});

		it('should not change the state when there are no flags to remove', () => {
			(localUploadComponentInstance as any).dismissErrorFlag();
			expect((localUploadComponentInstance as any).state).toEqual({
				errorFlags: [],
			});
		});
	});
});
