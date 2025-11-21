import { Component } from 'react';
import { start, end } from 'perf-marks';
import {
	type MediaClient,
	getMediaClientErrorReason,
	isCommonMediaClientError,
} from '@atlaskit/media-client';
import { ANALYTICS_MEDIA_CHANNEL, type MediaFeatureFlags } from '@atlaskit/media-common';
import { fg } from '@atlaskit/platform-feature-flags';
import { type UploadService } from '../service/types';
import {
	type UploadEndEventPayload,
	type UploadErrorEventPayload,
	type UploadPreviewUpdateEventPayload,
	type UploadsStartEventPayload,
	type UploadParams,
	type UploadRejectionData,
} from '../types';
import { UploadComponent } from './component';
import { UploadServiceImpl } from '../service/uploadServiceImpl';
import { type LocalUploadConfig } from './types';
import { type WithAnalyticsEventsProps } from '@atlaskit/analytics-next';
import { type AnalyticsEventPayload } from '../types';
import { type ComponentName, getRequestMetadata } from '../util/analytics';
import {
	startMediaUploadUfoExperience,
	succeedMediaUploadUfoExperience,
	failMediaUploadUfoExperience,
} from '../util/ufoExperiences';

export type LocalUploadComponentBaseProps = {
	mediaClient: MediaClient;
	config: LocalUploadConfig;
	//This event is fired when files begin to upload
	onUploadsStart?: (payload: UploadsStartEventPayload) => void;
	//This event is fired when a preview (image) of the files uploaded is available
	onPreviewUpdate?: (payload: UploadPreviewUpdateEventPayload) => void;
	//This event is fired when the upload ends
	onEnd?: (payload: UploadEndEventPayload) => void;
	//This event is fired when errors occur during upload
	onError?: (payload: UploadErrorEventPayload) => void;
	featureFlags?: MediaFeatureFlags;
} & WithAnalyticsEventsProps;

export type LocalUploadComponentBaseState = {
	errorFlags: UploadRejectionData[];
};

export class LocalUploadComponentReact<
	Props extends LocalUploadComponentBaseProps,
> extends Component<Props, LocalUploadComponentBaseState> {
	protected readonly uploadService: UploadService;
	protected uploadComponent = new UploadComponent();

	state: LocalUploadComponentBaseState = {
		errorFlags: [],
	};

	constructor(
		props: Props,
		protected readonly componentName: ComponentName,
	) {
		super(props);

		const { mediaClient, config, onUploadsStart, onPreviewUpdate, onEnd, onError } = this.props;
		const tenantUploadParams = config.uploadParams;
		const { shouldCopyFileToRecents = true } = config;

		this.uploadComponent.on('uploads-start', this.fireCommencedEvent);
		this.uploadComponent.on('upload-end', this.fireUploadSucceeded);
		this.uploadComponent.on('upload-error', this.fireUploadFailed);
		if (onUploadsStart) {
			this.uploadComponent.on('uploads-start', onUploadsStart!);
		}
		if (onPreviewUpdate) {
			this.uploadComponent.on('upload-preview-update', onPreviewUpdate!);
		}
		if (onEnd) {
			this.uploadComponent.on('upload-end', onEnd!);
		}
		if (onError) {
			this.uploadComponent.on('upload-error', onError!);
		}

		this.uploadService = new UploadServiceImpl(
			mediaClient,
			tenantUploadParams,
			shouldCopyFileToRecents,
		);
		this.uploadService.on('files-added', this.onFilesAdded);
		this.uploadService.on('file-preview-update', this.onFilePreviewUpdate);
		this.uploadService.on('file-converting', this.onFileConverting);
		this.uploadService.on('file-upload-error', this.onUploadError);

		const onFileRejection = (rejectionData: UploadRejectionData) => {
			const { onUploadRejection } = tenantUploadParams;
			const shouldOverride = onUploadRejection?.(rejectionData);
			if (!shouldOverride) {
				this.addErrorFlag(rejectionData);
			}
		};
		this.uploadService.onFileRejection(onFileRejection);
		this.uploadService.onFileEmpty(onFileRejection);
	}

	private addErrorFlag = (flagData: UploadRejectionData) => {
		this.setState({
			errorFlags: [...this.state.errorFlags, flagData],
		});
	};

	protected dismissErrorFlag = () => {
		this.setState({
			errorFlags: this.state.errorFlags.slice(1),
		});
	};

	private fireCommencedEvent = (payload: UploadsStartEventPayload) => {
		const { files, traceContext } = payload;
		files.forEach(({ id: fileId, size: fileSize, type: fileMimetype }) => {
			start(`MediaPicker.fireUpload.${fileId}`);

			this.createAndFireAnalyticsEvent({
				eventType: 'operational',
				action: 'commenced',
				actionSubject: 'mediaUpload',
				actionSubjectId: 'localMedia',
				attributes: {
					sourceType: 'local',
					serviceName: 'upload',
					fileAttributes: {
						fileId,
						fileSize,
						fileMimetype,
					},
					traceContext,
				},
			});
			startMediaUploadUfoExperience(fileId, this.componentName);
		});
	};

	private fireUploadSucceeded = (payload: UploadEndEventPayload) => {
		const {
			file: { id: fileId, size: fileSize, type: fileMimetype },
			traceContext,
		} = payload;

		const { duration: uploadDurationMsec = -1 } = end(`MediaPicker.fireUpload.${fileId}`);

		this.createAndFireAnalyticsEvent({
			eventType: 'operational',
			action: 'succeeded',
			actionSubject: 'mediaUpload',
			actionSubjectId: 'localMedia',
			attributes: {
				sourceType: 'local',
				serviceName: 'upload',
				status: 'success',
				fileAttributes: {
					fileId,
					fileSize,
					fileMimetype,
				},
				uploadDurationMsec,
				traceContext,
			},
		});
		succeedMediaUploadUfoExperience(fileId, {
			fileId,
			fileSize,
			fileMimetype,
		});
	};

	private fireUploadFailed = async (payload: UploadErrorEventPayload) => {
		const {
			fileId,
			error: { name: errorName, rawError },
			traceContext,
		} = payload;

		const { duration: uploadDurationMsec = -1 } = end(`MediaPicker.fireUpload.${fileId}`);

		let errorDetail = 'unknown';
		if (fg('add_media_picker_error_detail')) {
			errorDetail =
				rawError && isCommonMediaClientError(rawError) && rawError.innerError?.message
					? rawError.innerError?.message
					: rawError instanceof Error
						? rawError.message
						: 'unknown';
		}

		this.createAndFireAnalyticsEvent({
			eventType: 'operational',
			action: 'failed',
			actionSubject: 'mediaUpload',
			actionSubjectId: 'localMedia',
			attributes: {
				sourceType: 'local',
				serviceName: 'upload',
				status: 'fail',
				failReason: errorName,
				error: !!rawError ? getMediaClientErrorReason(rawError) : 'unknown',
				request: !!rawError ? getRequestMetadata(rawError) : undefined,
				fileAttributes: {
					fileId,
				},
				uploadDurationMsec,
				traceContext,
				errorDetail,
			},
		});

		failMediaUploadUfoExperience(fileId, {
			failReason: errorName,
			error: !!rawError ? getMediaClientErrorReason(rawError) : 'unknown',
			errorDetail,
			request: !!rawError ? getRequestMetadata(rawError) : undefined,
			fileAttributes: {
				fileId,
			},
			uploadDurationMsec,
		});
	};

	protected createAndFireAnalyticsEvent = (payload: AnalyticsEventPayload) => {
		const { createAnalyticsEvent } = this.props;

		if (createAnalyticsEvent) {
			createAnalyticsEvent(payload).fire(ANALYTICS_MEDIA_CHANNEL);
		}
	};

	public cancel = (uniqueIdentifier?: string): void => {
		this.uploadService.cancel(uniqueIdentifier);
	};

	public setUploadParams(uploadParams: UploadParams): void {
		this.uploadService.setUploadParams(uploadParams);
	}

	private onFilesAdded = ({ files, traceContext }: UploadsStartEventPayload): void => {
		this.uploadComponent.emitUploadsStart(files, traceContext);
	};

	private onFilePreviewUpdate = ({ file, preview }: UploadPreviewUpdateEventPayload): void => {
		this.uploadComponent.emitUploadPreviewUpdate(file, preview);
	};

	private onFileConverting = ({ file, traceContext }: UploadEndEventPayload): void => {
		this.uploadComponent.emitUploadEnd(file, traceContext);
	};

	private onUploadError = ({ fileId, error, traceContext }: UploadErrorEventPayload): void => {
		this.uploadComponent.emitUploadError(fileId, error, traceContext);
	};
}
