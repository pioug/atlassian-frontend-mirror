import {
	type UploadEndEventPayload,
	type UploadErrorEventPayload,
	type UploadPreviewUpdateEventPayload,
	type UploadsStartEventPayload,
	type UploadParams,
	type UploadRejectionData,
	type FileEmptyData,
} from '../types';

export type UploadServiceEventPayloadTypes = {
	readonly 'files-added': UploadsStartEventPayload;
	readonly 'file-preview-update': UploadPreviewUpdateEventPayload;
	readonly 'file-converting': UploadEndEventPayload;
	readonly 'file-upload-error': UploadErrorEventPayload;
	readonly 'file-dropped': DragEvent;
};

export type UploadServiceEventListener<E extends keyof UploadServiceEventPayloadTypes> = (
	payload: UploadServiceEventPayloadTypes[E],
) => void;

export const MAX_FILE_SIZE_FOR_PREVIEW = 10e6; // 10 MB

export interface UploadService {
	setUploadParams(uploadParams: UploadParams): void;
	addFile(file: File, replaceFileId?: string): void;
	addFiles(files: File[]): void;
	addFilesWithSource(files: LocalFileWithSource[]): Promise<void>;
	cancel(id?: string): void;
	on<E extends keyof UploadServiceEventPayloadTypes>(
		event: E,
		listener: UploadServiceEventListener<E>,
	): void;
	off<E extends keyof UploadServiceEventPayloadTypes>(
		event: E,
		listener: UploadServiceEventListener<E>,
	): void;
	onFileEmpty(handler: (fileEmptyData: FileEmptyData) => void): void;
	onFileRejection(handler: (rejectionData: UploadRejectionData) => void): void;
}

export enum LocalFileSource {
	PastedFile = 'pastedFile',
	PastedScreenshot = 'pastedScreenshot',
	LocalUpload = 'localUpload',
}

export interface LocalFileWithSource {
	file: File;
	source: LocalFileSource;
	replaceFileId?: string;
}
