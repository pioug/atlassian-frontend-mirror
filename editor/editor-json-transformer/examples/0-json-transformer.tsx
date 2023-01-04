/** @jsx jsx */
import React from 'react';

import { css, jsx } from '@emotion/react';
import { EditorView } from 'prosemirror-view';

import { Editor } from '@atlaskit/editor-core';
import { getMockTaskDecisionResource } from '@atlaskit/util-data-test/task-decision-story-data';

import { JSONTransformer } from '../src';

const container = css`
  display: grid;
  grid-template-columns: 50% 50%;

  #output {
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

export default class Example extends React.PureComponent<
  {},
  { output: string }
> {
  state = { output: '' };
  transformer = new JSONTransformer();

  handleChangeInTheEditor = (editorView: EditorView) => {
    const output = JSON.stringify(
      this.transformer.encode(editorView.state.doc),
      null,
      2,
    );
    this.setState({ output });
  };

  render() {
    return (
      <div css={container}>
        <Editor
          appearance="comment"
          allowRule={true}
          allowTables={true}
          onChange={this.handleChangeInTheEditor}
          taskDecisionProvider={Promise.resolve(getMockTaskDecisionResource())}
          featureFlags={{
            'restart-numbered-lists': true,
          }}
        />
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
