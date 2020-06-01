import React from 'react';
import { Component } from 'react';
import { MarkProps } from '../types';

export interface Props {
  reference: string;
}

export default class ConfluenceInlineComment extends Component<
  MarkProps<Props>,
  {}
> {
  render() {
    const { reference, children } = this.props;
    return (
      <span data-mark-type="confluenceInlineComment" data-reference={reference}>
        {children}
      </span>
    );
  }
}
