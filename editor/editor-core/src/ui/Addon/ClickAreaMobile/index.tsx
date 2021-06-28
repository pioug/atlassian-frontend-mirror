import React from 'react';
import styled from 'styled-components';
import { EditorView } from 'prosemirror-view';
import { clickAreaClickHandler } from '../click-area-helper';

/**
 * Fills the visible viewport height so that it can filter
 * clicks/taps within or below the content (e.g. if the content
 * doesn't exceed the viewport, or whether it overflows it).
 */
const ClickWrapper = styled.div<{
  minHeight: number;
  persistScrollGutter?: boolean;
}>`
  height: 100%;
  ${(props) =>
    props.persistScrollGutter !== true && `min-height: ${props.minHeight}vh`}
`;
ClickWrapper.displayName = 'ClickWrapper';

export interface Props {
  editorView?: EditorView;
  minHeight: number;
  children?: any;
  persistScrollGutter?: boolean;
}

/**
 * Click Area is responsible for improving UX by ensuring the user
 * can always tap beneath the content area, to insert more content.
 *
 * This is achieved by inserting a new empty paragraph at the end of
 * the document (if one doesn't already exist).
 *
 * This is particularly important when the content exceeds the visible
 * viewport height, and if the last content node captures text selection
 * e.g. table, layouts, codeblock, etc.
 *
 * This relies on the Scroll Gutter plugin which inserts additional
 * whitespace at the end of the document when it overflows the viewport.
 */
export default class ClickAreaMobile extends React.Component<Props> {
  private clickElementRef = React.createRef<HTMLElement>();

  private handleClick = (event: React.MouseEvent<any>) => {
    const { editorView: view } = this.props;
    if (!view) {
      return;
    }
    clickAreaClickHandler(view, event);
    const scrollGutterClicked =
      event.clientY > view.dom.getBoundingClientRect().bottom;
    // Reset the default prosemirror scrollIntoView logic by
    // clamping the scroll position to the bottom of the viewport.
    if (scrollGutterClicked) {
      event.preventDefault();
      if (this.clickElementRef.current) {
        this.clickElementRef.current.scrollIntoView(false);
      }
    }
  };

  render() {
    return (
      <ClickWrapper
        className="editor-click-wrapper"
        minHeight={this.props.minHeight}
        persistScrollGutter={this.props.persistScrollGutter}
        onClick={this.handleClick}
        innerRef={this.clickElementRef}
      >
        {this.props.children}
      </ClickWrapper>
    );
  }
}
