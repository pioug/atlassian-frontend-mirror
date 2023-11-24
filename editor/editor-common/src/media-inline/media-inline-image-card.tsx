/** @jsx jsx */
import type { FC } from 'react';
import { useEffect, useState } from 'react';

import type {
  FileIdentifier,
  FileState,
  MediaClient,
} from '@atlaskit/media-client';

export interface MediaInlineImageCardProps {
  identifier: FileIdentifier;
  mediaClient: MediaClient;
  isSelected?: boolean;
}

export const MediaInlineImageCard: FC<MediaInlineImageCardProps> = ({
  mediaClient,
  identifier,
}) => {
  const [fileState, setFileState] = useState<FileState | undefined>();
  const [subscribeError, setSubscribeError] = useState<Error>();

  useEffect(() => {
    const subscription = mediaClient.file
      .getFileState(identifier.id, {
        collectionName: identifier.collectionName,
      })
      .subscribe({
        next: (fileState) => {
          setFileState(fileState);
          setSubscribeError(undefined);
        },
        error: (e) => {
          setSubscribeError(e);
        },
      });
    return () => {
      subscription.unsubscribe();
    };
  }, [identifier.collectionName, identifier.id, mediaClient.file]);
  if (subscribeError) {
    // TODO:
    // referring to packages/media/media-card/src/inline/mediaInlineCard.tsx
    // for error message and analytics
    throw new Error(
      `not yet implemented: MediaInlineImageCard subscribe error view`,
    );
  }
  if (fileState?.status === 'error') {
    // TODO:
    // referring to packages/media/media-card/src/inline/mediaInlineCard.tsx
    // for error message and analytics
    throw new Error(`not yet implemented: MediaInlineImageCard error view`);
  }
  if (fileState?.status === 'failed-processing') {
    // TODO:
    // referring to packages/media/media-card/src/inline/mediaInlineCard.tsx
    // for error message and analytics
    throw new Error(
      `not yet implemented: MediaInlineImageCard failed-processing view`,
    );
  }
  // Empty file handling
  if (fileState && !fileState.name) {
    // TODO:
    // referring to packages/media/media-card/src/inline/mediaInlineCard.tsx
    // for error message and analytics
    throw new Error(
      `not yet implemented: MediaInlineImageCard empty file name error view`,
    );
  }
  if (fileState?.status === 'uploading') {
    throw new Error(`not yet implemented: MediaInlineImageCard uploading view`);
  }
  if (!fileState) {
    throw new Error(`not yet implemented: MediaInlineImageCard loading view`);
  }

  // TODO
  // use Card from `@atlaskit/media-card` with an inline block wrapper
  // with:
  // selection state and `mediaOptions.allowLazyLoading`
  throw new Error(`not yet implemented: MediaInlineImageCard loading view`);
};
