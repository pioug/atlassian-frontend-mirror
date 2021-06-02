import { Server, Router, Database } from 'kakapo';
import * as exenv from 'exenv';
import uuid from 'uuid/v4';

import { MediaFile } from '@atlaskit/media-client';

import { createApiRouter, createMediaPlaygroundRouter } from './routers';
import { createDatabase, MediaDatabaseSchema } from './database';
import { RemoteUploadActivityServer, WebSocketServer } from './websockets';
import { mapDataUriToBlob } from '../utils';
import { dataURItoFile } from '@atlaskit/media-ui/util';
import { smallImage } from '../dataURIs/smallImageURI';
import {
  createDropEventWithFiles,
  createFileSystemDirectoryEntry,
  createFileSystemFileEntry,
} from './fileAndDirectoriesUtils';

const blob = dataURItoFile(smallImage);
const imageFile = new File([blob], 'image.png', { type: 'image/png' });
const fileName = 'image.png';

export type MockCollections = {
  [key: string]: Array<MediaFile & { blob?: Blob }>;
};

export interface MediaMockConfig {
  isSlowServer?: boolean;
  urlsReturnErrorsTo?: string[]; // Handler urls in createApiRouter (like /upload/:uploadId/chunks for ex)
  mockRemoteUploadActivity?: boolean;
}

export class MediaMock {
  private server = new Server<MediaDatabaseSchema>();
  private routers: Router<MediaDatabaseSchema>[] = [];
  private dbs: Database<MediaDatabaseSchema>[] = [];
  private websockets: Array<WebSocketServer> = [];

  constructor(readonly collections?: MockCollections) {}

  enable(config: MediaMockConfig = {}): void {
    const {
      isSlowServer,
      urlsReturnErrorsTo,
      mockRemoteUploadActivity,
    } = config;

    if (!exenv.canUseDOM) {
      return;
    }

    this.routers = [
      createMediaPlaygroundRouter(),
      createApiRouter(isSlowServer, urlsReturnErrorsTo),
    ];

    const database = createDatabase(this.collections);
    this.dbs = [database];

    [...this.routers, ...this.dbs].forEach(this.server.use.bind(this.server));

    if (mockRemoteUploadActivity) {
      const wsServer = new RemoteUploadActivityServer({
        database,
        isSlowServer,
      });
      wsServer.start();
      this.websockets = [wsServer];
    }

    if (window) {
      (window as any).mediaMockControlsBackdoor = mediaMockControlsBackdoor;
    }
  }

  disable(): void {
    [...this.routers, ...this.dbs].forEach(
      this.server.remove.bind(this.server),
    );
    this.routers.forEach((router) => router.reset());
    this.dbs.forEach((db) => db.reset());
    this.routers = [];
    this.dbs = [];
    this.websockets.forEach((ws) => ws.stop());
    this.websockets = [];
  }
}

export type MockFileInputParams = Partial<MediaFile> & { dataUri?: string };
export type MockFile = MediaFile & { blob?: Blob };

export function generateFilesFromTestData(
  files: MockFileInputParams[],
): MockFile[] {
  return files.map((file) => {
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
  uploadFolderFromDrag: () => void;
  uploadFolderContainingFolderFromDrag: () => void;
}

const mediaMockControlsBackdoor: MediaMockControlsBackdoor = {
  shouldWaitUpload: false,

  resetMediaMock: (config = {}) => {
    mediaMock.disable();
    mediaMock.enable(config);
  },

  /**
   * Used to simulate the dragging of a folder (which contains a singular image) into the editor
   * Library used for folder uploads: https://github.com/zzarcon/flat-files
   */
  uploadFolderFromDrag: () => {
    const fileSystemFileEntry = createFileSystemFileEntry(
      fileName,
      `folder_one/folder_two/${fileName}`,
      imageFile,
    );

    // Represents a folder that contains a file
    const directoryEntryContainingFile = createFileSystemDirectoryEntry(
      fileName,
      `folder_one/folder_two/`,
      [fileSystemFileEntry],
    );

    const event = createDropEventWithFiles(directoryEntryContainingFile, [
      imageFile,
    ]);
    document.body.dispatchEvent(event);
    document.body
      .querySelector('.fabric-editor-popup-scroll-parent')!
      .dispatchEvent(event);
  },

  /**
   * Used to simulate the dragging of a folder, which contains a folder (which contains multiple images)
   **/
  uploadFolderContainingFolderFromDrag: () => {
    const fileSystemFileEntry = createFileSystemFileEntry(
      fileName,
      `folder_one/folder_two/${fileName}`,
      imageFile,
    );

    const directoryEntryContainingFiles = createFileSystemDirectoryEntry(
      fileName,
      `folder_one/folder_two/`,
      [
        fileSystemFileEntry,
        fileSystemFileEntry,
        fileSystemFileEntry,
        fileSystemFileEntry,
      ],
    );

    // Represents a folder that contains a folder
    const directoryEntry = createFileSystemDirectoryEntry(
      fileName,
      `folder_one/`,
      [directoryEntryContainingFiles],
    );

    const event = createDropEventWithFiles(directoryEntry, [
      imageFile,
      imageFile,
      imageFile,
      imageFile,
    ]);

    document.body.dispatchEvent(event);
    document.body
      .querySelector('.fabric-editor-popup-scroll-parent')!
      .dispatchEvent(event);
  },

  /**
   * Used to simulate the dragging of an image into the editor
   * In the future we should consider using a general approach to uploading files as mentioned here:
   * https://sqa.stackexchange.com/questions/22191/is-it-possible-to-automate-drag-and-drop-from-a-file-in-system-to-a-website-in-s
   */
  uploadImageFromDrag: () => {
    const fileSystemFileEntry = createFileSystemFileEntry(
      fileName,
      `folder_one/folder_two/${fileName}`,
      imageFile,
    );
    const event = createDropEventWithFiles(fileSystemFileEntry, [imageFile]);

    document.body.dispatchEvent(event);
    document.body
      .querySelector('.fabric-editor-popup-scroll-parent')!
      .dispatchEvent(event);
  },
};

export const mediaMockQueryOptInFlag = 'mediaMock=true';
export const isMediaMockOptedIn = () =>
  location.search.indexOf(mediaMockQueryOptInFlag) > -1;
