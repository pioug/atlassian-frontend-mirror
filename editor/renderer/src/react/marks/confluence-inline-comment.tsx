import React from 'react';
import { Component } from 'react';

export interface Props {
  reference: string;
}

export default class ConfluenceInlineComment extends Component<Props, {}> {
  render() {
    const { reference, children } = this.props;
    return (
      <span data-mark-type="confluenceInlineComment" data-reference={reference}>
        {children}
      </span>
    );
  }
}
