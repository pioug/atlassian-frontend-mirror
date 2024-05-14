import React from 'react';

import { ComposableEditor } from '@atlaskit/editor-core/composable-editor';
import { usePreset } from '@atlaskit/editor-core/use-preset';
import { hyperlinkPlugin } from '@atlaskit/editor-plugin-hyperlink';
import { typeAheadPlugin } from '@atlaskit/editor-plugin-type-ahead';
import { basePlugin } from '@atlaskit/editor-plugins/base';
import { loomPlugin } from '@atlaskit/editor-plugins/loom';
import { quickInsertPlugin } from '@atlaskit/editor-plugins/quick-insert';

import { getLoomProvider } from './utils/provider/loom-provider';

function Editor() {
  const { preset } = usePreset(builder =>
    builder
      .add(basePlugin)
      .add(typeAheadPlugin)
      .add(quickInsertPlugin)
      .add(hyperlinkPlugin)
      .add([
        loomPlugin,
        getLoomProvider({
          // NOTE: DEV MOVE - A public key referencing a sandbox loom account, this will eventially be substituted
          // for a session token that will intialise the SDK.
          publicAppId: '4dc78821-b6d2-44ee-ab43-54d0494290c8',
        }),
      ]),
  );

  return <ComposableEditor appearance="full-page" preset={preset} />;
}

export default () => {
  return <Editor />;
};
