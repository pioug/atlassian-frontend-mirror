import type { IntlShape } from 'react-intl-next';

import type { Dispatch } from '@atlaskit/editor-common/event-dispatcher';
import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { createSelectionClickHandler } from '@atlaskit/editor-common/selection';
import { expandClassNames } from '@atlaskit/editor-common/styles';
import type {
  EditorAppearance,
  ExtractInjectionAPI,
} from '@atlaskit/editor-common/types';
import { PluginKey } from '@atlaskit/editor-prosemirror/state';

import type { ExpandPlugin } from '../../types';
import ExpandNodeView from '../node-views';

export const pluginKey = new PluginKey('expandPlugin');

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
  __livePage: boolean = false,
) => {
  const isMobile = appearance === 'mobile';

  return new SafePlugin({
    key: pluginKey,
    props: {
      nodeViews: {
        expand: ExpandNodeView({
          getIntl,
          isMobile,
          api,
          allowInteractiveExpand,
          __livePage,
        }),
        nestedExpand: ExpandNodeView({
          getIntl,
          isMobile,
          api,
          allowInteractiveExpand,
          __livePage,
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
  });
};
