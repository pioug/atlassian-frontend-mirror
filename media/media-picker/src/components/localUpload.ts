import { MediaClient } from '@atlaskit/media-client';
import { UploadService } from '../service/types';
import {
  UploadEndEventPayload,
  UploadErrorEventPayload,
  UploadEventPayloadMap,
  UploadPreviewUpdateEventPayload,
  UploadsStartEventPayload,
  UploadParams,
} from '../types';
import { UploadComponent } from './component';
import { UploadServiceImpl } from '../service/uploadServiceImpl';
import { LocalUploadConfig } from './types';

export interface LocalUploadComponent<
  M extends UploadEventPayloadMap = UploadEventPayloadMap
> extends UploadComponent<M> {
  cancel(uniqueIdentifier?: string): void;
  setUploadParams(uploadParams: UploadParams): void;
}
export class LocalUploadComponent<
    M extends UploadEventPayloadMap = UploadEventPayloadMap
  >
  extends UploadComponent<M>
  implements LocalUploadComponent {
  protected readonly uploadService: UploadService;
  protected readonly mediaClient: MediaClient;
  protected config: LocalUploadConfig;

  constructor(mediaClient: MediaClient, config: LocalUploadConfig) {
    super();
    const tenantUploadParams = config.uploadParams;

    this.mediaClient = mediaClient;

    const { shouldCopyFileToRecents = true } = config;

    this.uploadService = new UploadServiceImpl(
      this.mediaClient,
      tenantUploadParams,
      shouldCopyFileToRecents,
    );
    this.config = config;
    this.uploadService.on('files-added', this.onFilesAdded);
    this.uploadService.on('file-preview-update', this.onFilePreviewUpdate);
    this.uploadService.on('file-converting', this.onFileConverting);
    this.uploadService.on('file-upload-error', this.onUploadError);
  }

  public addFiles = (files: File[]) => this.uploadService.addFiles(files);

  public cancel(uniqueIdentifier?: string): void {
    this.uploadService.cancel(uniqueIdentifier);
  }

  public setUploadParams(uploadParams: UploadParams): void {
    this.uploadService.setUploadParams(uploadParams);
  }

  private onFilesAdded = ({ files }: UploadsStartEventPayload): void => {
    this.emitUploadsStart(files);
  };

  private onFilePreviewUpdate = ({
    file,
    preview,
  }: UploadPreviewUpdateEventPayload): void => {
    this.emitUploadPreviewUpdate(file, preview);
  };

  private onFileConverting = ({ file }: UploadEndEventPayload): void => {
    this.emitUploadEnd(file);
  };

  private onUploadError = ({
    fileId,
    error,
  }: UploadErrorEventPayload): void => {
    this.emitUploadError(fileId, error);
  };
}
