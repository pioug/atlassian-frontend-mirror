import { createElement } from 'react';

import ReactDOM from 'react-dom';

import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import type { EditorState } from '@atlaskit/editor-prosemirror/state';
import { Decoration, DecorationSet } from '@atlaskit/editor-prosemirror/view';

import type { BlockControlsMeta, BlockControlsPlugin } from '../types';
import { DRAG_HANDLE_NODE_GAP, DRAG_HANDLE_WIDTH } from '../ui/consts';
import { DragHandle } from '../ui/drag-handle';
import { DropTarget } from '../ui/drop-target';

export const dropTargetDecorations = (
  oldState: EditorState,
  newState: EditorState,
  api: ExtractInjectionAPI<BlockControlsPlugin>,
) => {
  const decs: Decoration[] = [];
  // Decoration state is used to keep track of the position of the drop targets
  // and allows us to easily map the updated position in the plugin apply method.
  const decorationState: { index: number; pos: number }[] = [];
  oldState.doc.nodesBetween(
    0,
    newState.doc.nodeSize - 2,
    (_node, pos, _parent, index) => {
      decorationState.push({ index, pos });
      decs.push(
        Decoration.widget(pos, () => {
          const element = document.createElement('div');
          ReactDOM.render(
            createElement(DropTarget, {
              api,
              index,
            }),
            element,
          );
          return element;
        }),
      );
      return false;
    },
  );

  /**
   * We are adding a drop target at the end of the document because by default we
   * draw all drop targets at the top of every node. It's better to draw the drop targets
   * at the top of each node because that way we only need to know the start position of the
   * node and not its size.
   *
   */
  decorationState.push({
    index: decorationState.length + 1,
    pos: newState.doc.nodeSize - 2,
  });
  decs.push(
    Decoration.widget(newState.doc.nodeSize - 2, () => {
      const element = document.createElement('div');
      ReactDOM.render(
        createElement(DropTarget, {
          api,
          index: decorationState.length,
        }),
        element,
      );
      return element;
    }),
  );

  return { decs, decorationState };
};

export const dragHandleDecoration = (
  oldState: EditorState,
  meta: BlockControlsMeta,
  api: ExtractInjectionAPI<BlockControlsPlugin>,
) => {
  return DecorationSet.create(oldState.doc, [
    Decoration.widget(
      meta.pos,
      (view, getPos) => {
        const element = document.createElement('div');
        ReactDOM.render(
          createElement(DragHandle, {
            dom: meta.dom,
            api,
            start: meta.pos,
          }),
          element,
        );

        element.style.position = 'absolute';
        element.style.zIndex = '1';

        const resizer: HTMLElement | null =
          meta.dom.querySelector('.resizer-item');

        if (resizer) {
          element.style.left = `${resizer.offsetLeft - parseInt(getComputedStyle(resizer).marginLeft) - DRAG_HANDLE_NODE_GAP - DRAG_HANDLE_WIDTH}px`;
        } else {
          element.style.left = `${meta.dom.offsetLeft - DRAG_HANDLE_NODE_GAP - DRAG_HANDLE_WIDTH}px`;
        }

        if (meta.type === 'table') {
          const table = meta.dom.querySelector('table');
          element.style.top = `${meta.dom.offsetTop + (table?.offsetTop || 0)}px`;
        } else {
          element.style.top = `${meta.dom.offsetTop}px`;
        }

        return element;
      },
      { side: -1 },
    ),
  ]);
};
