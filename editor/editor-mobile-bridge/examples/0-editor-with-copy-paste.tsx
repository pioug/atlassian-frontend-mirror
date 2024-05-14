// TODO: https://product-fabric.atlassian.net/browse/DSP-4044
/** @jsx jsx */
import { css, jsx } from '@emotion/react';
import React from 'react';
import CopyIcon from '@atlaskit/icon/glyph/copy';
import { token } from '@atlaskit/tokens';
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
import { fetchProxy } from '../src/utils/fetch-proxy';
import { createCollabProviderFactory } from '../src/providers/collab-provider';
import { getBridge } from '../src/editor/native-to-web/bridge-initialiser';
import { useEditorConfiguration } from '../src/editor/hooks/use-editor-configuration';

export const wrapper: any = css({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  height: '100%',
  width: '100%',
  boxSizing: 'border-box',
});

export const toolbar = css({
  borderBottom: `1px dashed ${token('color.border.disabled', N50)}`,
  padding: token('space.200', '16px'),
});

export const clipboardZone: any = css({
  maxWidth: '500px',
  display: 'flex',
  flexFlow: 'row',
  alignItems: 'center',
});

export const copyWrapper: any = css({
  border: 'none',
  background: 'none',
});

window.logBridge = window.logBridge || [];

function EditorWithFetchProxy() {
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
      <div css={wrapper}>
        <div css={toolbar}>
          <div css={clipboardZone}>
            <p>Copy to clipboard:</p>
            <TextArea
              data-id="clipboardInput"
              isCompact
              resize="smart"
              ref={(ref: HTMLTextAreaElement | null) =>
                (this.textAreaRef = ref)
              }
            />
            <button
              css={copyWrapper}
              aria-label="copy"
              onClick={this.copyToClipboard}
            >
              <CopyIcon label="copy-icon" />
            </button>
          </div>
        </div>
        <EditorWithFetchProxy />
      </div>
    );
  }
}
