import { Component } from 'react';
import { start, end } from 'perf-marks';
import { MediaClient } from '@atlaskit/media-client';
import { UploadService } from '../service/types';
import {
  UploadEndEventPayload,
  UploadErrorEventPayload,
  UploadPreviewUpdateEventPayload,
  UploadsStartEventPayload,
  UploadEventPayloadMap,
  UploadParams,
  MediaFile,
} from '../types';
import { UploadComponent } from './component';
import { UploadServiceImpl } from '../service/uploadServiceImpl';
import { LocalUploadConfig } from './types';
import { WithAnalyticsEventsProps } from '@atlaskit/analytics-next';
import {
  TRACK_EVENT_TYPE,
  OPERATIONAL_EVENT_TYPE,
  GasPurePayload,
  GasCorePayload,
} from '@atlaskit/analytics-gas-types';
import { name as packageName } from '../version.json';
import { ANALYTICS_MEDIA_CHANNEL } from './media-picker-analytics-error-boundary';

export type LocalUploadComponentBaseProps = {
  mediaClient: MediaClient;
  config: LocalUploadConfig;
  onUploadsStart?: (payload: UploadsStartEventPayload) => void;
  onPreviewUpdate?: (payload: UploadPreviewUpdateEventPayload) => void;
  onEnd?: (payload: UploadEndEventPayload) => void;
  onError?: (payload: UploadErrorEventPayload) => void;
} & WithAnalyticsEventsProps;

interface BasePayload {
  attributes: {
    packageName: string;
    sourceType: 'local' | 'cloud';
    fileAttributes?: {
      fileSize: number;
      fileMimetype: string;
    };
  };
}

export type FailurePayload = {
  status: 'fail';
  uploadDurationMsec: number;
  failReason: any;
};

export type SuccessPayload = {
  status: 'success';
  uploadDurationMsec: number;
};

type AdditionalPayloadAttributes = {} | FailurePayload | SuccessPayload;

type AnalyticsPayload = GasCorePayload &
  BasePayload &
  AdditionalPayloadAttributes & {
    action: 'commenced' | 'uploaded';
  };

type SizeAndType = Pick<MediaFile, 'size' | 'type'>;

const basePayload = (
  sizeAndType: SizeAndType | undefined,
  additionalAttributes: AdditionalPayloadAttributes = {},
): GasPurePayload & BasePayload & AdditionalPayloadAttributes => ({
  actionSubject: 'mediaUpload',
  actionSubjectId: 'localMedia',
  attributes: {
    packageName,
    sourceType: 'local',
    ...(sizeAndType
      ? {
          fileAttributes: {
            fileSize: sizeAndType.size,
            fileMimetype: sizeAndType.type,
          },
        }
      : {}),
    ...additionalAttributes,
  },
});

export class LocalUploadComponentReact<
  Props extends LocalUploadComponentBaseProps,
  M extends UploadEventPayloadMap = UploadEventPayloadMap
> extends Component<Props, {}> {
  protected readonly uploadService: UploadService;
  protected uploadComponent = new UploadComponent();

  constructor(props: Props) {
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
    payload.files.forEach(({ id, size, type }) => {
      start(`MediaPicker.fireUpload.${id}`);
      this.createAndFireAnalyticsEvent({
        ...basePayload({ size, type }),
        action: 'commenced',
        eventType: OPERATIONAL_EVENT_TYPE,
      });
    });
  };

  private fireUploadSucceeded = (payload: UploadEndEventPayload) => {
    const { size, type, id } = payload.file;

    const { duration = -1 } = end(`MediaPicker.fireUpload.${id}`);
    this.createAndFireAnalyticsEvent({
      ...basePayload({ size, type }, {
        status: 'success',
        uploadDurationMsec: duration,
      } as SuccessPayload),
      action: 'uploaded',
      eventType: TRACK_EVENT_TYPE,
    });
  };

  private fireUploadFailed = async (payload: UploadErrorEventPayload) => {
    const { duration = -1 } = end(`MediaPicker.fireUpload.${payload.fileId}`);
    this.createAndFireAnalyticsEvent({
      ...basePayload(undefined, {
        status: 'fail',
        failReason: payload.error.description,
        uploadDurationMsec: duration,
      } as FailurePayload),
      action: 'uploaded',
      eventType: TRACK_EVENT_TYPE,
    });
  };

  private createAndFireAnalyticsEvent = (payload: AnalyticsPayload) => {
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
