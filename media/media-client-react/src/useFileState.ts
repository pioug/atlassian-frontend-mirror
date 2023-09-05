import { useEffect } from 'react';

import { GetFileOptions } from '@atlaskit/media-client';
import type { FileState } from '@atlaskit/media-state';

import { useMediaClient } from './MediaClientProvider';
import { useMediaStore } from './useMediaStore';

export type UseFileStateResult = {
  fileState: FileState | undefined;
};

export function useFileState(
  id: string,
  options: GetFileOptions = {},
): UseFileStateResult {
  const { collectionName, occurrenceKey } = options;
  const mediaClient = useMediaClient();
  const fileState = useMediaStore(state => state.files[id]);
  useEffect(() => {
    mediaClient.file.getFileState(id, {
      collectionName,
      occurrenceKey,
    });
  }, [id, mediaClient, collectionName, occurrenceKey]);
  return { fileState };
}
