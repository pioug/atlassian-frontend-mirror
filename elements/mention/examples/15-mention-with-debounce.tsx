import React from 'react';

import {
  Editor,
  EditorProps,
  EditorContext,
  ToolbarHelp,
} from '@atlaskit/editor-core';
import { MentionResource, MentionNameDetails } from '../src/resource';
import { useEndpointMocks } from './utils/mock-endpoints';

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
    url: '/gateway',
    debounceTime: 250,
  });

  onFocus = () =>
    this.setState((prevState) => ({ isExpanded: !prevState.isExpanded }));

  render() {
    return (
      <EditorContext>
        <p>
          As you type the @mention, the list should only update 250ms after you
          have stopped typing:
        </p>
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
  useEndpointMocks();
  return <MentionEditor {...props} />;
}
