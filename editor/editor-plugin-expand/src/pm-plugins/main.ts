import type { IntlShape } from 'react-intl-next';

import type { Dispatch } from '@atlaskit/editor-common/event-dispatcher';
import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { createSelectionClickHandler } from '@atlaskit/editor-common/selection';
import { expandClassNames } from '@atlaskit/editor-common/styles';
import type {
  EditorAppearance,
  ExtractInjectionAPI,
} from '@atlaskit/editor-common/types';
import { findDomRefAtPos } from '@atlaskit/editor-prosemirror/utils';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';

import { setExpandRef } from '../commands';
import ExpandNodeView from '../nodeviews';
import type { ExpandPlugin } from '../types';
import { findExpand } from '../utils';

import { createPluginState, getPluginState, pluginKey } from './plugin-factory';

export function containsClass(
  element: Element | null,
  className: string,
): boolean {
  return Boolean(element?.classList?.contains(className));
}

export const createPlugin = (
  dispatch: Dispatch,
  getIntl: () => IntlShape,
  appearance: EditorAppearance = 'full-page',
  useLongPressSelection: boolean = false,
  api: ExtractInjectionAPI<ExpandPlugin> | undefined,
  allowInteractiveExpand: boolean = true,
) => {
  const state = createPluginState(dispatch, {});
  const isMobile = appearance === 'mobile';

  return new SafePlugin({
    state: state,
    key: pluginKey,
    props: {
      nodeViews: {
        expand: ExpandNodeView({
          getIntl,
          isMobile,
          api,
          allowInteractiveExpand,
        }),
        nestedExpand: ExpandNodeView({
          getIntl,
          isMobile,
          api,
          allowInteractiveExpand,
        }),
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
        target => target.classList.contains(expandClassNames.prefix),
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
