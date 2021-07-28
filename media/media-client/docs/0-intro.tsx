import React from 'react';
import { md, code, Example, AtlassianInternalWarning } from '@atlaskit/docs';
import { createRxjsNotice } from '@atlaskit/media-common/docs';

export default md`
  ${(<AtlassianInternalWarning />)}

  ${createRxjsNotice('Media Client')}

  This package is the Media Client API Web Client Library.

  ## Usage

  ${code`import { MediaClient } from '@atlaskit/media-client';
const mediaClient = new MediaClient({ authProvider });
  `}

  ${(
    <Example
      Component={require('../examples/2-upload-file').default}
      title="Media Client"
      source={require('!!raw-loader!../examples/2-upload-file')}
    />
  )}

  ### Using Stargate Integration

  Stargate integration is enabled by default as long as an \`userAuthProvider\` is not provided.

  By default it uses the current domain as base URL. If you need to use a different base URL you can provide a \`stargateBaseUrl\` configuration:

  ${code`import { MediaClient } from '@atlaskit/media-client';
const mediaClient = new MediaClient({ authProvider, stargateBaseUrl: 'http://stargate.url' });
  `}
  
  ### Sync Operations
  
  Media Client allows sync operations by using initial Auth credentials when the consumer needs it _inmediatelly_ after instantiation (e.g., Server Side Rendering).
  MediaClientConfig requires the "initialAuth" attribute to provide an Auth object that does not come from an async Auth provider.
  
  Example:

  ${code`import { MediaClient } from '@atlaskit/media-client';

const mediaClientConfig = {
  authProvider: myAuthProvider,
  initialAuth: myAuth
}
const mediaClient = new MediaClient(mediaClientConfig);
const imageUrl = mediaClient.getImageUrlSync(myFileId, myParams);
  `}
`;
