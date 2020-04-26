import { Server, Router, Database } from 'kakapo';
import * as exenv from 'exenv';
import uuid from 'uuid/v4';

import { MediaFile } from '@atlaskit/media-client';

import { createApiRouter, createMediaPlaygroundRouter } from './routers';
import { createDatabase, MediaDatabaseSchema } from './database';
import { mapDataUriToBlob } from '../utils';
import { dataURItoFile } from '@atlaskit/media-ui';
import { smallImage } from '../dataURIs/smallImageURI';

export type MockCollections = {
  [key: string]: Array<MediaFile & { blob?: Blob }>;
};

export interface MediaMockConfig {
  isSlowServer?: boolean;
  urlsReturnErrorsTo?: string[]; // Handler urls in createApiRouter (like /upload/:uploadId/chunks for ex)
}

export class MediaMock {
  private server = new Server<MediaDatabaseSchema>();
  private routers: Router<MediaDatabaseSchema>[] = [];
  private dbs: Database<MediaDatabaseSchema>[] = [];

  constructor(readonly collections?: MockCollections) {}

  enable(config: MediaMockConfig = {}): void {
    const { isSlowServer, urlsReturnErrorsTo } = config;
    if (!exenv.canUseDOM) {
      return;
    }
    this.routers = [
      createMediaPlaygroundRouter(),
      createApiRouter(isSlowServer, urlsReturnErrorsTo),
    ];

    this.dbs = [createDatabase(this.collections)];

    [...this.routers, ...this.dbs].forEach(this.server.use.bind(this.server));

    if (window) {
      (window as any).mediaMockControlsBackdoor = mediaMockControlsBackdoor;
    }
  }

  disable(): void {
    [...this.routers, ...this.dbs].forEach(
      this.server.remove.bind(this.server),
    );
    this.routers.forEach(router => router.reset());
    this.dbs.forEach(db => db.reset());
    this.routers = [];
    this.dbs = [];
  }
}

export type MockFileInputParams = Partial<MediaFile> & { dataUri?: string };
export type MockFile = MediaFile & { blob?: Blob };

export function generateFilesFromTestData(
  files: MockFileInputParams[],
): MockFile[] {
  return files.map(file => {
    const {
      processingStatus = 'succeeded',
      dataUri,
      id = uuid(),
      name = `test-file-${id}`,
      mediaType = 'image',
    } = file;
    const blob =
      dataUri && dataUri !== '' ? mapDataUriToBlob(dataUri) : undefined;

    return {
      id,
      blob,
      mimeType: (blob && blob.type) || 'inode/x-empty',
      mediaType,
      name,
      size: (blob && blob.size) || 0,
      artifacts: {},
      processingStatus,
      representations:
        processingStatus === 'succeeded'
          ? {
              image: {},
            }
          : {},
    };
  });
}

export const mediaMock = new MediaMock();

export interface MediaMockControlsBackdoor {
  resetMediaMock: (config?: MediaMockConfig) => void;
  shouldWaitUpload?: boolean;
  uploadImageFromDrag: () => void;
}

const mediaMockControlsBackdoor: MediaMockControlsBackdoor = {
  shouldWaitUpload: false,

  resetMediaMock: (config = {}) => {
    mediaMock.disable();
    mediaMock.enable(config);
  },

  /**
   * Used to simulate the dragging of an image into the editor
   * In the future we should consider using a general approach to uploading files as mentioned here:
   * https://sqa.stackexchange.com/questions/22191/is-it-possible-to-automate-drag-and-drop-from-a-file-in-system-to-a-website-in-s
   */
  uploadImageFromDrag: () => {
    const blob = dataURItoFile(smallImage);
    const imageFile = new File([blob], 'image.png', { type: 'image/png' });
    const dataTransfer: any = {
      files: [imageFile],
      types: ['Files'],
    };
    const event: any = new Event('drop', dataTransfer);
    event.dataTransfer = dataTransfer;
    document.body.dispatchEvent(event);
  },
};

export const mediaMockQueryOptInFlag = 'mediaMock=true';
export const isMediaMockOptedIn = () =>
  location.search.indexOf(mediaMockQueryOptInFlag) > -1;
