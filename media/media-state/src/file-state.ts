import { type MediaTraceContext, type MediaType } from '@atlaskit/media-common';

export type MediaFileProcessingStatus = 'pending' | 'succeeded' | 'failed';

export type ProcessingFailReason =
	| 'operation-failed'
	| 'timeout'
	| 'unsupported-file-type'
	| 'unknown';

export type MediaRepresentations = {
	image?: object;
};

export type MediaUserArtifact = {
	readonly createdAt?: number;
	readonly url: string;
	readonly mimeType?: string;
	readonly cdnUrl?: string;
	readonly size?: number;
};

export type MediaFileArtifact = {
	readonly url: string;
	readonly processingStatus: MediaFileProcessingStatus;
	readonly mimeType?: string;
	readonly cdnUrl?: string;
	readonly size?: number;
};

export type MediaUserArtifactCaptionKey = `ugc_caption_${string}`;

export interface MediaFileArtifacts {
	'image.png'?: MediaFileArtifact;
	'image.jpg'?: MediaFileArtifact;
	'image.gif'?: MediaFileArtifact;
	'image.webp'?: MediaFileArtifact;
	'thumb.jpg'?: MediaFileArtifact;
	'thumb_120.jpg'?: MediaFileArtifact;
	'thumb_320.jpg'?: MediaFileArtifact;
	'thumb_large.jpg'?: MediaFileArtifact;
	'document.pdf'?: MediaFileArtifact;
	'document.txt'?: MediaFileArtifact;
	'document.html'?: MediaFileArtifact;
	'audio.mp3'?: MediaFileArtifact;
	'video.mp4'?: MediaFileArtifact;
	'video_640.mp4'?: MediaFileArtifact;
	'video_1280.mp4'?: MediaFileArtifact;
	'video_hd.mp4'?: MediaFileArtifact;
	'poster.jpg'?: MediaFileArtifact;
	'poster_640.jpg'?: MediaFileArtifact;
	'poster_1280.jpg'?: MediaFileArtifact;
	'poster_hd.jpg'?: MediaFileArtifact;
	[key: MediaUserArtifactCaptionKey]: MediaUserArtifact;
}

type BaseFileState = {
	id: string;
	occurrenceKey?: string;
	metadataTraceContext?: MediaTraceContext;
	hash?: string;
};

type AbuseClassification = {
	classification: 'ABHORRENT' | 'MALICIOUS' | 'ILLICIT' | 'COPYRIGHT';
	confidence: 'HIGH' | 'MEDIUM' | 'LOW' | 'SYNTHETIC';
};

type FileMediaMetadata = {
	duration?: number;
};

type NonErrorBaseFileState = {
	name: string;
	size: number;
	mediaType: MediaType;
	mimeType: string;
	preview?: FilePreview | Promise<FilePreview>;
	createdAt?: number;
	abuseClassification?: AbuseClassification;
} & BaseFileState;

export interface FilePreview {
	value: Blob | string;
	origin?: 'local' | 'remote';
	originalDimensions?: {
		width: number;
		height: number;
	};
}
export interface UploadingFileState extends NonErrorBaseFileState {
	status: 'uploading';
	progress: number;
}

export interface ProcessingFileState extends NonErrorBaseFileState {
	status: 'processing';
	artifacts?: MediaFileArtifacts;
	mediaMetadata?: FileMediaMetadata;
	representations?: MediaRepresentations;
}

export interface ProcessedFileState extends NonErrorBaseFileState {
	status: 'processed';
	artifacts: MediaFileArtifacts;
	mediaMetadata?: FileMediaMetadata;
	representations?: MediaRepresentations;
}
export interface ProcessingFailedState extends NonErrorBaseFileState {
	status: 'failed-processing';
	artifacts: object;
	representations?: MediaRepresentations;
	failReason?: ProcessingFailReason;
}
export interface ErrorFileState extends BaseFileState {
	status: 'error';
	id: string;
	reason?: string;
	message?: string;
	details?: Record<string, any>;
}
export type FileState =
	| UploadingFileState
	| ProcessingFileState
	| ProcessedFileState
	| ErrorFileState
	| ProcessingFailedState;
