import React from 'react';
import { mentionResourceProvider } from '@atlaskit/util-data-test/mention-story-data';
import { Editor } from '../../../index';
import gapcursor from '../../visual-regression/common/__fixtures__/gap-cursor-adf.json';
import gapcursorLayout from '../../visual-regression/common/__fixtures__/gap-cursor-layout-adf.json';

export function EditorGapCursorDefault() {
  return (
    <Editor
      defaultValue={gapcursor}
      allowTables={{ advanced: true }}
      allowPanel
      appearance="full-page"
    />
  );
}

export function EditorGapCursorLayout() {
  return (
    <Editor
      appearance="full-page"
      defaultValue={gapcursorLayout}
      allowLayouts
      allowPanel
      allowRule
      allowStatus
      allowTables={{ advanced: true }}
      allowTasksAndDecisions
      mentionProvider={Promise.resolve(mentionResourceProvider)}
    />
  );
}
