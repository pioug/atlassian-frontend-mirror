import React from 'react';
import { Editor } from '../src/index';
import EditorContext from '../src/ui/EditorContext';
import WithEditorActions from '../src/ui/WithEditorActions';
import {
  MentionDescription,
  MentionProvider,
} from '@atlaskit/mention/resource';
import { Provider as SmartCardProvider } from '@atlaskit/smart-card';
import { ConfluenceCardClient } from '@atlaskit/editor-test-helpers/confluence-card-client';
import { ConfluenceCardProvider } from '@atlaskit/editor-test-helpers/confluence-card-provider';

const cardClient = new ConfluenceCardClient('staging');
const cardProvider = new ConfluenceCardProvider('staging');

class MentionProviderImpl implements MentionProvider {
  filter(_query?: string): void {}
  recordMentionSelection(_mention: MentionDescription): void {}
  shouldHighlightMention(_mention: MentionDescription): boolean {
    return false;
  }
  isFiltering(_query: string): boolean {
    return false;
  }
  subscribe(): void {}
  unsubscribe(_key: string): void {}
}

export function mobileEditor() {
  return (
    <SmartCardProvider client={cardClient}>
      <EditorContext>
        <div>
          <WithEditorActions render={() => <div />} />
          <Editor
            appearance="mobile"
            mentionProvider={Promise.resolve(new MentionProviderImpl())}
            quickInsert={true}
            smartLinks={{
              provider: Promise.resolve(cardProvider),
              allowBlockCards: true,
            }}
          />
        </div>
      </EditorContext>
    </SmartCardProvider>
  );
}

export default function Example() {
  return (
    <div>
      <p>Editor that is used by mobile applications.</p>
      {mobileEditor()}
    </div>
  );
}
