import React from 'react';
import { HTMLAttributes, ComponentClass } from 'react';
import styled from 'styled-components';
import { EditorView } from 'prosemirror-view';
import { createParagraphAtEnd } from '../../../commands';
import { setCursorForTopLevelBlocks } from '../../../plugins/gap-cursor';
import { closestElement } from '../../../utils/dom';

const ClickWrapper: ComponentClass<HTMLAttributes<{}>> = styled.div`
  flex-grow: 1;
  height: 100%;
`;
ClickWrapper.displayName = 'ClickWrapper';

export interface Props {
  editorView?: EditorView;
  children?: any;
}

// we ignore all of the clicks made inside <div class="ak-editor-content-area" /> (but not clicks on the node itself)
const insideContentArea = (ref: HTMLElement | null): boolean => {
  while (ref) {
    if (ref.classList && ref.classList.contains('ak-editor-content-area')) {
      return true;
    }
    ref = ref.parentNode as HTMLElement;
  }
  return false;
};

export default class ClickAreaBlock extends React.Component<Props> {
  private handleClick = (event: React.MouseEvent<any>) => {
    const { editorView: view } = this.props;
    const contentArea = event.currentTarget.querySelector(
      '.ak-editor-content-area',
    );
    const editorFocused = !!(view && view.hasFocus());
    const target = event.target as HTMLElement;

    // @see https://product-fabric.atlassian.net/browse/ED-4287
    // click event gets triggered twice on a checkbox (on <label> first and then on <input>)
    // by the time it gets triggered on input, PM already re-renders nodeView and detaches it from DOM
    // which doesn't pass the check !contentArea.contains(event.target)
    const isInputClicked = target.nodeName === 'INPUT';
    // @see ED-5126
    const isPopupClicked = !!closestElement(target, '[data-editor-popup]');
    // Fixes issue when using a textarea for editor title in full page editor doesn't let user focus it.
    const isTextAreaClicked = target.nodeName === 'TEXTAREA';
    if (
      (!contentArea ||
        !insideContentArea(target.parentNode as HTMLElement | null) ||
        editorFocused === false) &&
      !isInputClicked &&
      !isTextAreaClicked &&
      !isPopupClicked &&
      view
    ) {
      const { dispatch, dom } = view;
      const bottomAreaClicked =
        event.clientY > dom.getBoundingClientRect().bottom;
      const isParagraphAppended = bottomAreaClicked
        ? createParagraphAtEnd()(view.state, dispatch)
        : false;
      const isGapCursorSet = setCursorForTopLevelBlocks(
        event,
        dom as HTMLElement,
        view.posAtCoords.bind(view),
        editorFocused,
      )(view.state, dispatch);

      if (isParagraphAppended || isGapCursorSet) {
        view.focus();
        event.stopPropagation();
      }
    }
  };

  render() {
    return (
      <ClickWrapper onClick={this.handleClick}>
        {this.props.children}
      </ClickWrapper>
    );
  }
}
