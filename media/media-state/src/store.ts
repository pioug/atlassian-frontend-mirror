import { devtools, subscribeWithSelector } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { createStore, type StoreApi } from 'zustand/vanilla';

import type { MediaType } from '@atlaskit/media-common';

import {
	type FilePreview,
	type FileState,
	type MediaFileProcessingStatus,
	type ProcessingFailReason,
} from './file-state';

export interface Store {
	files: Record<string, FileState>;
}

const mediaStoreWithoutDevtools: Omit<
	Omit<StoreApi<Store>, 'subscribe'> & {
		subscribe: {
			(listener: (selectedState: Store, previousSelectedState: Store) => void): () => void;
			<U>(
				selector: (state: Store) => U,
				listener: (selectedState: U, previousSelectedState: U) => void,
				options?:
					| {
							equalityFn?: ((a: U, b: U) => boolean) | undefined;
							fireImmediately?: boolean;
					  }
					| undefined,
			): () => void;
		};
	},
	'setState'
> & {
	setState(
		nextStateOrUpdater:
			| Store
			| Partial<Store>
			| ((state: {
					files: {
						[x: string]:
							| {
									status: 'uploading';
									progress: number;
									name: string;
									size: number;
									mediaType: MediaType;
									mimeType: string;
									preview?:
										| Promise<FilePreview>
										| {
												value:
													| string
													| {
															size: number;
															type: string;
															arrayBuffer: () => Promise<ArrayBuffer>;
															bytes: () => Promise<Uint8Array<ArrayBuffer>>;
															slice: (start?: number, end?: number, contentType?: string) => Blob;
															stream: () => ReadableStream<Uint8Array<ArrayBuffer>>;
															text: () => Promise<string>;
													  };
												origin?: 'local' | 'remote' | undefined;
												originalDimensions?:
													| {
															width: number;
															height: number;
													  }
													| undefined;
										  }
										| undefined;
									createdAt?: number | undefined;
									abuseClassification?:
										| {
												classification: 'ABHORRENT' | 'MALICIOUS' | 'ILLICIT' | 'COPYRIGHT';
												confidence: 'HIGH' | 'MEDIUM' | 'LOW' | 'SYNTHETIC';
										  }
										| undefined;
									id: string;
									occurrenceKey?: string | undefined;
									metadataTraceContext?:
										| {
												traceId: string;
												spanId?: string | undefined;
										  }
										| undefined;
									hash?: string | undefined;
							  }
							| {
									status: 'processing';
									artifacts?:
										| {
												[x: `ugc_caption_${string}`]: {
													createdAt?: number | undefined;
													url: string;
													mimeType?: string | undefined;
													cdnUrl?: string | undefined;
													size?: number | undefined;
												};
												'image.png'?:
													| {
															url: string;
															processingStatus: MediaFileProcessingStatus;
															mimeType?: string | undefined;
															cdnUrl?: string | undefined;
															size?: number | undefined;
													  }
													| undefined;
												'image.jpg'?:
													| {
															url: string;
															processingStatus: MediaFileProcessingStatus;
															mimeType?: string | undefined;
															cdnUrl?: string | undefined;
															size?: number | undefined;
													  }
													| undefined;
												'image.gif'?:
													| {
															url: string;
															processingStatus: MediaFileProcessingStatus;
															mimeType?: string | undefined;
															cdnUrl?: string | undefined;
															size?: number | undefined;
													  }
													| undefined;
												'image.webp'?:
													| {
															url: string;
															processingStatus: MediaFileProcessingStatus;
															mimeType?: string | undefined;
															cdnUrl?: string | undefined;
															size?: number | undefined;
													  }
													| undefined;
												'thumb.jpg'?:
													| {
															url: string;
															processingStatus: MediaFileProcessingStatus;
															mimeType?: string | undefined;
															cdnUrl?: string | undefined;
															size?: number | undefined;
													  }
													| undefined;
												'thumb_120.jpg'?:
													| {
															url: string;
															processingStatus: MediaFileProcessingStatus;
															mimeType?: string | undefined;
															cdnUrl?: string | undefined;
															size?: number | undefined;
													  }
													| undefined;
												'thumb_320.jpg'?:
													| {
															url: string;
															processingStatus: MediaFileProcessingStatus;
															mimeType?: string | undefined;
															cdnUrl?: string | undefined;
															size?: number | undefined;
													  }
													| undefined;
												'thumb_large.jpg'?:
													| {
															url: string;
															processingStatus: MediaFileProcessingStatus;
															mimeType?: string | undefined;
															cdnUrl?: string | undefined;
															size?: number | undefined;
													  }
													| undefined;
												'document.pdf'?:
													| {
															url: string;
															processingStatus: MediaFileProcessingStatus;
															mimeType?: string | undefined;
															cdnUrl?: string | undefined;
															size?: number | undefined;
													  }
													| undefined;
												'document.txt'?:
													| {
															url: string;
															processingStatus: MediaFileProcessingStatus;
															mimeType?: string | undefined;
															cdnUrl?: string | undefined;
															size?: number | undefined;
													  }
													| undefined;
												'document.html'?:
													| {
															url: string;
															processingStatus: MediaFileProcessingStatus;
															mimeType?: string | undefined;
															cdnUrl?: string | undefined;
															size?: number | undefined;
													  }
													| undefined;
												'audio.mp3'?:
													| {
															url: string;
															processingStatus: MediaFileProcessingStatus;
															mimeType?: string | undefined;
															cdnUrl?: string | undefined;
															size?: number | undefined;
													  }
													| undefined;
												'video.mp4'?:
													| {
															url: string;
															processingStatus: MediaFileProcessingStatus;
															mimeType?: string | undefined;
															cdnUrl?: string | undefined;
															size?: number | undefined;
													  }
													| undefined;
												'video_640.mp4'?:
													| {
															url: string;
															processingStatus: MediaFileProcessingStatus;
															mimeType?: string | undefined;
															cdnUrl?: string | undefined;
															size?: number | undefined;
													  }
													| undefined;
												'video_1280.mp4'?:
													| {
															url: string;
															processingStatus: MediaFileProcessingStatus;
															mimeType?: string | undefined;
															cdnUrl?: string | undefined;
															size?: number | undefined;
													  }
													| undefined;
												'video_hd.mp4'?:
													| {
															url: string;
															processingStatus: MediaFileProcessingStatus;
															mimeType?: string | undefined;
															cdnUrl?: string | undefined;
															size?: number | undefined;
													  }
													| undefined;
												'poster.jpg'?:
													| {
															url: string;
															processingStatus: MediaFileProcessingStatus;
															mimeType?: string | undefined;
															cdnUrl?: string | undefined;
															size?: number | undefined;
													  }
													| undefined;
												'poster_640.jpg'?:
													| {
															url: string;
															processingStatus: MediaFileProcessingStatus;
															mimeType?: string | undefined;
															cdnUrl?: string | undefined;
															size?: number | undefined;
													  }
													| undefined;
												'poster_1280.jpg'?:
													| {
															url: string;
															processingStatus: MediaFileProcessingStatus;
															mimeType?: string | undefined;
															cdnUrl?: string | undefined;
															size?: number | undefined;
													  }
													| undefined;
												'poster_hd.jpg'?:
													| {
															url: string;
															processingStatus: MediaFileProcessingStatus;
															mimeType?: string | undefined;
															cdnUrl?: string | undefined;
															size?: number | undefined;
													  }
													| undefined;
										  }
										| undefined;
									mediaMetadata?:
										| {
												duration?: number | undefined;
										  }
										| undefined;
									representations?:
										| {
												image?: object | undefined;
										  }
										| undefined;
									name: string;
									size: number;
									mediaType: MediaType;
									mimeType: string;
									preview?:
										| Promise<FilePreview>
										| {
												value:
													| string
													| {
															size: number;
															type: string;
															arrayBuffer: () => Promise<ArrayBuffer>;
															bytes: () => Promise<Uint8Array<ArrayBuffer>>;
															slice: (start?: number, end?: number, contentType?: string) => Blob;
															stream: () => ReadableStream<Uint8Array<ArrayBuffer>>;
															text: () => Promise<string>;
													  };
												origin?: 'local' | 'remote' | undefined;
												originalDimensions?:
													| {
															width: number;
															height: number;
													  }
													| undefined;
										  }
										| undefined;
									createdAt?: number | undefined;
									abuseClassification?:
										| {
												classification: 'ABHORRENT' | 'MALICIOUS' | 'ILLICIT' | 'COPYRIGHT';
												confidence: 'HIGH' | 'MEDIUM' | 'LOW' | 'SYNTHETIC';
										  }
										| undefined;
									id: string;
									occurrenceKey?: string | undefined;
									metadataTraceContext?:
										| {
												traceId: string;
												spanId?: string | undefined;
										  }
										| undefined;
									hash?: string | undefined;
							  }
							| {
									status: 'processed';
									artifacts: {
										[x: `ugc_caption_${string}`]: {
											createdAt?: number | undefined;
											url: string;
											mimeType?: string | undefined;
											cdnUrl?: string | undefined;
											size?: number | undefined;
										};
										'image.png'?:
											| {
													url: string;
													processingStatus: MediaFileProcessingStatus;
													mimeType?: string | undefined;
													cdnUrl?: string | undefined;
													size?: number | undefined;
											  }
											| undefined;
										'image.jpg'?:
											| {
													url: string;
													processingStatus: MediaFileProcessingStatus;
													mimeType?: string | undefined;
													cdnUrl?: string | undefined;
													size?: number | undefined;
											  }
											| undefined;
										'image.gif'?:
											| {
													url: string;
													processingStatus: MediaFileProcessingStatus;
													mimeType?: string | undefined;
													cdnUrl?: string | undefined;
													size?: number | undefined;
											  }
											| undefined;
										'image.webp'?:
											| {
													url: string;
													processingStatus: MediaFileProcessingStatus;
													mimeType?: string | undefined;
													cdnUrl?: string | undefined;
													size?: number | undefined;
											  }
											| undefined;
										'thumb.jpg'?:
											| {
													url: string;
													processingStatus: MediaFileProcessingStatus;
													mimeType?: string | undefined;
													cdnUrl?: string | undefined;
													size?: number | undefined;
											  }
											| undefined;
										'thumb_120.jpg'?:
											| {
													url: string;
													processingStatus: MediaFileProcessingStatus;
													mimeType?: string | undefined;
													cdnUrl?: string | undefined;
													size?: number | undefined;
											  }
											| undefined;
										'thumb_320.jpg'?:
											| {
													url: string;
													processingStatus: MediaFileProcessingStatus;
													mimeType?: string | undefined;
													cdnUrl?: string | undefined;
													size?: number | undefined;
											  }
											| undefined;
										'thumb_large.jpg'?:
											| {
													url: string;
													processingStatus: MediaFileProcessingStatus;
													mimeType?: string | undefined;
													cdnUrl?: string | undefined;
													size?: number | undefined;
											  }
											| undefined;
										'document.pdf'?:
											| {
													url: string;
													processingStatus: MediaFileProcessingStatus;
													mimeType?: string | undefined;
													cdnUrl?: string | undefined;
													size?: number | undefined;
											  }
											| undefined;
										'document.txt'?:
											| {
													url: string;
													processingStatus: MediaFileProcessingStatus;
													mimeType?: string | undefined;
													cdnUrl?: string | undefined;
													size?: number | undefined;
											  }
											| undefined;
										'document.html'?:
											| {
													url: string;
													processingStatus: MediaFileProcessingStatus;
													mimeType?: string | undefined;
													cdnUrl?: string | undefined;
													size?: number | undefined;
											  }
											| undefined;
										'audio.mp3'?:
											| {
													url: string;
													processingStatus: MediaFileProcessingStatus;
													mimeType?: string | undefined;
													cdnUrl?: string | undefined;
													size?: number | undefined;
											  }
											| undefined;
										'video.mp4'?:
											| {
													url: string;
													processingStatus: MediaFileProcessingStatus;
													mimeType?: string | undefined;
													cdnUrl?: string | undefined;
													size?: number | undefined;
											  }
											| undefined;
										'video_640.mp4'?:
											| {
													url: string;
													processingStatus: MediaFileProcessingStatus;
													mimeType?: string | undefined;
													cdnUrl?: string | undefined;
													size?: number | undefined;
											  }
											| undefined;
										'video_1280.mp4'?:
											| {
													url: string;
													processingStatus: MediaFileProcessingStatus;
													mimeType?: string | undefined;
													cdnUrl?: string | undefined;
													size?: number | undefined;
											  }
											| undefined;
										'video_hd.mp4'?:
											| {
													url: string;
													processingStatus: MediaFileProcessingStatus;
													mimeType?: string | undefined;
													cdnUrl?: string | undefined;
													size?: number | undefined;
											  }
											| undefined;
										'poster.jpg'?:
											| {
													url: string;
													processingStatus: MediaFileProcessingStatus;
													mimeType?: string | undefined;
													cdnUrl?: string | undefined;
													size?: number | undefined;
											  }
											| undefined;
										'poster_640.jpg'?:
											| {
													url: string;
													processingStatus: MediaFileProcessingStatus;
													mimeType?: string | undefined;
													cdnUrl?: string | undefined;
													size?: number | undefined;
											  }
											| undefined;
										'poster_1280.jpg'?:
											| {
													url: string;
													processingStatus: MediaFileProcessingStatus;
													mimeType?: string | undefined;
													cdnUrl?: string | undefined;
													size?: number | undefined;
											  }
											| undefined;
										'poster_hd.jpg'?:
											| {
													url: string;
													processingStatus: MediaFileProcessingStatus;
													mimeType?: string | undefined;
													cdnUrl?: string | undefined;
													size?: number | undefined;
											  }
											| undefined;
									};
									mediaMetadata?:
										| {
												duration?: number | undefined;
										  }
										| undefined;
									representations?:
										| {
												image?: object | undefined;
										  }
										| undefined;
									name: string;
									size: number;
									mediaType: MediaType;
									mimeType: string;
									preview?:
										| Promise<FilePreview>
										| {
												value:
													| string
													| {
															size: number;
															type: string;
															arrayBuffer: () => Promise<ArrayBuffer>;
															bytes: () => Promise<Uint8Array<ArrayBuffer>>;
															slice: (start?: number, end?: number, contentType?: string) => Blob;
															stream: () => ReadableStream<Uint8Array<ArrayBuffer>>;
															text: () => Promise<string>;
													  };
												origin?: 'local' | 'remote' | undefined;
												originalDimensions?:
													| {
															width: number;
															height: number;
													  }
													| undefined;
										  }
										| undefined;
									createdAt?: number | undefined;
									abuseClassification?:
										| {
												classification: 'ABHORRENT' | 'MALICIOUS' | 'ILLICIT' | 'COPYRIGHT';
												confidence: 'HIGH' | 'MEDIUM' | 'LOW' | 'SYNTHETIC';
										  }
										| undefined;
									id: string;
									occurrenceKey?: string | undefined;
									metadataTraceContext?:
										| {
												traceId: string;
												spanId?: string | undefined;
										  }
										| undefined;
									hash?: string | undefined;
							  }
							| {
									status: 'error';
									id: string;
									reason?: string | undefined;
									message?: string | undefined;
									details?:
										| {
												[x: string]: any;
										  }
										| undefined;
									occurrenceKey?: string | undefined;
									metadataTraceContext?:
										| {
												traceId: string;
												spanId?: string | undefined;
										  }
										| undefined;
									hash?: string | undefined;
							  }
							| {
									status: 'failed-processing';
									artifacts: object;
									representations?:
										| {
												image?: object | undefined;
										  }
										| undefined;
									failReason?: ProcessingFailReason | undefined;
									name: string;
									size: number;
									mediaType: MediaType;
									mimeType: string;
									preview?:
										| Promise<FilePreview>
										| {
												value:
													| string
													| {
															size: number;
															type: string;
															arrayBuffer: () => Promise<ArrayBuffer>;
															bytes: () => Promise<Uint8Array<ArrayBuffer>>;
															slice: (start?: number, end?: number, contentType?: string) => Blob;
															stream: () => ReadableStream<Uint8Array<ArrayBuffer>>;
															text: () => Promise<string>;
													  };
												origin?: 'local' | 'remote' | undefined;
												originalDimensions?:
													| {
															width: number;
															height: number;
													  }
													| undefined;
										  }
										| undefined;
									createdAt?: number | undefined;
									abuseClassification?:
										| {
												classification: 'ABHORRENT' | 'MALICIOUS' | 'ILLICIT' | 'COPYRIGHT';
												confidence: 'HIGH' | 'MEDIUM' | 'LOW' | 'SYNTHETIC';
										  }
										| undefined;
									id: string;
									occurrenceKey?: string | undefined;
									metadataTraceContext?:
										| {
												traceId: string;
												spanId?: string | undefined;
										  }
										| undefined;
									hash?: string | undefined;
							  };
					};
			  }) => void),
		shouldReplace?: boolean | undefined,
	): void;
} = createStore<Store>()(subscribeWithSelector(immer(() => ({ files: {} }))));

const mediaStoreWithDevtools = createStore<Store>()(
	devtools(subscribeWithSelector(immer(() => ({ files: {} })))),
);

export type MediaStore = typeof mediaStoreWithoutDevtools;

export const mediaStore: Omit<
	Omit<StoreApi<Store>, 'subscribe'> & {
		subscribe: {
			(listener: (selectedState: Store, previousSelectedState: Store) => void): () => void;
			<U>(
				selector: (state: Store) => U,
				listener: (selectedState: U, previousSelectedState: U) => void,
				options?:
					| {
							equalityFn?: ((a: U, b: U) => boolean) | undefined;
							fireImmediately?: boolean;
					  }
					| undefined,
			): () => void;
		};
	},
	'setState'
> & {
	setState(
		nextStateOrUpdater:
			| Store
			| Partial<Store>
			| ((state: {
					files: {
						[x: string]:
							| {
									status: 'uploading';
									progress: number;
									name: string;
									size: number;
									mediaType: MediaType;
									mimeType: string;
									preview?:
										| Promise<FilePreview>
										| {
												value:
													| string
													| {
															size: number;
															type: string;
															arrayBuffer: () => Promise<ArrayBuffer>;
															bytes: () => Promise<Uint8Array<ArrayBuffer>>;
															slice: (start?: number, end?: number, contentType?: string) => Blob;
															stream: () => ReadableStream<Uint8Array<ArrayBuffer>>;
															text: () => Promise<string>;
													  };
												origin?: 'local' | 'remote' | undefined;
												originalDimensions?:
													| {
															width: number;
															height: number;
													  }
													| undefined;
										  }
										| undefined;
									createdAt?: number | undefined;
									abuseClassification?:
										| {
												classification: 'ABHORRENT' | 'MALICIOUS' | 'ILLICIT' | 'COPYRIGHT';
												confidence: 'HIGH' | 'MEDIUM' | 'LOW' | 'SYNTHETIC';
										  }
										| undefined;
									id: string;
									occurrenceKey?: string | undefined;
									metadataTraceContext?:
										| {
												traceId: string;
												spanId?: string | undefined;
										  }
										| undefined;
									hash?: string | undefined;
							  }
							| {
									status: 'processing';
									artifacts?:
										| {
												[x: `ugc_caption_${string}`]: {
													createdAt?: number | undefined;
													url: string;
													mimeType?: string | undefined;
													cdnUrl?: string | undefined;
													size?: number | undefined;
												};
												'image.png'?:
													| {
															url: string;
															processingStatus: MediaFileProcessingStatus;
															mimeType?: string | undefined;
															cdnUrl?: string | undefined;
															size?: number | undefined;
													  }
													| undefined;
												'image.jpg'?:
													| {
															url: string;
															processingStatus: MediaFileProcessingStatus;
															mimeType?: string | undefined;
															cdnUrl?: string | undefined;
															size?: number | undefined;
													  }
													| undefined;
												'image.gif'?:
													| {
															url: string;
															processingStatus: MediaFileProcessingStatus;
															mimeType?: string | undefined;
															cdnUrl?: string | undefined;
															size?: number | undefined;
													  }
													| undefined;
												'image.webp'?:
													| {
															url: string;
															processingStatus: MediaFileProcessingStatus;
															mimeType?: string | undefined;
															cdnUrl?: string | undefined;
															size?: number | undefined;
													  }
													| undefined;
												'thumb.jpg'?:
													| {
															url: string;
															processingStatus: MediaFileProcessingStatus;
															mimeType?: string | undefined;
															cdnUrl?: string | undefined;
															size?: number | undefined;
													  }
													| undefined;
												'thumb_120.jpg'?:
													| {
															url: string;
															processingStatus: MediaFileProcessingStatus;
															mimeType?: string | undefined;
															cdnUrl?: string | undefined;
															size?: number | undefined;
													  }
													| undefined;
												'thumb_320.jpg'?:
													| {
															url: string;
															processingStatus: MediaFileProcessingStatus;
															mimeType?: string | undefined;
															cdnUrl?: string | undefined;
															size?: number | undefined;
													  }
													| undefined;
												'thumb_large.jpg'?:
													| {
															url: string;
															processingStatus: MediaFileProcessingStatus;
															mimeType?: string | undefined;
															cdnUrl?: string | undefined;
															size?: number | undefined;
													  }
													| undefined;
												'document.pdf'?:
													| {
															url: string;
															processingStatus: MediaFileProcessingStatus;
															mimeType?: string | undefined;
															cdnUrl?: string | undefined;
															size?: number | undefined;
													  }
													| undefined;
												'document.txt'?:
													| {
															url: string;
															processingStatus: MediaFileProcessingStatus;
															mimeType?: string | undefined;
															cdnUrl?: string | undefined;
															size?: number | undefined;
													  }
													| undefined;
												'document.html'?:
													| {
															url: string;
															processingStatus: MediaFileProcessingStatus;
															mimeType?: string | undefined;
															cdnUrl?: string | undefined;
															size?: number | undefined;
													  }
													| undefined;
												'audio.mp3'?:
													| {
															url: string;
															processingStatus: MediaFileProcessingStatus;
															mimeType?: string | undefined;
															cdnUrl?: string | undefined;
															size?: number | undefined;
													  }
													| undefined;
												'video.mp4'?:
													| {
															url: string;
															processingStatus: MediaFileProcessingStatus;
															mimeType?: string | undefined;
															cdnUrl?: string | undefined;
															size?: number | undefined;
													  }
													| undefined;
												'video_640.mp4'?:
													| {
															url: string;
															processingStatus: MediaFileProcessingStatus;
															mimeType?: string | undefined;
															cdnUrl?: string | undefined;
															size?: number | undefined;
													  }
													| undefined;
												'video_1280.mp4'?:
													| {
															url: string;
															processingStatus: MediaFileProcessingStatus;
															mimeType?: string | undefined;
															cdnUrl?: string | undefined;
															size?: number | undefined;
													  }
													| undefined;
												'video_hd.mp4'?:
													| {
															url: string;
															processingStatus: MediaFileProcessingStatus;
															mimeType?: string | undefined;
															cdnUrl?: string | undefined;
															size?: number | undefined;
													  }
													| undefined;
												'poster.jpg'?:
													| {
															url: string;
															processingStatus: MediaFileProcessingStatus;
															mimeType?: string | undefined;
															cdnUrl?: string | undefined;
															size?: number | undefined;
													  }
													| undefined;
												'poster_640.jpg'?:
													| {
															url: string;
															processingStatus: MediaFileProcessingStatus;
															mimeType?: string | undefined;
															cdnUrl?: string | undefined;
															size?: number | undefined;
													  }
													| undefined;
												'poster_1280.jpg'?:
													| {
															url: string;
															processingStatus: MediaFileProcessingStatus;
															mimeType?: string | undefined;
															cdnUrl?: string | undefined;
															size?: number | undefined;
													  }
													| undefined;
												'poster_hd.jpg'?:
													| {
															url: string;
															processingStatus: MediaFileProcessingStatus;
															mimeType?: string | undefined;
															cdnUrl?: string | undefined;
															size?: number | undefined;
													  }
													| undefined;
										  }
										| undefined;
									mediaMetadata?:
										| {
												duration?: number | undefined;
										  }
										| undefined;
									representations?:
										| {
												image?: object | undefined;
										  }
										| undefined;
									name: string;
									size: number;
									mediaType: MediaType;
									mimeType: string;
									preview?:
										| Promise<FilePreview>
										| {
												value:
													| string
													| {
															size: number;
															type: string;
															arrayBuffer: () => Promise<ArrayBuffer>;
															bytes: () => Promise<Uint8Array<ArrayBuffer>>;
															slice: (start?: number, end?: number, contentType?: string) => Blob;
															stream: () => ReadableStream<Uint8Array<ArrayBuffer>>;
															text: () => Promise<string>;
													  };
												origin?: 'local' | 'remote' | undefined;
												originalDimensions?:
													| {
															width: number;
															height: number;
													  }
													| undefined;
										  }
										| undefined;
									createdAt?: number | undefined;
									abuseClassification?:
										| {
												classification: 'ABHORRENT' | 'MALICIOUS' | 'ILLICIT' | 'COPYRIGHT';
												confidence: 'HIGH' | 'MEDIUM' | 'LOW' | 'SYNTHETIC';
										  }
										| undefined;
									id: string;
									occurrenceKey?: string | undefined;
									metadataTraceContext?:
										| {
												traceId: string;
												spanId?: string | undefined;
										  }
										| undefined;
									hash?: string | undefined;
							  }
							| {
									status: 'processed';
									artifacts: {
										[x: `ugc_caption_${string}`]: {
											createdAt?: number | undefined;
											url: string;
											mimeType?: string | undefined;
											cdnUrl?: string | undefined;
											size?: number | undefined;
										};
										'image.png'?:
											| {
													url: string;
													processingStatus: MediaFileProcessingStatus;
													mimeType?: string | undefined;
													cdnUrl?: string | undefined;
													size?: number | undefined;
											  }
											| undefined;
										'image.jpg'?:
											| {
													url: string;
													processingStatus: MediaFileProcessingStatus;
													mimeType?: string | undefined;
													cdnUrl?: string | undefined;
													size?: number | undefined;
											  }
											| undefined;
										'image.gif'?:
											| {
													url: string;
													processingStatus: MediaFileProcessingStatus;
													mimeType?: string | undefined;
													cdnUrl?: string | undefined;
													size?: number | undefined;
											  }
											| undefined;
										'image.webp'?:
											| {
													url: string;
													processingStatus: MediaFileProcessingStatus;
													mimeType?: string | undefined;
													cdnUrl?: string | undefined;
													size?: number | undefined;
											  }
											| undefined;
										'thumb.jpg'?:
											| {
													url: string;
													processingStatus: MediaFileProcessingStatus;
													mimeType?: string | undefined;
													cdnUrl?: string | undefined;
													size?: number | undefined;
											  }
											| undefined;
										'thumb_120.jpg'?:
											| {
													url: string;
													processingStatus: MediaFileProcessingStatus;
													mimeType?: string | undefined;
													cdnUrl?: string | undefined;
													size?: number | undefined;
											  }
											| undefined;
										'thumb_320.jpg'?:
											| {
													url: string;
													processingStatus: MediaFileProcessingStatus;
													mimeType?: string | undefined;
													cdnUrl?: string | undefined;
													size?: number | undefined;
											  }
											| undefined;
										'thumb_large.jpg'?:
											| {
													url: string;
													processingStatus: MediaFileProcessingStatus;
													mimeType?: string | undefined;
													cdnUrl?: string | undefined;
													size?: number | undefined;
											  }
											| undefined;
										'document.pdf'?:
											| {
													url: string;
													processingStatus: MediaFileProcessingStatus;
													mimeType?: string | undefined;
													cdnUrl?: string | undefined;
													size?: number | undefined;
											  }
											| undefined;
										'document.txt'?:
											| {
													url: string;
													processingStatus: MediaFileProcessingStatus;
													mimeType?: string | undefined;
													cdnUrl?: string | undefined;
													size?: number | undefined;
											  }
											| undefined;
										'document.html'?:
											| {
													url: string;
													processingStatus: MediaFileProcessingStatus;
													mimeType?: string | undefined;
													cdnUrl?: string | undefined;
													size?: number | undefined;
											  }
											| undefined;
										'audio.mp3'?:
											| {
													url: string;
													processingStatus: MediaFileProcessingStatus;
													mimeType?: string | undefined;
													cdnUrl?: string | undefined;
													size?: number | undefined;
											  }
											| undefined;
										'video.mp4'?:
											| {
													url: string;
													processingStatus: MediaFileProcessingStatus;
													mimeType?: string | undefined;
													cdnUrl?: string | undefined;
													size?: number | undefined;
											  }
											| undefined;
										'video_640.mp4'?:
											| {
													url: string;
													processingStatus: MediaFileProcessingStatus;
													mimeType?: string | undefined;
													cdnUrl?: string | undefined;
													size?: number | undefined;
											  }
											| undefined;
										'video_1280.mp4'?:
											| {
													url: string;
													processingStatus: MediaFileProcessingStatus;
													mimeType?: string | undefined;
													cdnUrl?: string | undefined;
													size?: number | undefined;
											  }
											| undefined;
										'video_hd.mp4'?:
											| {
													url: string;
													processingStatus: MediaFileProcessingStatus;
													mimeType?: string | undefined;
													cdnUrl?: string | undefined;
													size?: number | undefined;
											  }
											| undefined;
										'poster.jpg'?:
											| {
													url: string;
													processingStatus: MediaFileProcessingStatus;
													mimeType?: string | undefined;
													cdnUrl?: string | undefined;
													size?: number | undefined;
											  }
											| undefined;
										'poster_640.jpg'?:
											| {
													url: string;
													processingStatus: MediaFileProcessingStatus;
													mimeType?: string | undefined;
													cdnUrl?: string | undefined;
													size?: number | undefined;
											  }
											| undefined;
										'poster_1280.jpg'?:
											| {
													url: string;
													processingStatus: MediaFileProcessingStatus;
													mimeType?: string | undefined;
													cdnUrl?: string | undefined;
													size?: number | undefined;
											  }
											| undefined;
										'poster_hd.jpg'?:
											| {
													url: string;
													processingStatus: MediaFileProcessingStatus;
													mimeType?: string | undefined;
													cdnUrl?: string | undefined;
													size?: number | undefined;
											  }
											| undefined;
									};
									mediaMetadata?:
										| {
												duration?: number | undefined;
										  }
										| undefined;
									representations?:
										| {
												image?: object | undefined;
										  }
										| undefined;
									name: string;
									size: number;
									mediaType: MediaType;
									mimeType: string;
									preview?:
										| Promise<FilePreview>
										| {
												value:
													| string
													| {
															size: number;
															type: string;
															arrayBuffer: () => Promise<ArrayBuffer>;
															bytes: () => Promise<Uint8Array<ArrayBuffer>>;
															slice: (start?: number, end?: number, contentType?: string) => Blob;
															stream: () => ReadableStream<Uint8Array<ArrayBuffer>>;
															text: () => Promise<string>;
													  };
												origin?: 'local' | 'remote' | undefined;
												originalDimensions?:
													| {
															width: number;
															height: number;
													  }
													| undefined;
										  }
										| undefined;
									createdAt?: number | undefined;
									abuseClassification?:
										| {
												classification: 'ABHORRENT' | 'MALICIOUS' | 'ILLICIT' | 'COPYRIGHT';
												confidence: 'HIGH' | 'MEDIUM' | 'LOW' | 'SYNTHETIC';
										  }
										| undefined;
									id: string;
									occurrenceKey?: string | undefined;
									metadataTraceContext?:
										| {
												traceId: string;
												spanId?: string | undefined;
										  }
										| undefined;
									hash?: string | undefined;
							  }
							| {
									status: 'error';
									id: string;
									reason?: string | undefined;
									message?: string | undefined;
									details?:
										| {
												[x: string]: any;
										  }
										| undefined;
									occurrenceKey?: string | undefined;
									metadataTraceContext?:
										| {
												traceId: string;
												spanId?: string | undefined;
										  }
										| undefined;
									hash?: string | undefined;
							  }
							| {
									status: 'failed-processing';
									artifacts: object;
									representations?:
										| {
												image?: object | undefined;
										  }
										| undefined;
									failReason?: ProcessingFailReason | undefined;
									name: string;
									size: number;
									mediaType: MediaType;
									mimeType: string;
									preview?:
										| Promise<FilePreview>
										| {
												value:
													| string
													| {
															size: number;
															type: string;
															arrayBuffer: () => Promise<ArrayBuffer>;
															bytes: () => Promise<Uint8Array<ArrayBuffer>>;
															slice: (start?: number, end?: number, contentType?: string) => Blob;
															stream: () => ReadableStream<Uint8Array<ArrayBuffer>>;
															text: () => Promise<string>;
													  };
												origin?: 'local' | 'remote' | undefined;
												originalDimensions?:
													| {
															width: number;
															height: number;
													  }
													| undefined;
										  }
										| undefined;
									createdAt?: number | undefined;
									abuseClassification?:
										| {
												classification: 'ABHORRENT' | 'MALICIOUS' | 'ILLICIT' | 'COPYRIGHT';
												confidence: 'HIGH' | 'MEDIUM' | 'LOW' | 'SYNTHETIC';
										  }
										| undefined;
									id: string;
									occurrenceKey?: string | undefined;
									metadataTraceContext?:
										| {
												traceId: string;
												spanId?: string | undefined;
										  }
										| undefined;
									hash?: string | undefined;
							  };
					};
			  }) => void),
		shouldReplace?: boolean | undefined,
	): void;
} =
	process.env.NODE_ENV === 'development' && !process.env.CI
		? (mediaStoreWithDevtools as MediaStore)
		: mediaStoreWithoutDevtools;

export const createMediaStore = (
	initialStore?: Store,
): Omit<
	Omit<StoreApi<Store>, 'subscribe'> & {
		subscribe: {
			(listener: (selectedState: Store, previousSelectedState: Store) => void): () => void;
			<U>(
				selector: (state: Store) => U,
				listener: (selectedState: U, previousSelectedState: U) => void,
				options?:
					| {
							equalityFn?: ((a: U, b: U) => boolean) | undefined;
							fireImmediately?: boolean;
					  }
					| undefined,
			): () => void;
		};
	},
	'setState'
> & {
	setState(
		nextStateOrUpdater:
			| Store
			| Partial<Store>
			| ((state: {
					files: {
						[x: string]:
							| {
									status: 'uploading';
									progress: number;
									name: string;
									size: number;
									mediaType: MediaType;
									mimeType: string;
									preview?:
										| Promise<FilePreview>
										| {
												value:
													| string
													| {
															size: number;
															type: string;
															arrayBuffer: () => Promise<ArrayBuffer>;
															bytes: () => Promise<Uint8Array<ArrayBuffer>>;
															slice: (start?: number, end?: number, contentType?: string) => Blob;
															stream: () => ReadableStream<Uint8Array<ArrayBuffer>>;
															text: () => Promise<string>;
													  };
												origin?: 'local' | 'remote' | undefined;
												originalDimensions?:
													| {
															width: number;
															height: number;
													  }
													| undefined;
										  }
										| undefined;
									createdAt?: number | undefined;
									abuseClassification?:
										| {
												classification: 'ABHORRENT' | 'MALICIOUS' | 'ILLICIT' | 'COPYRIGHT';
												confidence: 'HIGH' | 'MEDIUM' | 'LOW' | 'SYNTHETIC';
										  }
										| undefined;
									id: string;
									occurrenceKey?: string | undefined;
									metadataTraceContext?:
										| {
												traceId: string;
												spanId?: string | undefined;
										  }
										| undefined;
									hash?: string | undefined;
							  }
							| {
									status: 'processing';
									artifacts?:
										| {
												[x: `ugc_caption_${string}`]: {
													createdAt?: number | undefined;
													url: string;
													mimeType?: string | undefined;
													cdnUrl?: string | undefined;
													size?: number | undefined;
												};
												'image.png'?:
													| {
															url: string;
															processingStatus: MediaFileProcessingStatus;
															mimeType?: string | undefined;
															cdnUrl?: string | undefined;
															size?: number | undefined;
													  }
													| undefined;
												'image.jpg'?:
													| {
															url: string;
															processingStatus: MediaFileProcessingStatus;
															mimeType?: string | undefined;
															cdnUrl?: string | undefined;
															size?: number | undefined;
													  }
													| undefined;
												'image.gif'?:
													| {
															url: string;
															processingStatus: MediaFileProcessingStatus;
															mimeType?: string | undefined;
															cdnUrl?: string | undefined;
															size?: number | undefined;
													  }
													| undefined;
												'image.webp'?:
													| {
															url: string;
															processingStatus: MediaFileProcessingStatus;
															mimeType?: string | undefined;
															cdnUrl?: string | undefined;
															size?: number | undefined;
													  }
													| undefined;
												'thumb.jpg'?:
													| {
															url: string;
															processingStatus: MediaFileProcessingStatus;
															mimeType?: string | undefined;
															cdnUrl?: string | undefined;
															size?: number | undefined;
													  }
													| undefined;
												'thumb_120.jpg'?:
													| {
															url: string;
															processingStatus: MediaFileProcessingStatus;
															mimeType?: string | undefined;
															cdnUrl?: string | undefined;
															size?: number | undefined;
													  }
													| undefined;
												'thumb_320.jpg'?:
													| {
															url: string;
															processingStatus: MediaFileProcessingStatus;
															mimeType?: string | undefined;
															cdnUrl?: string | undefined;
															size?: number | undefined;
													  }
													| undefined;
												'thumb_large.jpg'?:
													| {
															url: string;
															processingStatus: MediaFileProcessingStatus;
															mimeType?: string | undefined;
															cdnUrl?: string | undefined;
															size?: number | undefined;
													  }
													| undefined;
												'document.pdf'?:
													| {
															url: string;
															processingStatus: MediaFileProcessingStatus;
															mimeType?: string | undefined;
															cdnUrl?: string | undefined;
															size?: number | undefined;
													  }
													| undefined;
												'document.txt'?:
													| {
															url: string;
															processingStatus: MediaFileProcessingStatus;
															mimeType?: string | undefined;
															cdnUrl?: string | undefined;
															size?: number | undefined;
													  }
													| undefined;
												'document.html'?:
													| {
															url: string;
															processingStatus: MediaFileProcessingStatus;
															mimeType?: string | undefined;
															cdnUrl?: string | undefined;
															size?: number | undefined;
													  }
													| undefined;
												'audio.mp3'?:
													| {
															url: string;
															processingStatus: MediaFileProcessingStatus;
															mimeType?: string | undefined;
															cdnUrl?: string | undefined;
															size?: number | undefined;
													  }
													| undefined;
												'video.mp4'?:
													| {
															url: string;
															processingStatus: MediaFileProcessingStatus;
															mimeType?: string | undefined;
															cdnUrl?: string | undefined;
															size?: number | undefined;
													  }
													| undefined;
												'video_640.mp4'?:
													| {
															url: string;
															processingStatus: MediaFileProcessingStatus;
															mimeType?: string | undefined;
															cdnUrl?: string | undefined;
															size?: number | undefined;
													  }
													| undefined;
												'video_1280.mp4'?:
													| {
															url: string;
															processingStatus: MediaFileProcessingStatus;
															mimeType?: string | undefined;
															cdnUrl?: string | undefined;
															size?: number | undefined;
													  }
													| undefined;
												'video_hd.mp4'?:
													| {
															url: string;
															processingStatus: MediaFileProcessingStatus;
															mimeType?: string | undefined;
															cdnUrl?: string | undefined;
															size?: number | undefined;
													  }
													| undefined;
												'poster.jpg'?:
													| {
															url: string;
															processingStatus: MediaFileProcessingStatus;
															mimeType?: string | undefined;
															cdnUrl?: string | undefined;
															size?: number | undefined;
													  }
													| undefined;
												'poster_640.jpg'?:
													| {
															url: string;
															processingStatus: MediaFileProcessingStatus;
															mimeType?: string | undefined;
															cdnUrl?: string | undefined;
															size?: number | undefined;
													  }
													| undefined;
												'poster_1280.jpg'?:
													| {
															url: string;
															processingStatus: MediaFileProcessingStatus;
															mimeType?: string | undefined;
															cdnUrl?: string | undefined;
															size?: number | undefined;
													  }
													| undefined;
												'poster_hd.jpg'?:
													| {
															url: string;
															processingStatus: MediaFileProcessingStatus;
															mimeType?: string | undefined;
															cdnUrl?: string | undefined;
															size?: number | undefined;
													  }
													| undefined;
										  }
										| undefined;
									mediaMetadata?:
										| {
												duration?: number | undefined;
										  }
										| undefined;
									representations?:
										| {
												image?: object | undefined;
										  }
										| undefined;
									name: string;
									size: number;
									mediaType: MediaType;
									mimeType: string;
									preview?:
										| Promise<FilePreview>
										| {
												value:
													| string
													| {
															size: number;
															type: string;
															arrayBuffer: () => Promise<ArrayBuffer>;
															bytes: () => Promise<Uint8Array<ArrayBuffer>>;
															slice: (start?: number, end?: number, contentType?: string) => Blob;
															stream: () => ReadableStream<Uint8Array<ArrayBuffer>>;
															text: () => Promise<string>;
													  };
												origin?: 'local' | 'remote' | undefined;
												originalDimensions?:
													| {
															width: number;
															height: number;
													  }
													| undefined;
										  }
										| undefined;
									createdAt?: number | undefined;
									abuseClassification?:
										| {
												classification: 'ABHORRENT' | 'MALICIOUS' | 'ILLICIT' | 'COPYRIGHT';
												confidence: 'HIGH' | 'MEDIUM' | 'LOW' | 'SYNTHETIC';
										  }
										| undefined;
									id: string;
									occurrenceKey?: string | undefined;
									metadataTraceContext?:
										| {
												traceId: string;
												spanId?: string | undefined;
										  }
										| undefined;
									hash?: string | undefined;
							  }
							| {
									status: 'processed';
									artifacts: {
										[x: `ugc_caption_${string}`]: {
											createdAt?: number | undefined;
											url: string;
											mimeType?: string | undefined;
											cdnUrl?: string | undefined;
											size?: number | undefined;
										};
										'image.png'?:
											| {
													url: string;
													processingStatus: MediaFileProcessingStatus;
													mimeType?: string | undefined;
													cdnUrl?: string | undefined;
													size?: number | undefined;
											  }
											| undefined;
										'image.jpg'?:
											| {
													url: string;
													processingStatus: MediaFileProcessingStatus;
													mimeType?: string | undefined;
													cdnUrl?: string | undefined;
													size?: number | undefined;
											  }
											| undefined;
										'image.gif'?:
											| {
													url: string;
													processingStatus: MediaFileProcessingStatus;
													mimeType?: string | undefined;
													cdnUrl?: string | undefined;
													size?: number | undefined;
											  }
											| undefined;
										'image.webp'?:
											| {
													url: string;
													processingStatus: MediaFileProcessingStatus;
													mimeType?: string | undefined;
													cdnUrl?: string | undefined;
													size?: number | undefined;
											  }
											| undefined;
										'thumb.jpg'?:
											| {
													url: string;
													processingStatus: MediaFileProcessingStatus;
													mimeType?: string | undefined;
													cdnUrl?: string | undefined;
													size?: number | undefined;
											  }
											| undefined;
										'thumb_120.jpg'?:
											| {
													url: string;
													processingStatus: MediaFileProcessingStatus;
													mimeType?: string | undefined;
													cdnUrl?: string | undefined;
													size?: number | undefined;
											  }
											| undefined;
										'thumb_320.jpg'?:
											| {
													url: string;
													processingStatus: MediaFileProcessingStatus;
													mimeType?: string | undefined;
													cdnUrl?: string | undefined;
													size?: number | undefined;
											  }
											| undefined;
										'thumb_large.jpg'?:
											| {
													url: string;
													processingStatus: MediaFileProcessingStatus;
													mimeType?: string | undefined;
													cdnUrl?: string | undefined;
													size?: number | undefined;
											  }
											| undefined;
										'document.pdf'?:
											| {
													url: string;
													processingStatus: MediaFileProcessingStatus;
													mimeType?: string | undefined;
													cdnUrl?: string | undefined;
													size?: number | undefined;
											  }
											| undefined;
										'document.txt'?:
											| {
													url: string;
													processingStatus: MediaFileProcessingStatus;
													mimeType?: string | undefined;
													cdnUrl?: string | undefined;
													size?: number | undefined;
											  }
											| undefined;
										'document.html'?:
											| {
													url: string;
													processingStatus: MediaFileProcessingStatus;
													mimeType?: string | undefined;
													cdnUrl?: string | undefined;
													size?: number | undefined;
											  }
											| undefined;
										'audio.mp3'?:
											| {
													url: string;
													processingStatus: MediaFileProcessingStatus;
													mimeType?: string | undefined;
													cdnUrl?: string | undefined;
													size?: number | undefined;
											  }
											| undefined;
										'video.mp4'?:
											| {
													url: string;
													processingStatus: MediaFileProcessingStatus;
													mimeType?: string | undefined;
													cdnUrl?: string | undefined;
													size?: number | undefined;
											  }
											| undefined;
										'video_640.mp4'?:
											| {
													url: string;
													processingStatus: MediaFileProcessingStatus;
													mimeType?: string | undefined;
													cdnUrl?: string | undefined;
													size?: number | undefined;
											  }
											| undefined;
										'video_1280.mp4'?:
											| {
													url: string;
													processingStatus: MediaFileProcessingStatus;
													mimeType?: string | undefined;
													cdnUrl?: string | undefined;
													size?: number | undefined;
											  }
											| undefined;
										'video_hd.mp4'?:
											| {
													url: string;
													processingStatus: MediaFileProcessingStatus;
													mimeType?: string | undefined;
													cdnUrl?: string | undefined;
													size?: number | undefined;
											  }
											| undefined;
										'poster.jpg'?:
											| {
													url: string;
													processingStatus: MediaFileProcessingStatus;
													mimeType?: string | undefined;
													cdnUrl?: string | undefined;
													size?: number | undefined;
											  }
											| undefined;
										'poster_640.jpg'?:
											| {
													url: string;
													processingStatus: MediaFileProcessingStatus;
													mimeType?: string | undefined;
													cdnUrl?: string | undefined;
													size?: number | undefined;
											  }
											| undefined;
										'poster_1280.jpg'?:
											| {
													url: string;
													processingStatus: MediaFileProcessingStatus;
													mimeType?: string | undefined;
													cdnUrl?: string | undefined;
													size?: number | undefined;
											  }
											| undefined;
										'poster_hd.jpg'?:
											| {
													url: string;
													processingStatus: MediaFileProcessingStatus;
													mimeType?: string | undefined;
													cdnUrl?: string | undefined;
													size?: number | undefined;
											  }
											| undefined;
									};
									mediaMetadata?:
										| {
												duration?: number | undefined;
										  }
										| undefined;
									representations?:
										| {
												image?: object | undefined;
										  }
										| undefined;
									name: string;
									size: number;
									mediaType: MediaType;
									mimeType: string;
									preview?:
										| Promise<FilePreview>
										| {
												value:
													| string
													| {
															size: number;
															type: string;
															arrayBuffer: () => Promise<ArrayBuffer>;
															bytes: () => Promise<Uint8Array<ArrayBuffer>>;
															slice: (start?: number, end?: number, contentType?: string) => Blob;
															stream: () => ReadableStream<Uint8Array<ArrayBuffer>>;
															text: () => Promise<string>;
													  };
												origin?: 'local' | 'remote' | undefined;
												originalDimensions?:
													| {
															width: number;
															height: number;
													  }
													| undefined;
										  }
										| undefined;
									createdAt?: number | undefined;
									abuseClassification?:
										| {
												classification: 'ABHORRENT' | 'MALICIOUS' | 'ILLICIT' | 'COPYRIGHT';
												confidence: 'HIGH' | 'MEDIUM' | 'LOW' | 'SYNTHETIC';
										  }
										| undefined;
									id: string;
									occurrenceKey?: string | undefined;
									metadataTraceContext?:
										| {
												traceId: string;
												spanId?: string | undefined;
										  }
										| undefined;
									hash?: string | undefined;
							  }
							| {
									status: 'error';
									id: string;
									reason?: string | undefined;
									message?: string | undefined;
									details?:
										| {
												[x: string]: any;
										  }
										| undefined;
									occurrenceKey?: string | undefined;
									metadataTraceContext?:
										| {
												traceId: string;
												spanId?: string | undefined;
										  }
										| undefined;
									hash?: string | undefined;
							  }
							| {
									status: 'failed-processing';
									artifacts: object;
									representations?:
										| {
												image?: object | undefined;
										  }
										| undefined;
									failReason?: ProcessingFailReason | undefined;
									name: string;
									size: number;
									mediaType: MediaType;
									mimeType: string;
									preview?:
										| Promise<FilePreview>
										| {
												value:
													| string
													| {
															size: number;
															type: string;
															arrayBuffer: () => Promise<ArrayBuffer>;
															bytes: () => Promise<Uint8Array<ArrayBuffer>>;
															slice: (start?: number, end?: number, contentType?: string) => Blob;
															stream: () => ReadableStream<Uint8Array<ArrayBuffer>>;
															text: () => Promise<string>;
													  };
												origin?: 'local' | 'remote' | undefined;
												originalDimensions?:
													| {
															width: number;
															height: number;
													  }
													| undefined;
										  }
										| undefined;
									createdAt?: number | undefined;
									abuseClassification?:
										| {
												classification: 'ABHORRENT' | 'MALICIOUS' | 'ILLICIT' | 'COPYRIGHT';
												confidence: 'HIGH' | 'MEDIUM' | 'LOW' | 'SYNTHETIC';
										  }
										| undefined;
									id: string;
									occurrenceKey?: string | undefined;
									metadataTraceContext?:
										| {
												traceId: string;
												spanId?: string | undefined;
										  }
										| undefined;
									hash?: string | undefined;
							  };
					};
			  }) => void),
		shouldReplace?: boolean | undefined,
	): void;
} => {
	return createStore<Store>()(subscribeWithSelector(immer(() => ({ files: {}, ...initialStore }))));
};
