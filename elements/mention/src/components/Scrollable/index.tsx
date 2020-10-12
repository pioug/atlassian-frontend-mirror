import React from 'react';
import { findDOMNode } from 'react-dom';
import MentionItem from '../MentionItem';
import { ScrollableStyle } from './styles';

export interface Props {
  children?: React.ReactNode | React.ReactNode[];
}

export default class Scrollable extends React.PureComponent<Props, {}> {
  private scrollableDiv?: HTMLDivElement | null;

  // API
  reveal = (child: MentionItem) => {
    if (child && this.scrollableDiv) {
      const childNode = findDOMNode(child) as Element;
      // Not using Element.scrollIntoView as it scrolls even to top/bottom of view even if
      // already visible
      const scrollableRect = this.scrollableDiv.getBoundingClientRect();
      const elementRect = childNode.getBoundingClientRect();
      if (elementRect.top < scrollableRect.top) {
        this.scrollableDiv.scrollTop += elementRect.top - scrollableRect.top;
      } else if (elementRect.bottom > scrollableRect.bottom) {
        this.scrollableDiv.scrollTop +=
          elementRect.bottom - scrollableRect.bottom;
      }
    }
  };

  private handleRef = (ref: HTMLDivElement | null) => {
    this.scrollableDiv = ref;
  };

  render() {
    return (
      <ScrollableStyle innerRef={this.handleRef}>
        {this.props.children}
      </ScrollableStyle>
    );
  }
}
