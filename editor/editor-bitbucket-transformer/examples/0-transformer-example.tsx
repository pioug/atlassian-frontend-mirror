/**
 * See this example in action at
 * https://atlaskit.atlassian.com/examples/editor/editor-bitbucket-transformer/transformer-example
 */

/** @jsx jsx */
import { css, jsx } from '@emotion/react';
/* eslint-disable no-console */
import React from 'react';
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
import exampleBitbucketHTML from './helpers/exampleHTML';

const container = css`
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
      <div css={container}>
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
              featureFlags={{
                'restart-numbered-lists': true,
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
      </div>
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
