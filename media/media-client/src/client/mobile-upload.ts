import { getMediaTypeFromMimeType } from '@atlaskit/media-common';
import Dataloader from 'dataloader';
import { LRUCache } from 'lru-fast';
import { Interpreter } from 'xstate';

import { UploadingFileState } from '../models/file-state';
import {
  MobileUpload,
  MobileUploadStartEvent,
  MobileUploadProgressEvent,
  MobileUploadEndEvent,
  MobileUploadErrorEvent,
} from '../models/mobile-upload';
import { getFileStreamsCache } from '../file-streams-cache';
import {
  createFileDataloader,
  DataloaderKey,
  DataloaderResult,
} from '../utils/createFileDataLoader';
import {
  createServicesCache,
  createMobileUploadStateMachine,
  createMobileUploadService,
  createMobileFileStateSubject,
  StateMachineContext,
  StateMachineSchema,
  StateMachineEvent,
  StateMachineTypestate,
} from '../utils/mobileUpload';
import { MediaStore } from './media-store';
export class MobileUploadImpl implements MobileUpload {
  private readonly dataloader: Dataloader<DataloaderKey, DataloaderResult>;
  private readonly servicesCache: LRUCache<
    string,
    Interpreter<
      StateMachineContext,
      StateMachineSchema,
      StateMachineEvent,
      StateMachineTypestate
    >
  >;

  constructor(private readonly mediaStore: MediaStore) {
    this.dataloader = createFileDataloader(mediaStore);
    this.servicesCache = createServicesCache();
  }

  public notifyUploadStart(event: MobileUploadStartEvent) {
    const {
      fileId,
      collectionName,
      occurrenceKey,
      fileName,
      fileSize,
      fileMimetype,
      preview,
      createdAt,
    } = event;

    const mediaType = getMediaTypeFromMimeType(fileMimetype);

    const initialState: UploadingFileState = {
      status: 'uploading',
      id: fileId,
      occurrenceKey,
      name: fileName,
      size: fileSize,
      progress: 0,
      mediaType,
      mimeType: fileMimetype,
      preview,
      createdAt,
    };

    const service = createMobileUploadService(
      createMobileUploadStateMachine(
        this.dataloader,
        initialState,
        collectionName,
        this.mediaStore.featureFlags,
      ),
    );

    const subject = createMobileFileStateSubject(service);

    this.servicesCache.put(fileId, service);
    getFileStreamsCache().set(fileId, subject);
  }

  public notifyUploadProgress(event: MobileUploadProgressEvent) {
    const { fileId, progress } = event;

    const service = this.servicesCache.get(fileId);
    if (service) {
      service.send('UPLOAD_PROGRESS', { progress });
    }
  }

  public notifyUploadEnd(event: MobileUploadEndEvent) {
    const { fileId } = event;

    const service = this.servicesCache.get(fileId);
    if (service) {
      service.send('UPLOAD_END');
    }
  }

  public notifyUploadError(event: MobileUploadErrorEvent) {
    const { fileId, message } = event;

    const service = this.servicesCache.get(fileId);
    if (service) {
      service.send('UPLOAD_ERROR', { message });
    }
  }
}
