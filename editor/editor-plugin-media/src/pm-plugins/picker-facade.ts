import type { ErrorReportingHandler } from '@atlaskit/editor-common/utils';
import type { MediaFeatureFlags } from '@atlaskit/media-common/mediaFeatureFlags';
import type { MediaClientConfig } from '@atlaskit/media-core';
import { isImagePreview } from '@atlaskit/media-picker';
import type {
	MediaFile,
	UploadEndEventPayload,
	UploadErrorEventPayload,
	UploadParams,
	UploadPreviewUpdateEventPayload,
} from '@atlaskit/media-picker/types';

import type {
	CustomMediaPicker,
	MediaState,
	MediaStateEventListener,
	MediaStateEventSubscriber,
	MobileUploadEndEventPayload,
} from '../types';

type PickerType = 'clipboard' | 'dropzone' | 'customMediaPicker';
type ExtendedComponentConfigs = {
	clipboard: null;
	customMediaPicker: CustomMediaPicker;
	dropzone: null;
};

export type PickerFacadeConfig = {
	errorReporter: ErrorReportingHandler;
	featureFlags?: MediaFeatureFlags;
	mediaClientConfig: MediaClientConfig;
};

type NewMediaEvent = (
	state: MediaState,
	onStateChanged: MediaStateEventSubscriber,
	pickerType?: string,
) => void;

export default class PickerFacade {
	private picker?: CustomMediaPicker;
	private onDragListeners: Array<Function> = [];
	private pickerType: PickerType;
	private onStartListeners: Array<NewMediaEvent> = [];
	private eventListeners: Record<string, Array<MediaStateEventListener> | undefined> = {};
	private analyticsName: string | undefined;
	erroredFiles: Set<string>;
	constructor(
		pickerType: PickerType,
		readonly config: PickerFacadeConfig,
		readonly pickerConfig?: ExtendedComponentConfigs[PickerType],
		analyticsName?: string,
	) {
		this.pickerType = pickerType;
		this.analyticsName = analyticsName;
		this.erroredFiles = new Set();
	}

	// Ignored via go/ees005
	// eslint-disable-next-line require-await
	async init(): Promise<PickerFacade> {
		let picker;

		if (this.pickerType === 'customMediaPicker') {
			picker = this.picker = this.pickerConfig as CustomMediaPicker;
		}

		if (!picker) {
			return this;
		}

		picker.on('upload-preview-update', this.handleUploadPreviewUpdate);
		picker.on('upload-end', this.handleReady);
		picker.on('upload-error', this.handleUploadError);
		(picker as CustomMediaPicker).on('mobile-upload-end', this.handleMobileUploadEnd);

		return this;
	}

	get type() {
		return this.pickerType;
	}

	get mediaPicker() {
		return this.picker;
	}

	destroy(): void {
		const { picker } = this;

		if (!picker) {
			return;
		}

		picker.removeAllListeners('upload-preview-update');
		picker.removeAllListeners('upload-end');
		picker.removeAllListeners('upload-error');

		this.onStartListeners = [];
		this.onDragListeners = [];
	}

	setUploadParams(params: UploadParams): void {
		if (this.picker) {
			this.picker.setUploadParams(params);
		}
	}

	onNewMedia(cb: NewMediaEvent): void {
		this.onStartListeners.push(cb);
	}

	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	onDrag(cb: (state: 'enter' | 'leave') => any): void {
		this.onDragListeners.push(cb);
	}

	public handleUploadPreviewUpdate = (event: UploadPreviewUpdateEventPayload): void => {
		const { file, preview } = event;

		//check if upload-error was called before upload-preview-update
		const isErroredFile = this.erroredFiles.has(file.id);

		const { dimensions, scaleFactor } = isImagePreview(preview)
			? preview
			: { dimensions: undefined, scaleFactor: undefined };

		const state: MediaState = {
			id: file.id,
			fileName: file.name,
			fileSize: file.size,
			fileMimeType: file.type,
			collection: file.collectionName,
			dimensions,
			scaleFactor,
			status: isErroredFile ? 'error' : undefined,
		};

		this.eventListeners[file.id] = [];
		this.onStartListeners.forEach((cb) =>
			cb(
				state,
				(evt) => this.subscribeStateChanged(file, evt),
				this.analyticsName || this.pickerType,
			),
		);
	};

	private subscribeStateChanged = (file: MediaFile, onStateChanged: MediaStateEventListener) => {
		const subscribers = this.eventListeners[file.id];
		if (!subscribers) {
			return;
		}

		subscribers.push(onStateChanged);
	};

	public handleUploadError = ({ error, fileId }: UploadErrorEventPayload): void => {
		const listeners = this.eventListeners[fileId];
		this.erroredFiles.add(fileId);

		if (!listeners) {
			return;
		}

		listeners.forEach((cb) =>
			cb({
				id: fileId,
				status: 'error',
				error: error && { description: error.description, name: error.name },
			}),
		);

		// remove listeners
		delete this.eventListeners[fileId];
	};

	public handleMobileUploadEnd = (event: MobileUploadEndEventPayload): void => {
		const { file } = event;

		const listeners = this.eventListeners[file.id];
		if (!listeners) {
			return;
		}

		listeners.forEach((cb) =>
			cb({
				id: file.id,
				status: 'mobile-upload-end',
				fileMimeType: file.type,
				collection: file.collectionName,
				publicId: file.publicId,
			}),
		);
	};

	public handleReady = (event: UploadEndEventPayload): void => {
		const { file } = event;

		const listeners = this.eventListeners[file.id];
		if (!listeners) {
			return;
		}

		listeners.forEach((cb) =>
			cb({
				id: file.id,
				status: 'ready',
			}),
		);

		// remove listeners
		delete this.eventListeners[file.id];
	};
}
