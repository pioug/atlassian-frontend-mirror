import React from 'react';

import { ComposableEditor } from '@atlaskit/editor-core/composable-editor';
import { usePreset } from '@atlaskit/editor-core/use-preset';
import { basePlugin } from '@atlaskit/editor-plugins/base';
import { highlightPlugin } from '@atlaskit/editor-plugins/highlight';
import { textColorPlugin } from '@atlaskit/editor-plugins/text-color';
import { textFormattingPlugin } from '@atlaskit/editor-plugins/text-formatting';

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
  const { preset } = usePreset(builder =>
    builder
      .add(basePlugin)
      .add(textFormattingPlugin)
      .add(textColorPlugin)
      .add(highlightPlugin),
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
