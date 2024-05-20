import React from 'react';

import { ComposableEditor } from '@atlaskit/editor-core/composable-editor';
import { usePreset } from '@atlaskit/editor-core/use-preset';
import { analyticsPlugin } from '@atlaskit/editor-plugins/analytics';
import { basePlugin } from '@atlaskit/editor-plugins/base';
import { contentInsertionPlugin } from '@atlaskit/editor-plugins/content-insertion';
import { guidelinePlugin } from '@atlaskit/editor-plugins/guideline';
import { highlightPlugin } from '@atlaskit/editor-plugins/highlight';
import { historyPlugin } from '@atlaskit/editor-plugins/history';
import { insertBlockPlugin } from '@atlaskit/editor-plugins/insert-block';
import { quickInsertPlugin } from '@atlaskit/editor-plugins/quick-insert';
import { selectionPlugin } from '@atlaskit/editor-plugins/selection';
import { statusPlugin } from '@atlaskit/editor-plugins/status';
import {
  type TablePluginOptions,
  tablesPlugin,
} from '@atlaskit/editor-plugins/table';
import { textColorPlugin } from '@atlaskit/editor-plugins/text-color';
import { textFormattingPlugin } from '@atlaskit/editor-plugins/text-formatting';
import { typeAheadPlugin } from '@atlaskit/editor-plugins/type-ahead';
import { undoRedoPlugin } from '@atlaskit/editor-plugins/undo-redo';
import { widthPlugin } from '@atlaskit/editor-plugins/width';

const highlightAdfDoc = {
  type: 'doc',
  version: 1,
  content: [
    {
      type: 'paragraph',
      content: [
        {
          text: 'Highlights: ',
          type: 'text',
        },
        {
          text: 'Light Gray',
          type: 'text',
          marks: [{ type: 'backgroundColor', attrs: { color: '#dcdfe4' } }],
        },
        { text: ', ', type: 'text' },
        {
          text: 'Light Teal',
          type: 'text',
          marks: [{ type: 'backgroundColor', attrs: { color: '#c6edfb' } }],
        },
        { text: ', ', type: 'text' },
        {
          text: 'Light Lime',
          type: 'text',
          marks: [{ type: 'backgroundColor', attrs: { color: '#d3f1a7' } }],
        },
        { text: ', ', type: 'text' },
        {
          text: 'Light Orange',
          type: 'text',
          marks: [{ type: 'backgroundColor', attrs: { color: '#fedec8' } }],
        },
        { text: ', ', type: 'text' },
        {
          text: 'Light Magenta',
          type: 'text',
          marks: [{ type: 'backgroundColor', attrs: { color: '#fdd0ec' } }],
        },
        { text: ', ', type: 'text' },
        {
          text: 'Light Purple',
          type: 'text',
          marks: [{ type: 'backgroundColor', attrs: { color: '#dfd8fd' } }],
        },
        { text: ', ', type: 'text' },
        {
          text: 'Custom: black',
          type: 'text',
          marks: [{ type: 'backgroundColor', attrs: { color: '#000000' } }],
        },
        { text: ', ', type: 'text' },
        {
          text: 'Custom: white',
          type: 'text',
          marks: [{ type: 'backgroundColor', attrs: { color: '#ffffff' } }],
        },
        { text: ', ', type: 'text' },
        {
          text: 'Custom: red',
          type: 'text',
          marks: [{ type: 'backgroundColor', attrs: { color: '#c9372c' } }],
        },
        { text: ', ', type: 'text' },
        {
          text: 'Custom: yellow',
          type: 'text',
          marks: [{ type: 'backgroundColor', attrs: { color: '#f8e6a0' } }],
        },
        {
          text: ', No highlight',
          type: 'text',
        },
      ],
    },
  ],
};

const Editor = () => {
  const tableOptions = {
    tableOptions: {
      advanced: true,
      allowNumberColumn: true,
      allowHeaderRow: true,
      allowHeaderColumn: true,
      permittedLayouts: 'all',
    },
    allowContextualMenu: true,
  } as TablePluginOptions;

  const { preset } = usePreset(builder =>
    builder
      .add(basePlugin)
      .add(historyPlugin)
      .add([analyticsPlugin, {}])
      .add(typeAheadPlugin)
      .add(undoRedoPlugin)
      .add(textFormattingPlugin)
      .add(textColorPlugin)
      .add(highlightPlugin)
      .add(statusPlugin)
      .add(contentInsertionPlugin)
      .add(widthPlugin)
      .add(guidelinePlugin)
      .add(selectionPlugin)
      .add(quickInsertPlugin)
      .add([tablesPlugin, tableOptions])
      .add([
        insertBlockPlugin,
        {
          allowTables: true,
          allowExpand: true,
          tableSelectorSupported: true,
        },
      ]),
  );

  return (
    <ComposableEditor
      appearance="full-page"
      preset={preset}
      defaultValue={highlightAdfDoc}
    />
  );
};

export default Editor;
