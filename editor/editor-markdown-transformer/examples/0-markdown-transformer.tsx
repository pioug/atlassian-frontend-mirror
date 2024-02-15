/** @jsx jsx */
import React from 'react';
import { css, jsx } from '@emotion/react';
import {
  Editor,
  EditorContext,
  WithEditorActions,
} from '@atlaskit/editor-core';
import { getMockTaskDecisionResource } from '@atlaskit/util-data-test/task-decision-story-data';
import { MarkdownTransformer } from '../src';
import exampleMarkdown from '../example-helpers/exampleMarkdown';

const container = css`
  display: grid;
  grid-template-columns: 50% 50%;

  #source {
    border: 2px solid;
    margin: 8px;
    padding: 8px;
    white-space: pre-wrap;
    font-size: xx-small;
    &:focus {
      outline: none;
    }
    &:empty:not(:focus)::before {
      content: attr(data-placeholder);
      font-size: 14px;
    }
  }
`;

type Props = { actions: any };
type State = { source: string };

class Example extends React.PureComponent<Props, State> {
  state: State = { source: exampleMarkdown };

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

  render() {
    return (
      <div css={container}>
        <div
          id="source"
          contentEditable={true}
          data-placeholder="Enter Markdown to convert"
          onInput={this.handleUpdateToSource}
        >
          {exampleMarkdown}
        </div>
        <Editor
          appearance="comment"
          allowRule={true}
          allowTables={true}
          media={{
            allowMediaSingle: true,
          }}
          contentTransformerProvider={(schema) =>
            new MarkdownTransformer(schema)
          }
          taskDecisionProvider={Promise.resolve(getMockTaskDecisionResource())}
        />
      </div>
    );
  }
}

export default () => (
  <EditorContext>
    <WithEditorActions render={(actions) => <Example actions={actions} />} />
  </EditorContext>
);
