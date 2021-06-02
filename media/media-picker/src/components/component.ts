import {
  MediaFile,
  Preview,
  MediaError,
  UploadEventPayloadMap,
} from '../types';
import { GenericEventEmitter } from '../util/eventEmitter';
import { SelectedItem } from '../popup/domain';
import { PluginItemPayload } from '../domain/plugin';

export interface UploadEventEmitter {
  emitPluginItemsInserted(selectedPluginItems: SelectedItem[]): void;
  emitUploadsStart(files: MediaFile[]): void;
  emitUploadPreviewUpdate(file: MediaFile, preview: Preview): void;
  emitUploadEnd(file: MediaFile): void;
  emitUploadError(fileId: string, error: MediaError): void;
}

export class UploadComponent<M extends UploadEventPayloadMap>
  extends GenericEventEmitter<M>
  implements UploadEventEmitter {
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

  emitUploadsStart(files: MediaFile[]): void {
    this.emit('uploads-start', {
      files,
    });
  }

  emitUploadPreviewUpdate(file: MediaFile, preview: Preview): void {
    this.emit('upload-preview-update', {
      file,
      preview,
    });
  }

  emitUploadEnd(file: MediaFile): void {
    this.emit('upload-end', { file });
  }

  emitUploadError(fileId: string, error: MediaError): void {
    this.emit('upload-error', {
      fileId,
      error,
    });
  }
}
