import { type SyntheticEvent, useState } from 'react';

import { type FileIdentifier } from '@atlaskit/media-client';
import { useMediaClient } from '@atlaskit/media-client-react';

export const useSvgUploader = (collectionName?: string) => {
  const mediaClient = useMediaClient();
  const [identifier, setIdentifier] = useState<FileIdentifier>();
  const [status, setStatus] = useState<string>('');

  const uploadFn = async (event: SyntheticEvent<HTMLInputElement>) => {
    if (!event.currentTarget.files || !event.currentTarget.files.length) {
      return;
    }
    setStatus('Uploading');

    const file = event.currentTarget.files[0];
    const uplodableFile = {
      content: file,
      name: file.name,
      collection: collectionName,
    };

    mediaClient.file.upload(uplodableFile).subscribe({
      next: ({ status, id }) => {
        if (status === 'error') {
          setStatus('Error while uploading');
          return;
        }
        setStatus(status);
        setIdentifier({
          id,
          mediaItemType: 'file' as const,
          collectionName,
        });
      },
      error: () => {
        setStatus('Error while uploading');
      },
    });
  };

  return { status, identifier, uploadFn };
};
