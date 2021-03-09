import { MediaClient, FileState } from '@atlaskit/media-client';

export type ArchiveViewerProps = {
  item: FileState;
  mediaClient: MediaClient;
  collectionName?: string;
  onError: (error: Error) => void;
  onSuccess: () => void;
};
