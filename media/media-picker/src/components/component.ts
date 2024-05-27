import {
  type MediaFile,
  type Preview,
  type MediaError,
  type UploadEventPayloadMap,
} from '../types';
import { GenericEventEmitter } from '../util/eventEmitter';
import { type SelectedItem } from '../popup/domain';
import { type PluginItemPayload } from '../domain/plugin';
import { type MediaTraceContext } from '@atlaskit/media-common';

export interface UploadEventEmitter {
  emitPluginItemsInserted(selectedPluginItems: SelectedItem[]): void;
  emitUploadsStart(files: MediaFile[], traceContext?: MediaTraceContext): void;
  emitUploadPreviewUpdate(file: MediaFile, preview: Preview): void;
  emitUploadEnd(file: MediaFile, traceContext?: MediaTraceContext): void;
  emitUploadError(
    fileId: string,
    error: MediaError,
    traceContext?: MediaTraceContext,
  ): void;
}

export class UploadComponent<M extends UploadEventPayloadMap>
  extends GenericEventEmitter<M>
  implements UploadEventEmitter
{
  emitPluginItemsInserted(selectedPluginItems: SelectedItem[]): void {
    const payload: PluginItemPayload[] = selectedPluginItems.map((item) => {
      return {
        pluginName: item.serviceName,
        pluginFile: {
          id: item.id,
          metadata: item.metadata,
        },
      };
    });

    this.emit('plugin-items-inserted', payload);
  }

  emitUploadsStart(files: MediaFile[], traceContext?: MediaTraceContext): void {
    this.emit('uploads-start', {
      files,
      traceContext,
    });
  }

  emitUploadPreviewUpdate(file: MediaFile, preview: Preview): void {
    this.emit('upload-preview-update', {
      file,
      preview,
    });
  }

  emitUploadEnd(file: MediaFile, traceContext?: MediaTraceContext): void {
    this.emit('upload-end', { file, traceContext });
  }

  emitUploadError(
    fileId: string,
    error: MediaError,
    traceContext?: MediaTraceContext,
  ): void {
    this.emit('upload-error', {
      fileId,
      error,
      traceContext,
    });
  }
}
