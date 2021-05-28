import React from 'react';
import styled from 'styled-components';
import CopyIcon from '@atlaskit/icon/glyph/copy';
import TextArea from '@atlaskit/textarea';
import { N50 } from '@atlaskit/theme/colors';
import { disableZooming } from './utils/viewport';
import {
  createCardClient,
  createEmojiProvider,
  createMentionProvider,
} from '../src/providers';

import { cardProvider } from '@atlaskit/editor-test-helpers/card-provider';
import { storyMediaProviderFactory } from '@atlaskit/editor-test-helpers/media-provider';

import Editor from './../src/editor/mobile-editor-element';
import { useFetchProxy } from '../src/utils/fetch-proxy';
import { createCollabProviderFactory } from '../src/providers/collab-provider';
import { getBridge } from '../src/editor/native-to-web/bridge-initialiser';
import { useEditorConfiguration } from '../src/editor/hooks/use-editor-configuration';

export const Wrapper: any = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  height: 100%;
  width: 100%;
  box-sizing: border-box;
`;

export const Toolbar: any = styled.div`
  border-bottom: 1px dashed ${N50};
  padding: 1em;
`;

export const ClipboardZone: any = styled.div`
  max-width: 500px;
  display: flex;
  flex-flow: row;
  align-items: center;
`;

export const CopyWrapper: any = styled.button`
  border: none;
  background: none;
`;

Wrapper.displayName = 'Wrapper';

window.logBridge = window.logBridge || [];

function EditorWithFetchProxy() {
  const fetchProxy = useFetchProxy();
  const bridge = getBridge();
  const editorConfiguration = useEditorConfiguration(bridge);

  return (
    <Editor
      bridge={bridge}
      createCollabProvider={createCollabProviderFactory(fetchProxy)}
      cardProvider={Promise.resolve(cardProvider)}
      cardClient={createCardClient()}
      emojiProvider={createEmojiProvider(fetchProxy)}
      mentionProvider={createMentionProvider()}
      mediaProvider={storyMediaProviderFactory({
        collectionName: 'InitialCollectionForTesting',
        includeUserAuthProvider: false,
      })}
      placeholder="Type something here"
      editorConfiguration={editorConfiguration}
      locale={editorConfiguration.getLocale()}
    />
  );
}

export default class Example extends React.Component {
  private textAreaRef?: HTMLTextAreaElement | null;

  componentDidMount() {
    disableZooming();
  }

  copyToClipboard = () => {
    if (!this.textAreaRef) {
      return;
    }
    this.textAreaRef.select();
    document.execCommand('copy');
  };

  render() {
    return (
      <Wrapper>
        <Toolbar>
          <ClipboardZone>
            <p>Copy to clipboard:</p>
            <TextArea
              data-id="clipboardInput"
              isCompact
              resize="smart"
              ref={(ref: HTMLTextAreaElement | null) =>
                (this.textAreaRef = ref)
              }
            />
            <CopyWrapper aria-label="copy" onClick={this.copyToClipboard}>
              <CopyIcon label="copy-icon" />
            </CopyWrapper>
          </ClipboardZone>
        </Toolbar>
        <EditorWithFetchProxy />
      </Wrapper>
    );
  }
}
