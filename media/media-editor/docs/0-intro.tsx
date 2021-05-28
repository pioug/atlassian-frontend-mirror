import React from 'react';
import {
  md,
  code,
  Example,
  Props,
  AtlassianInternalWarning,
} from '@atlaskit/docs';
import { createRxjsNotice } from '@atlaskit/media-common/docs';

export default md`
  ${(<AtlassianInternalWarning />)}

  ${createRxjsNotice('Media Editor')}
  
  This component provides a way to do image annotations.

  ## Usage

  ${code`
  import { MediaEditor } from '@atlaskit/media-editor';
  import { tallImage as imageDataUri } from '@atlaskit/media-test-helpers';

  const App = () => (
    <MediaEditor
      imageUrl={imageDataUri}
      tool={'arrow'}
    />
  );
  `}
  
    ${(
      <Example
        Component={require('../examples/4-smart-media-editor').default}
        title="Fixed Sized"
        source={require('!!raw-loader!../examples/4-smart-media-editor')}
      />
    )}
  
  ${(
    <Props
      heading="Media Editor Props"
      props={require('!!extract-react-types-loader!../src/react/mediaEditor')}
    />
  )}
`;
