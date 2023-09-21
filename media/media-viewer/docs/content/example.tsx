import React from 'react';
import { md, Example, code } from '@atlaskit/docs';

export default md`
  ${(
    <Example
      Component={require('../../examples/0-basic-example').default}
      title="Single File Preview"
      source={require('!!raw-loader!../../examples/0-basic-example')}
    />
  )}

  ## Detecting when MediaViewer Opens/Closes

  Cross-origin communication for when MediaViewer is opened and closed is enabled via a [MessageEvent](https://developer.mozilla.org/en-US/docs/Web/API/MessageEvent). The message data sent will be of type MediaMessage, which follows the below format.

  ${code`
  {
    source: 'media';
    event: 'mediaViewerOpened' | 'mediaViewerClosed';
  }
  `}
`;
