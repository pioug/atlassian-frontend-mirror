import { Component } from 'react';
import { start, end } from 'perf-marks';
import { MediaClient, getMediaClientErrorReason } from '@atlaskit/media-client';
import {
  ANALYTICS_MEDIA_CHANNEL,
  MediaFeatureFlags,
} from '@atlaskit/media-common';
import { UploadService } from '../service/types';
import {
  UploadEndEventPayload,
  UploadErrorEventPayload,
  UploadPreviewUpdateEventPayload,
  UploadsStartEventPayload,
  UploadEventPayloadMap,
  UploadParams,
} from '../types';
import { UploadComponent } from './component';
import { UploadServiceImpl } from '../service/uploadServiceImpl';
import { LocalUploadConfig } from './types';
import { WithAnalyticsEventsProps } from '@atlaskit/analytics-next';
import { AnalyticsEventPayload } from '../types';
import { ComponentName, getRequestMetadata } from '../util/analytics';

export type LocalUploadComponentBaseProps = {
  mediaClient: MediaClient;
  config: LocalUploadConfig;
  onUploadsStart?: (payload: UploadsStartEventPayload) => void;
  onPreviewUpdate?: (payload: UploadPreviewUpdateEventPayload) => void;
  onEnd?: (payload: UploadEndEventPayload) => void;
  onError?: (payload: UploadErrorEventPayload) => void;
  featureFlags?: MediaFeatureFlags;
} & WithAnalyticsEventsProps;

export class LocalUploadComponentReact<
  Props extends LocalUploadComponentBaseProps,
  M extends UploadEventPayloadMap = UploadEventPayloadMap
> extends Component<Props, {}> {
  protected readonly uploadService: UploadService;
  protected uploadComponent = new UploadComponent();

  constructor(props: Props, protected readonly componentName: ComponentName) {
    super(props);

    const {
      mediaClient,
      config,
      onUploadsStart,
      onPreviewUpdate,
      onEnd,
      onError,
    } = this.props;
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
  }

  private fireCommencedEvent = (payload: UploadsStartEventPayload) => {
    payload.files.forEach(
      ({ id: fileId, size: fileSize, type: fileMimetype }) => {
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
          },
        });
      },
    );
  };

  private fireUploadSucceeded = (payload: UploadEndEventPayload) => {
    const {
      file: { id: fileId, size: fileSize, type: fileMimetype },
    } = payload;

    const { duration: uploadDurationMsec = -1 } = end(
      `MediaPicker.fireUpload.${fileId}`,
    );

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
      },
    });
  };

  private fireUploadFailed = async (payload: UploadErrorEventPayload) => {
    const {
      fileId,
      error: { name: errorName, rawError },
    } = payload;

    const { duration: uploadDurationMsec = -1 } = end(
      `MediaPicker.fireUpload.${fileId}`,
    );

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
      },
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

  private onFilesAdded = ({ files }: UploadsStartEventPayload): void => {
    this.uploadComponent.emitUploadsStart(files);
  };

  private onFilePreviewUpdate = ({
    file,
    preview,
  }: UploadPreviewUpdateEventPayload): void => {
    this.uploadComponent.emitUploadPreviewUpdate(file, preview);
  };

  private onFileConverting = ({ file }: UploadEndEventPayload): void => {
    this.uploadComponent.emitUploadEnd(file);
  };

  private onUploadError = ({
    fileId,
    error,
  }: UploadErrorEventPayload): void => {
    this.uploadComponent.emitUploadError(fileId, error);
  };
}
