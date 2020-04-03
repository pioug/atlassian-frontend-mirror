import React from 'react';
import styled from 'styled-components';
import { EditorView } from 'prosemirror-view';
import { createParagraphAtEnd } from '../../../commands';

/**
 * Fills the visible viewport height so that it can filter
 * clicks/taps within or below the content (e.g. if the content
 * doesn't exceed the viewport, or whether it overflows it).
 */
const ClickWrapper = styled.div`
  height: 100%;
  min-height: 100vh;
`;
ClickWrapper.displayName = 'ClickWrapper';

export interface Props {
  editorView?: EditorView;
  children?: any;
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
    if (!view) return;

    // The scroll gutter plugin's element sits beneath the editor so any clicks lower
    // than the bottom of the editor can be considered suitable for inserttion and refocusing.
    const scrollGutterClicked =
      event.clientY > view.dom.getBoundingClientRect().bottom;

    if (scrollGutterClicked) {
      event.preventDefault();
      event.stopPropagation();

      // Refocus the editor. We know it's lost focus because the click was beneath it.
      view.focus();

      // Insert an empty paragraph at the end of the document (if one doesn't already exist).
      // This allows the user to tap beneath the previously last content node.
      // It's useful if the last node captures text selection (e.g. table, layout, codeblock).
      createParagraphAtEnd()(view.state, view.dispatch);

      // Reset the default prosemirror scrollIntoView logic by
      // clamping the scroll position to the bottom of the viewport.
      if (this.clickElementRef.current)
        this.clickElementRef.current.scrollIntoView(false);
    }
  };

  render() {
    return (
      <ClickWrapper
        className="editor-click-wrapper"
        onClick={this.handleClick}
        innerRef={this.clickElementRef}
      >
        {this.props.children}
      </ClickWrapper>
    );
  }
}
