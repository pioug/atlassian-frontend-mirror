/* eslint-disable no-console */
import React from 'react';
import styled from 'styled-components';
import {
  Editor,
  EditorContext,
  WithEditorActions,
} from '@atlaskit/editor-core';
import { mentionResourceProvider } from '@atlaskit/util-data-test/mention-story-data';
import { getEmojiResource } from '@atlaskit/util-data-test/get-emoji-resource';
import { getMockTaskDecisionResource } from '@atlaskit/util-data-test/task-decision-story-data';
import { JIRATransformer } from '../src';

const Container = styled.div`
  display: grid;
  grid-template-columns: 33% 33% 33%;
  #source,
  #output {
    border: 2px solid;
    margin: 8px;
    padding: 8px;
    white-space: pre-wrap;
    &:focus {
      outline: none;
    }
    &:empty:not(:focus)::before {
      content: attr(data-placeholder);
      font-size: 14px;
    }
  }
  #source {
    font-size: xx-small;
  }
`;

const emojiProvider = getEmojiResource();
const mentionProvider = Promise.resolve(mentionResourceProvider);
const mentionEncoder = (userId: string) => `/secure/ViewProfile?name=${userId}`;

type Props = { actions: any };
type State = { source: string; output: string };
class TransformerPanels extends React.PureComponent<Props, State> {
  state: State = { source: '', output: '' };

  componentDidMount() {
    window.setTimeout(() => {
      this.props.actions.replaceDocument(this.state.source);
    });
  }

  handleUpdateToSource = (e: React.FormEvent<HTMLDivElement>) => {
    const value = e.currentTarget.innerText;
    this.setState({ source: value }, () =>
      this.props.actions.replaceDocument(value),
    );
  };

  handleChangeInTheEditor = async () => {
    const value = await this.props.actions.getValue();
    this.setState({ output: value });
  };

  render() {
    return (
      <Container>
        <div
          id="source"
          contentEditable={true}
          data-placeholder="Enter HTML to convert"
          onInput={this.handleUpdateToSource}
        />
        <div id="editor">
          <Editor
            appearance="comment"
            allowRule={true}
            allowTables={true}
            emojiProvider={emojiProvider}
            mentionProvider={mentionProvider}
            contentTransformerProvider={(schema) =>
              new JIRATransformer(schema, { mention: mentionEncoder })
            }
            onChange={this.handleChangeInTheEditor}
            taskDecisionProvider={Promise.resolve(
              getMockTaskDecisionResource(),
            )}
          />
        </div>
        <div
          id="output"
          data-placeholder="This is an empty document (or something has gone really wrong)"
        >
          {this.state.output}
        </div>
      </Container>
    );
  }
}

export default () => (
  <EditorContext>
    <WithEditorActions
      render={(actions) => <TransformerPanels actions={actions} />}
    />
  </EditorContext>
);
