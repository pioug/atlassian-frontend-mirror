import React from 'react';

import { SteppedRainbowIconDecoration } from '@atlaskit/editor-common/icons';
import { ToolbarButton } from '@atlaskit/editor-common/ui-menu';
import { ComposableEditor } from '@atlaskit/editor-core/composable-editor';
import { usePreset } from '@atlaskit/editor-core/use-preset';
import { basePlugin } from '@atlaskit/editor-plugins/base';
import { highlightPlugin } from '@atlaskit/editor-plugins/highlight';
import { textColorPlugin } from '@atlaskit/editor-plugins/text-color';
import { textFormattingPlugin } from '@atlaskit/editor-plugins/text-formatting';
import EditFilledIcon from '@atlaskit/icon/glyph/edit-filled';

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
      .add(highlightPlugin)
      .add(textColorPlugin),
  );

  const HighlightButtonExample = ({ disabled }: { disabled: boolean }) => {
    const colors = [
      '#dcdfe4',
      '#c6edfb',
      '#d3f1a7',
      '#fedec8',
      '#fdd0ec',
      '#dfd8fd',
    ];
    return (
      // eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop
      <div style={{ display: 'flex' }}>
        <ToolbarButton
          disabled={disabled}
          iconBefore={
            <SteppedRainbowIconDecoration
              selectedColor={null}
              disabled={disabled}
              icon={<EditFilledIcon size="small" label="" />}
            />
          }
        />
        {colors.map((color, index) => (
          <ToolbarButton
            key={index}
            disabled={disabled}
            iconBefore={
              <SteppedRainbowIconDecoration
                disabled={disabled}
                selectedColor={color}
                icon={<EditFilledIcon size="small" label="" />}
              />
            }
          />
        ))}
      </div>
    );
  };

  return (
    <>
      <div
        // eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop
        style={{ border: 'dashed 1px #CCC', padding: '10px', margin: '10px' }}
      >
        <h5>Editor highlight icon</h5>
        <HighlightButtonExample disabled={false} />
        <HighlightButtonExample disabled={true} />
      </div>
      <ComposableEditor
        appearance="full-page"
        preset={preset}
        defaultValue={highlightAdfDoc}
      />
    </>
  );
};

export default Editor;
