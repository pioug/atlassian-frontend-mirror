import { MediaClient, FileState } from '@atlaskit/media-client';
import { ArchiveViewerError } from '../../errors';

export type ArchiveViewerProps = {
  item: FileState;
  mediaClient: MediaClient;
  collectionName?: string;
  onError: (error: ArchiveViewerError) => void;
  onSuccess: () => void;
};
