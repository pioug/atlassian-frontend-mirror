import { MediaClient, FileState, ErrorFileState } from '@atlaskit/media-client';
import { ArchiveViewerError } from '../../errors';

export type ArchiveViewerProps = {
  item: Exclude<FileState, ErrorFileState>;
  mediaClient: MediaClient;
  collectionName?: string;
  onError: (error: ArchiveViewerError) => void;
  onSuccess: () => void;
};
