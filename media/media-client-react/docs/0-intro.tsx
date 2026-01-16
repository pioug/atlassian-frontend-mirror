import React from 'react';

import { AtlassianInternalWarning, code, md } from '@atlaskit/docs';

const _default_1: any = md`
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
  const [fileId, setFileId] = useState<string>('');
  // Access the client
  const mediaClient = useMediaClient();
  const { fileState } = useFileState(fileId, {
    collectionName: defaultCollectionName,
    skipRemote: !fileId,
  });

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
        setFileId(stream.id);
      });
  };
  return (
    <div>
      <input type="file" onChange={uploadFile} />
      <div>
        <h1>File</h1>
        <div>id: {fileState?.id}</div>
        <div>Status: {fileState?.status}</div>
      </div>
    </div>
  );
}

render(<App />, document.getElementById('root'))
`}
`;
export default _default_1;
