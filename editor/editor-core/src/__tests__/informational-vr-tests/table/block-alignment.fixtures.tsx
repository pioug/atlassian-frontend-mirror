import React from 'react';
import { Editor } from '../../../index';
import adf from '../../visual-regression/table/__fixtures__/table-with-blocks.adf.json';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import mockEmojiProvider from '@atlaskit/editor-mobile-bridge/src/providers/mockEmojiProvider';
import { mentionResourceProvider } from '@atlaskit/util-data-test/mention-story-data';

export function EditorWithAdf() {
  return (
    <Editor
      defaultValue={adf}
      allowPanel
      allowTasksAndDecisions
      appearance="comment"
      allowStatus
      allowTables={{ advanced: true }}
      emojiProvider={Promise.resolve(mockEmojiProvider)}
      mentionProvider={Promise.resolve(mentionResourceProvider)}
    />
  );
}
