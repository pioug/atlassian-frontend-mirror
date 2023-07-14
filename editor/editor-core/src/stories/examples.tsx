import React from 'react';

import { boolean, object, radios, withKnobs } from '@storybook/addon-knobs';
import { IntlProvider } from 'react-intl-next';

import Editor, { EditorProps } from '../editor';
import EditorContext from '../ui/EditorContext';

function WrapperEditorComponent(props: EditorProps) {
  const ChildKey = JSON.stringify(props);
  return (
    <EditorContext>
      <IntlProvider locale="en">
        <Editor key={ChildKey} {...props} />
      </IntlProvider>
    </EditorContext>
  );
}

export default {
  title: 'Editor',
  component: Editor,
  decorators: [withKnobs],
};

const groupId = 'GROUP-ID1';
const Template = (args: any) => (
  <WrapperEditorComponent
    allowUndoRedoButtons={boolean('Undo/Redo Buttons', false, groupId)}
    allowPanel={boolean('Panel', false, groupId)}
    appearance={radios(
      'Appearance',
      {
        Comment: 'comment',
        'Full Page': 'full-page',
      },
      'full-page',
      groupId,
    )}
    allowTables={object('Table Options', {}, groupId)}
    {...args}
  />
);

export const EditorExample = Template.bind({});
