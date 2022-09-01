/** @jsx jsx */
import React from 'react';
import { css, jsx } from '@emotion/react';
import { EditorView } from 'prosemirror-view';
import { clickAreaClickHandler } from '../click-area-helper';

const clickWrapper = css`
  flex-grow: 1;
  height: 100%;
`;

export interface Props {
  editorView?: EditorView;
  children?: any;
  editorDisabled?: boolean;
}

export default class ClickAreaBlock extends React.Component<Props> {
  private handleClick = (event: React.MouseEvent<any>) => {
    const { editorView: view, editorDisabled } = this.props;
    if (!view) {
      return;
    }

    if (!editorDisabled) {
      // if the editor is disabled -- we don't want to intercept any click events
      clickAreaClickHandler(view, event);
    }
  };

  render() {
    return (
      <div
        data-testid="click-wrapper"
        css={clickWrapper}
        onClick={this.handleClick}
      >
        {this.props.children}
      </div>
    );
  }
}
