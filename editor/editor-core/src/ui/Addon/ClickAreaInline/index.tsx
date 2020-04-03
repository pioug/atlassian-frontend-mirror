import React from 'react';
import styled from 'styled-components';
import { EditorView } from 'prosemirror-view';
import { createParagraphAtEnd } from '../../../commands';

const ClickArea: any = styled.div`
  flex-grow: 1;
`;
ClickArea.displayName = 'ClickArea';

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
    return <ClickArea onClick={this.handleClick} />;
  }
}
