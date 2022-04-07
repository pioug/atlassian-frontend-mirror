/** @jsx jsx */
import React from 'react';
import { css, jsx } from '@emotion/react';
import { EditorView } from 'prosemirror-view';
import { createParagraphAtEnd } from '../../../commands';

const clickArea = css`
  flex-grow: 1;
`;

export interface Props {
  editorView?: EditorView;
}

export default class ClickAreaInline extends React.Component<Props> {
  private handleClick = (event: React.MouseEvent<any>) => {
    const { editorView } = this.props;
    if (editorView) {
      if (createParagraphAtEnd()(editorView.state, editorView.dispatch)) {
        editorView.focus();
        event.stopPropagation();
      }
    }
  };

  render() {
    return <div css={clickArea} onClick={this.handleClick} />;
  }
}
