/** @jsx jsx */
/* eslint-disable jsx-a11y/media-has-caption */
import { jsx } from '@emotion/react';
import { useEffect, useState } from 'react';
import {
  MediaClient,
  Identifier,
  MediaFileArtifacts,
} from '@atlaskit/media-client';
import { nativePreviewButtonStyles } from './styles';

type NativeMediaViewerProps = {
  identifier: Identifier;
  mediaClient: MediaClient;
  onClick: () => void;
};

export const NativeMediaPreview = ({
  identifier,
  mediaClient,
  onClick,
}: NativeMediaViewerProps) => {
  const [url, setUrl] = useState(
    'dataURI' in identifier ? identifier.dataURI : '',
  );
  const [isPreviewUnavailable, setIsPreviewUnavailable] = useState(false);

  useEffect(() => {
    if ('id' in identifier) {
      const subsribable = mediaClient.file.getFileState(identifier.id);

      const setArtifactUrl = (
        artifacts: MediaFileArtifacts,
        artifact: keyof MediaFileArtifacts,
      ) =>
        mediaClient.mediaStore
          .getArtifactURL(artifacts, artifact)
          .then((url) => setUrl(url));

      const { unsubscribe } = subsribable.subscribe({
        next: (state) => {
          if (state.status === 'processed') {
            if (state.artifacts['image.png']) {
              setArtifactUrl(state.artifacts, 'image.png');
            } else if (state.artifacts['image.jpg']) {
              setArtifactUrl(state.artifacts, 'image.jpg');
            } else if (state.artifacts['thumb.jpg']) {
              setArtifactUrl(state.artifacts, 'thumb.jpg');
            } else {
              setIsPreviewUnavailable(true);
            }
          } else if (state.status === 'failed-processing') {
            setIsPreviewUnavailable(true);
          }
        },
        error: () => {
          setIsPreviewUnavailable(true);
        },
      });

      return unsubscribe;
    }
    return () => {};
  }, [identifier, mediaClient]);

  if (isPreviewUnavailable) {
    return (
      <button
        data-testid="media-native-preview"
        css={nativePreviewButtonStyles}
        onClick={onClick}
      >
        Preview Unavailable
      </button>
    );
  }

  if (url) {
    return (
      <button
        data-testid="media-native-preview"
        css={nativePreviewButtonStyles}
        onClick={onClick}
      >
        <img style={{ maxWidth: '100%' }} src={url} />
      </button>
    );
  }

  return <div>Loading file ...</div>;
};
