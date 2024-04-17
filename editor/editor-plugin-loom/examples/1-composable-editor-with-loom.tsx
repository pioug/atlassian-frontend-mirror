import React from 'react';

import { EditorPresetBuilder } from '@atlaskit/editor-common/preset';
import { ComposableEditor } from '@atlaskit/editor-core/composable-editor';
import { usePreset } from '@atlaskit/editor-core/use-preset';
import { hyperlinkPlugin } from '@atlaskit/editor-plugin-hyperlink';
import { typeAheadPlugin } from '@atlaskit/editor-plugin-type-ahead';
import { basePlugin } from '@atlaskit/editor-plugins/base';
import { loomPlugin } from '@atlaskit/editor-plugins/loom';
import { quickInsertPlugin } from '@atlaskit/editor-plugins/quick-insert';

import { getLoomProvider } from './utils/provider/loom-provider';

function Editor() {
  const { preset } = usePreset(() =>
    new EditorPresetBuilder()
      .add(basePlugin)
      .add(typeAheadPlugin)
      .add(quickInsertPlugin)
      .add(hyperlinkPlugin)
      .add([
        loomPlugin,
        getLoomProvider({
          // NOTE: DEV MOVE - A public key referencing a sandbox loom account, this will eventially be substituted
          // for a session token that will intialise the SDK.
          publicAppId: 'e1cff63a-8ca2-4c2c-ad41-d61c54beb16a',
        }),
      ]),
  );

  return <ComposableEditor appearance="full-page" preset={preset} />;
}

export default () => {
  return <Editor />;
};
