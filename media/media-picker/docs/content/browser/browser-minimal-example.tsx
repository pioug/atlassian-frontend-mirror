/** @jsx jsx */
import { jsx } from '@emotion/react';
import { defaultMediaPickerAuthProvider } from '@atlaskit/media-test-helpers';
import Button from '@atlaskit/button/standard-button';
import {
  BrowserConfig,
  UploadsStartEventPayload,
  UploadEndEventPayload,
} from '../../../src/types';
import { Browser } from '../../../src';
import { MediaClient, FileIdentifier } from '@atlaskit/media-client';
import { useState } from 'react';
import { NativeMediaViewer } from '../../../example-helpers/NativeMediaViewer';

const mediaClient = new MediaClient({
  authProvider: defaultMediaPickerAuthProvider(),
});

const BrowserExample = () => {
  const [showDialog, setShowDialog] = useState<boolean>(false);
  const [uploadEnd, setUploadEnd] = useState<boolean>(false);
  const [uploadStart, setUploadStart] = useState<boolean>(false);
  const [identifier, setIdentifier] = useState<FileIdentifier>({
    mediaItemType: 'file',
    id: '',
  });

  const onOpen = () => {
    setShowDialog(true);
    setUploadEnd(false);
    setUploadStart(false);
    setIdentifier((state) => {
      return { ...state, id: '' };
    });
  };

  const onClose = () => {
    setShowDialog(false);
  };

  const onEnd = (payload: UploadEndEventPayload) => {
    setUploadEnd(true);
    setUploadStart(false);
    setIdentifier((state) => {
      return { ...state, id: payload.file.id };
    });
  };

  const onUploadsStart = (payload: UploadsStartEventPayload) => {
    setUploadStart(true);
  };
  const browseConfig: BrowserConfig = {
    multiple: true,
    uploadParams: {},
  };

  if (!browseConfig || !mediaClient) {
    return null;
  }

  return (
    <div
      style={{
        height: '300px',
      }}
    >
      <Button appearance="primary" onClick={onOpen}>
        Open
      </Button>

      <Browser
        isOpen={showDialog}
        mediaClientConfig={mediaClient.config}
        config={browseConfig}
        onClose={onClose}
        onUploadsStart={onUploadsStart}
        onEnd={onEnd}
      />
      {uploadStart && <p>Upload started. Wait for it to finish !! </p>}
      {uploadEnd && (
        <div style={{ maxWidth: '300px', maxHeight: '250px' }}>
          <NativeMediaViewer id={identifier.id} mediaClient={mediaClient} />
        </div>
      )}
    </div>
  );
};
export default BrowserExample;
