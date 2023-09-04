import React from 'react';

import { Example, md, Props } from '@atlaskit/docs';

export default md`

  editor-plugin-extension plugin for @atlaskit/editor-core

  ## Usage

  ${(
    <Example
      packageName="@atlaskit/editor-plugin-extension"
      title="Basic example"
    />
  )}

  ${(
    <Props
      heading="EditorPluginExtension Props"
      props={require('!!extract-react-types-loader!../src')}
    />
  )}
`;
