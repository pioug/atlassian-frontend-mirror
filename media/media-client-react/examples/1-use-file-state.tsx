import React, { SyntheticEvent, useState } from 'react';

import {
  defaultCollectionName,
  defaultMediaPickerAuthProvider,
} from '@atlaskit/media-test-helpers';

import { MediaClientProvider, useFileState, useMediaClient } from '../src';

const mediaClientConfig = {
  authProvider: defaultMediaPickerAuthProvider(),
};

function App() {
  return (
    <MediaClientProvider clientConfig={mediaClientConfig}>
      <MyApp />
    </MediaClientProvider>
  );
}

function MyApp() {
  const [file, setFile] = useState<string>();
  const mediaClient = useMediaClient();

  const uploadFile = (event: SyntheticEvent<HTMLInputElement>) => {
    const file = event.currentTarget.files![0];

    mediaClient.file
      .upload({
        content: file,
        name: file.name,
        collection: defaultCollectionName,
      })
      .subscribe(stream => {
        setFile(stream.id);
      });
  };
  return (
    <div>
      <input type="file" onChange={uploadFile} />
      <div>
        <h1>File</h1>
        {file && (
          <FileStateWrapper id={file} collectionName={defaultCollectionName} />
        )}
      </div>
    </div>
  );
}

interface Props {
  id: string;
  collectionName: string;
}

function FileStateWrapper({ id, collectionName }: Props) {
  const { fileState } = useFileState(id, { collectionName });

  return (
    <>
      <div>id: {fileState?.id}</div>
      <div>Status: {fileState?.status}</div>
    </>
  );
}

export default App;
