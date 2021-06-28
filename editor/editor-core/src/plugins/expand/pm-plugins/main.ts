import { Plugin } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { findDomRefAtPos } from 'prosemirror-utils';
import { Dispatch } from '../../../event-dispatcher';
import { createSelectionClickHandler } from '../../selection/utils';
import ExpandNodeView from '../nodeviews';
import { setExpandRef } from '../commands';
import { findExpand } from '../utils';
import { expandClassNames } from '../ui/class-names';
import { getPluginState, createPluginState, pluginKey } from './plugin-factory';

function containsClass(
  element: Element | null,
  className: string,
): element is Element {
  return !!element && element.classList.contains(className);
}

export const createPlugin = (
  dispatch: Dispatch,
  reactContext: () => { [key: string]: any },
  useLongPressSelection: boolean = false,
) => {
  const state = createPluginState(dispatch, {});

  return new Plugin({
    state: state,
    key: pluginKey,
    props: {
      nodeViews: {
        expand: ExpandNodeView(reactContext),
        nestedExpand: ExpandNodeView(reactContext),
      },
      handleKeyDown(_view, event) {
        return containsClass(
          event.target as Element,
          expandClassNames.titleContainer,
        );
      },
      handleKeyPress(_view, event) {
        return containsClass(
          event.target as Element,
          expandClassNames.titleContainer,
        );
      },
      handleScrollToSelection() {
        return containsClass(
          document.activeElement,
          expandClassNames.titleInput,
        );
      },
      handleClickOn: createSelectionClickHandler(
        ['expand', 'nestedExpand'],
        (target) => target.classList.contains(expandClassNames.prefix),
        { useLongPressSelection },
      ),
    },
    // @see ED-8027 to follow up on this work-around
    filterTransaction(tr) {
      if (
        containsClass(document.activeElement, expandClassNames.titleInput) &&
        tr.selectionSet &&
        (!tr.steps.length || tr.isGeneric)
      ) {
        return false;
      }
      return true;
    },

    view: (editorView: EditorView) => {
      const domAtPos = editorView.domAtPos.bind(editorView);

      return {
        update: (view: EditorView) => {
          const { state, dispatch } = view;
          const node = findExpand(state);
          if (node) {
            const expandRef = findDomRefAtPos(
              node.pos,
              domAtPos,
            ) as HTMLDivElement;
            if (getPluginState(state).expandRef !== expandRef) {
              setExpandRef(expandRef)(state, dispatch);
            }
          }
        },
      };
    },
  });
};
