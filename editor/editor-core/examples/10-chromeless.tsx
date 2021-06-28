/* eslint-disable no-console */

import React from 'react';
import ButtonGroup from '@atlaskit/button/button-group';
import Button from '@atlaskit/button/standard-button';
import Editor from '../src/editor';
import EditorContext from '../src/ui/EditorContext';
import WithEditorActions from '../src/ui/WithEditorActions';
import ToolsDrawer from '../example-helpers/ToolsDrawer';

const SAVE_ACTION = () => console.log('Save');

const exampleDocument = {
  version: 1,
  type: 'doc',
  content: [
    {
      type: 'paragraph',
      content: [
        { type: 'text', text: 'Some example document with emojis ' },
        {
          type: 'emoji',
          attrs: {
            shortName: ':catchemall:',
            id: 'atlassian-catchemall',
            text: ':catchemall:',
          },
        },
        { type: 'text', text: ' and mentions ' },
        {
          type: 'mention',
          attrs: { id: '0', text: '@Carolyn', accessLevel: '' },
        },
        { type: 'text', text: '. ' },
      ],
    },
  ],
};

export default function Example() {
  return (
    <EditorContext>
      <div>
        <WithEditorActions
          render={(actions) => (
            <ButtonGroup>
              <Button onClick={() => actions.replaceDocument(exampleDocument)}>
                Load Document
              </Button>
              <Button onClick={() => actions.clear()}>Clear</Button>
            </ButtonGroup>
          )}
        />
        <ToolsDrawer
          renderEditor={({
            disabled,
            mentionProvider,
            emojiProvider,
            mediaProvider,
            taskDecisionProvider,
            contextIdentifierProvider,
            onChange,
          }: any) => (
            <Editor
              appearance="chromeless"
              allowAnalyticsGASV3={true}
              disabled={disabled}
              shouldFocus={true}
              saveOnEnter={true}
              mentionProvider={mentionProvider}
              emojiProvider={emojiProvider}
              taskDecisionProvider={taskDecisionProvider}
              contextIdentifierProvider={contextIdentifierProvider}
              media={{ provider: mediaProvider }}
              onChange={onChange}
              onSave={SAVE_ACTION}
              quickInsert={true}
            />
          )}
        />
      </div>
    </EditorContext>
  );
}
