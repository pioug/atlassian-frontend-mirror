import React from 'react';

import { AtlassianInternalWarning, code, md } from '@atlaskit/docs';

export default md`
  ${(<AtlassianInternalWarning />)}

  Provides React hooks for easy integration with media client.

  ## Installation

  ${code`yarn add @atlaskit/media-client-react`}


  ## Usage

  ${code`
import React, { SyntheticEvent, useState } from 'react';

import {
  defaultCollectionName,
  defaultMediaPickerAuthProvider,
} from '@atlaskit/media-test-helpers';

import {
  MediaClientProvider,
  useFileState,
  useMediaClient
} from '@atlaskit/media-client-react';

// create media client config
const mediaClientConfig = {
  authProvider: defaultMediaPickerAuthProvider(),
};

function App() {
  return (
    // Provide the media client config to your App
    <MediaClientProvider clientConfig={mediaClientConfig}>
      <MyApp />
    </MediaClientProvider>
  );
}

function MyApp() {
  const [file, setFile] = useState<string>();
  // Access the client
  const mediaClient = useMediaClient();

  const uploadFile = (event: SyntheticEvent<HTMLInputElement>) => {
    const file = event.currentTarget.files![0];

    // upload
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
  // Get file state
  const { fileState } = useFileState(id, { collectionName });

  return (
    <>
      <div>id: {fileState?.id}</div>
      <div>Status: {fileState?.status}</div>
    </>
  );
}

render(<App />, document.getElementById('root'))
`}
`;
