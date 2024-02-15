import { useEffect } from 'react';

import type { FileState } from '@atlaskit/media-state';

import { useMediaClient } from './MediaClientProvider';
import { useMediaStore } from './useMediaStore';

export type UseFileStateResult = {
  fileState: FileState | undefined;
};

export type UseFileStateOptions = {
  collectionName?: string;
  occurrenceKey?: string;
  // If `true`, we don't fetch remote file state if not found in the cache.
  // The default value is `false`
  skipRemote?: boolean;
};

export function useFileState(
  id: string,
  options: UseFileStateOptions = {},
): UseFileStateResult {
  const { collectionName, occurrenceKey, skipRemote = false } = options;
  const mediaClient = useMediaClient();
  const fileState = useMediaStore(state => state.files[id]);
  useEffect(() => {
    // No need to resubscribe if there is a fileState already
    if (!fileState && !skipRemote) {
      mediaClient.file.getFileState(id, {
        collectionName,
        occurrenceKey,
      });
    }
  }, [id, mediaClient, collectionName, occurrenceKey, skipRemote, fileState]);

  return { fileState };
}
