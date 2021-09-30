import React from 'react';

import {
  Editor,
  EditorProps,
  EditorContext,
  ToolbarHelp,
} from '@atlaskit/editor-core';
import { MentionResource, MentionNameDetails } from '../src/resource';

export type Props = {
  editorProps?: EditorProps;
  replacementDoc?: any;
};

export type State = {
  isExpanded?: boolean;
  defaultValue?: Node | string | Object;
};

export class MentionEditor extends React.Component<Props, State> {
  mentionNames: Map<string, MentionNameDetails> = new Map();

  state = {
    defaultValue: 'dasdasdsa',
  };

  // Create a provider by instantiating an AbstractMentionResource
  mentionResourceProvider = new MentionResource({
    url: '/fake-api', //cannot call stargate currently from AK
    debounceTime: 250,
  });

  onFocus = () =>
    this.setState((prevState) => ({ isExpanded: !prevState.isExpanded }));

  render() {
    return (
      <EditorContext>
        <span>
          Please note that suggested mentions currently does not get displayed
          as we are waiting on a valid endpoint to call from AK. The purpose of
          this demo is to test debouncing of calls in the network tab.
        </span>
        <Editor
          appearance="comment"
          shouldFocus={true}
          disabled={false}
          mentionProvider={Promise.resolve(this.mentionResourceProvider)} // Plug in your Mentions provider
          allowPanel={true}
          primaryToolbarComponents={[
            <ToolbarHelp titlePosition="top" title="Help" key="help" />,
          ]}
        />
      </EditorContext>
    );
  }
}

export default function MentionEditorExample(props?: Props) {
  return <MentionEditor {...props} />;
}
