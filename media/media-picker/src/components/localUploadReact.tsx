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
  UploadParams,
} from '../types';
import { UploadComponent } from './component';
import { UploadServiceImpl } from '../service/uploadServiceImpl';
import { LocalUploadConfig } from './types';
import { WithAnalyticsEventsProps } from '@atlaskit/analytics-next';
import { AnalyticsEventPayload, UploadRejectionData } from '../types';
import { ComponentName, getRequestMetadata } from '../util/analytics';
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
  //This event is fired when a file is rejected from being uploaded e.g. exceeds file size limit
  onFileRejection?: (rejectionData: UploadRejectionData) => void;
  featureFlags?: MediaFeatureFlags;
} & WithAnalyticsEventsProps;

export type LocalUploadComponentBaseState = {
  uploadRejectionFlags: UploadRejectionData[];
};

export class LocalUploadComponentReact<
  Props extends LocalUploadComponentBaseProps,
> extends Component<Props, LocalUploadComponentBaseState> {
  protected readonly uploadService: UploadService;
  protected uploadComponent = new UploadComponent();

  state: LocalUploadComponentBaseState = {
    uploadRejectionFlags: [],
  };

  constructor(props: Props, protected readonly componentName: ComponentName) {
    super(props);

    const {
      mediaClient,
      config,
      onUploadsStart,
      onPreviewUpdate,
      onEnd,
      onError,
      onFileRejection,
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
    if (onFileRejection) {
      this.uploadService.onFileRejection(onFileRejection);
    } else {
      this.uploadService.onFileRejection(this.addUploadRejectionFlag);
    }
  }

  private addUploadRejectionFlag = (rejectionData: UploadRejectionData) => {
    this.setState({
      uploadRejectionFlags: [...this.state.uploadRejectionFlags, rejectionData],
    });
  };

  protected dismissUploadRejectionFlag = () => {
    this.setState({
      uploadRejectionFlags: this.state.uploadRejectionFlags.slice(1),
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
        traceContext,
      },
    });

    failMediaUploadUfoExperience(fileId, {
      failReason: errorName,
      error: !!rawError ? getMediaClientErrorReason(rawError) : 'unknown',
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

  private onFilesAdded = ({
    files,
    traceContext,
  }: UploadsStartEventPayload): void => {
    this.uploadComponent.emitUploadsStart(files, traceContext);
  };

  private onFilePreviewUpdate = ({
    file,
    preview,
  }: UploadPreviewUpdateEventPayload): void => {
    this.uploadComponent.emitUploadPreviewUpdate(file, preview);
  };

  private onFileConverting = ({
    file,
    traceContext,
  }: UploadEndEventPayload): void => {
    this.uploadComponent.emitUploadEnd(file, traceContext);
  };

  private onUploadError = ({
    fileId,
    error,
    traceContext,
  }: UploadErrorEventPayload): void => {
    this.uploadComponent.emitUploadError(fileId, error, traceContext);
  };
}
