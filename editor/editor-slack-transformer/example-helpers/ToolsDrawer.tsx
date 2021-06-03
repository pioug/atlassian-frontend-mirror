import React, { useState } from 'react';

import { EditorView } from 'prosemirror-view';

import { ActivityProvider } from '@atlaskit/activity';
import { MockActivityResource } from '@atlaskit/activity/dist/es5/support';
import { MentionProvider, MentionResource } from '@atlaskit/editor-core';
import { EmojiProvider } from '@atlaskit/emoji';
import { getEmojiResource } from '@atlaskit/util-data-test/get-emoji-resource';
import { mentionResourceProvider } from '@atlaskit/util-data-test/mention-story-data';

import { SlackTransformer } from '../src';

import { Content } from './styles';

const rejectedPromise = Promise.reject(
  new Error('Simulated provider rejection'),
);
const pendingPromise = new Promise<any>(() => {});

const providers = {
  mentionProvider: {
    resolved: Promise.resolve(mentionResourceProvider),
    'resolved 2': Promise.resolve(
      new MentionResource({
        url:
          'https://pf-mentions-service.staging.atlassian.io/mentions/f7ebe2c0-0309-4687-b913-41d422f2110b',
        containerId: 'b0d035bd-9b98-4386-863b-07286c34dc14',
        productId: 'hipchat',
      }),
    ),
    pending: pendingPromise,
    rejected: rejectedPromise,
    undefined: undefined,
  },
  emojiProvider: {
    resolved: getEmojiResource({ uploadSupported: true }),
    pending: pendingPromise,
    rejected: rejectedPromise,
    undefined: undefined,
  },
  activityProvider: {
    resolved: new MockActivityResource(),
    pending: pendingPromise,
    rejected: rejectedPromise,
    undefined: undefined,
  },
};
rejectedPromise.catch(() => {});

export interface State {
  reloadEditor: boolean;
  editorEnabled: boolean;
  mentionProvider: 'resolved' | 'pending' | 'rejected' | 'undefined';
  emojiProvider: 'resolved' | 'pending' | 'rejected' | 'undefined';
  activityProvider: 'resolved' | 'pending' | 'rejected' | 'undefined';
  document?: string;
}

export type Props = {
  renderEditor: (props: {
    disabled: boolean;
    mentionProvider?: Promise<MentionProvider>;
    emojiProvider?: Promise<EmojiProvider>;
    activityProvider?: Promise<ActivityProvider> | MockActivityResource;
    onChange: (view: EditorView) => void;
  }) => React.ReactChild;
};

export default function ToolsDrawer({ renderEditor }: Props) {
  const [
    {
      mentionProvider,
      emojiProvider,
      activityProvider,
      document,
      reloadEditor,
      editorEnabled,
    },
    setState,
  ] = useState<State>({
    reloadEditor: false,
    editorEnabled: true,
    mentionProvider: 'resolved',
    emojiProvider: 'resolved',
    activityProvider: 'resolved',
    document: '',
  });

  const handleChange = (editorView: EditorView) => {
    const { doc } = editorView.state;
    const document = new SlackTransformer().encode(doc);

    setState((prevState) => ({
      ...prevState,
      document,
    }));
  };

  return (
    <Content>
      <div style={{ padding: '5px 0' }}>️️️Slack Editor</div>
      {reloadEditor
        ? ''
        : renderEditor({
            disabled: !editorEnabled,
            mentionProvider: providers.mentionProvider[mentionProvider],
            emojiProvider: providers.emojiProvider[emojiProvider],
            activityProvider: providers.activityProvider[activityProvider],
            onChange: handleChange,
          })}
      <legend>Markdown output:</legend>
      <pre>{document}</pre>
    </Content>
  );
}
