import React from 'react';

import { ComposableEditor } from '@atlaskit/editor-core/composable-editor';
import { EditorPresetBuilder } from '@atlaskit/editor-core/preset-builder';
import { usePreset } from '@atlaskit/editor-core/use-preset';
import { basePlugin } from '@atlaskit/editor-plugins/base';
import { blockTypePlugin } from '@atlaskit/editor-plugins/block-type';
import { focusPlugin } from '@atlaskit/editor-plugins/focus';
import { quickInsertPlugin } from '@atlaskit/editor-plugins/quick-insert';
import { selectionMarkerPlugin } from '@atlaskit/editor-plugins/selection-marker';
import { typeAheadPlugin } from '@atlaskit/editor-plugins/type-ahead';

export default function Editor() {
  const { preset } = usePreset(() =>
    new EditorPresetBuilder()
      .add(basePlugin)
      .add(blockTypePlugin)
      .add(focusPlugin)
      .add(typeAheadPlugin)
      .add(quickInsertPlugin)
      .add(selectionMarkerPlugin),
  );

  return <ComposableEditor preset={preset} />;
}
