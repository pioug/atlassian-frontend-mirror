import { fakeImage } from '../../utils/mockData';

export const notifyMetadataPayload = (
	tenantFileId: string,
	fileSize: number,
): {
	type: string;
	uploadId: string;
	metadata: {
		pending: boolean;
		preview: {
			url: string;
			width: number;
			height: number;
			size: number;
		};
		original: {
			url: string;
			width: number;
			height: number;
			size: number;
		};
	};
} => ({
	type: 'NotifyMetadata',
	uploadId: tenantFileId,
	metadata: {
		pending: false,
		preview: {
			url: fakeImage,
			width: 320,
			height: 240,
			size: fileSize,
		},
		original: {
			url: fakeImage,
			width: 320,
			height: 240,
			size: fileSize,
		},
	},
});

export const remoteUploadStartPayload = (
	tenantFileId: string,
): {
	type: string;
	uploadId: string;
} => ({
	type: 'RemoteUploadStart',
	uploadId: tenantFileId,
});

export const remoteUploadProgressPayload = (
	tenantFileId: string,
	fileSize: number,
): {
	type: string;
	uploadId: string;
	currentAmount: number;
	totalAmount: number;
} => ({
	type: 'RemoteUploadProgress',
	uploadId: tenantFileId,
	currentAmount: fileSize,
	totalAmount: fileSize,
});

export const remoteUploadEndPayload = (
	tenantFileId: string,
	userFileId: string,
): {
	type: string;
	uploadId: string;
	fileId: string;
} => ({
	type: 'RemoteUploadEnd',
	uploadId: tenantFileId,
	fileId: userFileId,
});
