import React, { useMemo } from 'react';

import { storyMediaProviderFactory } from '@atlaskit/editor-test-helpers/media-provider';
import { EventEmitter2 } from 'eventemitter2';
import { getEmojiProvider } from '@atlaskit/util-data-test/get-emoji-provider';
import { mentionResourceProvider } from '@atlaskit/util-data-test/mention-story-data';
import { ConfluenceCardProvider } from '@atlaskit/editor-test-helpers/confluence-card-provider';
import { ConfluenceCardClient } from '@atlaskit/editor-test-helpers/confluence-card-client';

import Editor from './../src/editor/mobile-editor-element';
import { fetchProxy } from '../src/utils/fetch-proxy';
import { createCollabProviderFactory } from '../src/providers/collab-provider';
import { getBridge } from '../src/editor/native-to-web/bridge-initialiser';
import { useEditorConfiguration } from '../src/editor/hooks/use-editor-configuration';
import MobileEditorConfiguration from '../src/editor/editor-configuration';
import HUD from '../example-helpers/hud';
import { isCollabEnabled } from '../example-helpers/hud/collab/useCollab';
import { disableZooming } from './utils/viewport';

(window as any).messageHandler = new EventEmitter2();

function EditorWithFetchProxy() {
  const bridge = getBridge();
  const editorConfiguration = useEditorConfiguration(
    bridge,
    new MobileEditorConfiguration(
      `{ "enableQuickInsert": "true", "allowCollabProvider": ${isCollabEnabled()} }`,
    ),
  );
  const smartCardClient = useMemo(() => new ConfluenceCardClient('stg'), []);

  return (
    <>
      <Editor
        bridge={bridge}
        createCollabProvider={createCollabProviderFactory(fetchProxy)}
        cardProvider={Promise.resolve(new ConfluenceCardProvider('stg'))}
        cardClient={smartCardClient}
        emojiProvider={getEmojiProvider() as any}
        mentionProvider={Promise.resolve(mentionResourceProvider)}
        mediaProvider={storyMediaProviderFactory({
          collectionName: 'InitialCollectionForTesting',
        })}
        placeholder="Type something here"
        shouldFocus={true}
        editorConfiguration={editorConfiguration}
        locale={editorConfiguration.getLocale()}
      />
    </>
  );
}

export default class Example extends React.Component {
  componentDidMount() {
    disableZooming();
    // Set initial padding (this usually gets set by native)
    if (window.bridge) {
      window.bridge.setPadding(32, 16, 0, 16);
    }
  }

  render() {
    return (
      <>
        <HUD />
        <div id="editor">
          <EditorWithFetchProxy />
        </div>
      </>
    );
  }
}
