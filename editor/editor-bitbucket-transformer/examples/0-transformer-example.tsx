/* eslint-disable no-console */
import React from 'react';
import styled from 'styled-components';
import {
  Editor,
  EditorContext,
  WithEditorActions,
} from '@atlaskit/editor-core';
import { mentionResourceProvider } from '@atlaskit/util-data-test/mention-story-data';
import { getMockTaskDecisionResource } from '@atlaskit/util-data-test/task-decision-story-data';
import { Provider as SmartCardProvider } from '@atlaskit/smart-card';
import { ConfluenceCardClient } from '@atlaskit/editor-test-helpers/confluence-card-client';
import { ConfluenceCardProvider } from '@atlaskit/editor-test-helpers/confluence-card-provider';
import imageUploadHandler from '@atlaskit/editor-core/example-helpers/imageUpload';
import { BitbucketTransformer } from '../src';
import exampleBitbucketHTML from '../example-helpers/exampleHTML';

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

type Props = { actions: any };
type State = { source: string; output: string };

const smartCardClient = new ConfluenceCardClient('staging');

class TransformerPanels extends React.PureComponent<Props, State> {
  state: State = { source: exampleBitbucketHTML, output: '' };
  private cardProviderPromise = Promise.resolve(
    new ConfluenceCardProvider('prod'),
  );

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
        >
          {exampleBitbucketHTML}
        </div>
        <SmartCardProvider client={smartCardClient}>
          <div id="editor">
            <Editor
              appearance="comment"
              allowRule={true}
              mentionProvider={Promise.resolve(mentionResourceProvider)}
              allowTables={{ isHeaderRowRequired: true }}
              legacyImageUploadProvider={Promise.resolve(imageUploadHandler)}
              contentTransformerProvider={(schema) =>
                new BitbucketTransformer(schema)
              }
              taskDecisionProvider={Promise.resolve(
                getMockTaskDecisionResource(),
              )}
              onChange={this.handleChangeInTheEditor}
              smartLinks={{
                provider: this.cardProviderPromise,
              }}
            />
          </div>
        </SmartCardProvider>
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
