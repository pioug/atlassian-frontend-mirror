/** @jsx jsx */
import React from 'react';

import { jsx } from '@emotion/react';

import { ProviderFactory } from '@atlaskit/editor-common/provider-factory';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { storyContextIdentifierProviderFactory } from '@atlaskit/editor-test-helpers/context-identifier-provider';
import { ReactRenderer } from '@atlaskit/renderer';
import { token } from '@atlaskit/tokens';
import { getEmojiProvider } from '@atlaskit/util-data-test/get-emoji-provider';
import { mentionResourceProvider } from '@atlaskit/util-data-test/mention-story-data';
import { getMockTaskDecisionResource } from '@atlaskit/util-data-test/task-decision-story-data';

import { toJSON } from '../src/utils';

import { content } from './styles';

const emojiProvider = getEmojiProvider({
  uploadSupported: true,
});
const mentionProvider = Promise.resolve(mentionResourceProvider);
const taskDecisionProvider = Promise.resolve(getMockTaskDecisionResource());
const contextIdentifierProvider = storyContextIdentifierProviderFactory();

export interface State {
  reloadEditor: boolean;
  jsonDocument?: string;
}

export default class ToolsDrawer extends React.Component<any, State> {
  private providerFactory: ProviderFactory;

  constructor(props: any) {
    super(props);

    this.providerFactory = new ProviderFactory();
    this.providerFactory.setProvider('emojiProvider', emojiProvider);
    this.providerFactory.setProvider('mentionProvider', mentionProvider);
    this.providerFactory.setProvider(
      'taskDecisionProvider',
      taskDecisionProvider,
    );
    this.providerFactory.setProvider(
      'contextIdentifierProvider',
      contextIdentifierProvider,
    );

    this.state = {
      reloadEditor: false,
      jsonDocument: '{}',
    };
  }

  private onChange = (editorView: EditorView) => {
    this.setState({
      jsonDocument: JSON.stringify(toJSON(editorView.state.doc), null, 2),
    });
  };

  private renderRenderer(doc: string = '') {
    try {
      const props: any = {
        document: JSON.parse(doc),
        dataProviders: this.providerFactory,
        appearance: 'comment',
      };
      return (
        <div>
          <div
            // eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
            style={{ color: '#ccc', marginBottom: token('space.100', '8px') }}
          >
            &lt;Renderer&gt;
          </div>
          <ReactRenderer {...props} />
          {/* eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage */}
          <div style={{ color: '#ccc', marginTop: token('space.100', '8px') }}>
            &lt;/Renderer&gt;
          </div>
        </div>
      );
    } catch (ex) {
      return (
        <pre>
          Invalid document: {ex instanceof Error ? ex.stack : String(ex)}
        </pre>
      );
    }
  }

  render() {
    const { reloadEditor, jsonDocument } = this.state;
    return (
      <div css={content}>
        {reloadEditor
          ? ''
          : this.props.renderEditor({
              onChange: this.onChange,
              emojiProvider,
              mentionProvider,
              taskDecisionProvider,
              contextIdentifierProvider,
            })}
        <legend>Renderer:</legend>
        {this.renderRenderer(jsonDocument)}
      </div>
    );
  }
}
