/** @jsx jsx */
import { jsx } from '@emotion/react';
import { useState } from 'react';
import { createUploadMediaClientConfig } from '@atlaskit/media-test-helpers';
import { MediaClient, FileIdentifier } from '@atlaskit/media-client';
import { DropzoneConfig, UploadEndEventPayload } from '../../../src/types';
import { Card } from '@atlaskit/media-card';
import { Dropzone } from '../../../src';

const mediaClientConfig = createUploadMediaClientConfig();
const dropzoneMediaClient = new MediaClient(mediaClientConfig);

const DropzoneExample = () => {
  const [uploadEnd, setUploadEnd] = useState<boolean>(false);
  const [isDropped, setIsDropped] = useState<boolean>(false);
  const [identifier, setIdentifier] = useState<FileIdentifier>({
    mediaItemType: 'file',
    id: '',
  });

  const onEnd = (payload: UploadEndEventPayload) => {
    setUploadEnd(true);
    setIsDropped(false);
    setIdentifier((state) => {
      return { ...state, id: payload.file.id };
    });
  };

  const onDrop = () => {
    setIdentifier((state) => {
      return { ...state, id: '' };
    });
    setIsDropped(true);
    setUploadEnd(false);
  };

  const getConfig = () => {
    const config: DropzoneConfig = {
      container: document.getElementById('dropZone')!,
      uploadParams: {},
    };
    return config;
  };

  return (
    <div
      style={{
        height: '300px',
      }}
      id="dropZone"
    >
      Drag and drop your file, and you can see preview after it is uploaded !!
      {isDropped && !uploadEnd && <p>Upload in Progress !!</p>}
      <Dropzone
        mediaClientConfig={dropzoneMediaClient.config}
        config={getConfig()}
        onEnd={onEnd}
        onDrop={onDrop}
      />
      {uploadEnd && (
        <Card
          mediaClientConfig={dropzoneMediaClient.config}
          identifier={identifier}
        />
      )}
    </div>
  );
};

export default DropzoneExample;
