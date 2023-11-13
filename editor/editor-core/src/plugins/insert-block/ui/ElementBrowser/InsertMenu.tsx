/** @jsx jsx */
import type { ComponentClass, ReactElement, HTMLAttributes } from 'react';
import { useCallback, useState } from 'react';
import { css, jsx } from '@emotion/react';

import type { QuickInsertItem } from '@atlaskit/editor-common/provider-factory';
// AFP-2532 TODO: Fix automatic suppressions below
// eslint-disable-next-line @atlassian/tangerine/import/entry-points
import { borderRadius } from '@atlaskit/theme';
import { N0, N30A, N60A } from '@atlaskit/theme/colors';

import {
  IconCode,
  IconDate,
  IconDecision,
  IconDivider,
  IconExpand,
  IconPanel,
  IconQuote,
  IconStatus,
} from '@atlaskit/editor-common/quick-insert';
import { withReactEditorViewOuterListeners as withOuterListeners } from '@atlaskit/editor-common/ui-react';

import {
  ElementBrowser,
  ELEMENT_ITEM_HEIGHT,
} from '@atlaskit/editor-common/element-browser';

import type { MenuItem } from '@atlaskit/editor-common/ui-menu';
import type { InsertMenuProps, SvgGetterParams } from './types';
import { token } from '@atlaskit/tokens';

const InsertMenu = ({
  editorView,
  dropdownItems,
  showElementBrowserLink,
  onInsert,
  toggleVisiblity,
  pluginInjectionApi,
}: InsertMenuProps) => {
  const [itemCount, setItemCount] = useState(0);

  const transform = useCallback(
    (item: MenuItem): QuickInsertItem => ({
      title: item.content as string,
      description: item.tooltipDescription,
      keyshortcut: item.shortcut,
      icon: () =>
        getSvgIconForItem({
          name: item.value.name,
        }) || (item.elemBefore as ReactElement),
      /**
       * @note This transformed items action is only used when a quick insert item has been
       * called from the quick insert menu and a search has not been performed.
       */
      action: () => onInsert({ item }),
      // "insertInsertMenuItem" expects these 2 properties.
      onClick: item.onClick,
      value: item.value,
    }),
    [onInsert],
  );

  const quickInsertDropdownItems = dropdownItems.map(transform);

  const viewMoreItem = showElementBrowserLink
    ? quickInsertDropdownItems.pop()
    : undefined;

  const onInsertItem = useCallback(
    (item: QuickInsertItem) => {
      toggleVisiblity();
      pluginInjectionApi?.quickInsert?.actions.insertItem(item)(
        editorView.state,
        editorView.dispatch,
      );
    },
    [editorView, toggleVisiblity, pluginInjectionApi],
  );

  const getItems = useCallback(
    (query?: string, category?: string) => {
      let result;
      /**
       * @warning The results if there is a query are not the same as the results if there is no query.
       * For example: If you have a typed panel and then select the panel item then it will call a different action
       * than is specified on the editor plugins quick insert
       * @see above transform function for more details.
       */
      if (query) {
        result =
          pluginInjectionApi?.quickInsert?.actions.getSuggestions({
            query,
            category,
          }) ?? [];
      } else {
        const featuredQuickInsertSuggestions =
          pluginInjectionApi?.quickInsert?.actions.getSuggestions({
            category,
            featuredItems: true,
          }) ?? [];
        result = quickInsertDropdownItems.concat(
          featuredQuickInsertSuggestions,
        ) as QuickInsertItem[];
      }
      setItemCount(result.length);
      return result;
    },
    [pluginInjectionApi?.quickInsert?.actions, quickInsertDropdownItems],
  );

  const emptyStateHandler =
    pluginInjectionApi?.quickInsert?.sharedState.currentState()
      ?.emptyStateHandler;

  return (
    <div css={insertMenuWrapper(itemCount)}>
      <ElementBrowserWrapper
        handleClickOutside={toggleVisiblity}
        handleEscapeKeydown={toggleVisiblity}
        closeOnTab={true}
      >
        <ElementBrowser
          mode="inline"
          getItems={getItems}
          emptyStateHandler={emptyStateHandler}
          onInsertItem={onInsertItem}
          showSearch
          showCategories={false}
          // On page resize we want the InlineElementBrowser to show updated tools/overflow items
          key={quickInsertDropdownItems.length}
          viewMoreItem={viewMoreItem}
        />
      </ElementBrowserWrapper>
    </div>
  );
};

const getSvgIconForItem = ({
  name,
}: SvgGetterParams): ReactElement | undefined => {
  type IconType = { [key: string]: ComponentClass<{ label: string }> };

  const Icon = (
    {
      codeblock: IconCode,
      panel: IconPanel,
      blockquote: IconQuote,
      decision: IconDecision,
      horizontalrule: IconDivider,
      expand: IconExpand,
      date: IconDate,
      status: IconStatus,
    } as IconType
  )[name];

  return Icon ? <Icon label="" /> : undefined;
};

const getInsertMenuHeight = ({ itemCount }: { itemCount: number }) => {
  // Figure based on visuals to exclude the searchbar, padding/margin, and the ViewMore item.
  const EXTRA_SPACE_EXCLUDING_ELEMENTLIST = 112;
  if (itemCount > 0 && itemCount < 6) {
    return itemCount * ELEMENT_ITEM_HEIGHT + EXTRA_SPACE_EXCLUDING_ELEMENTLIST;
  }
  return 560; // For showing 6 Elements.
};

const insertMenuWrapper = (itemCount: number) => css`
  display: flex;
  flex-direction: column;
  width: 320px;
  height: ${getInsertMenuHeight({ itemCount })}px;
  background-color: ${token('elevation.surface.overlay', N0)};
  border-radius: ${borderRadius()}px;
  box-shadow: ${token(
    'elevation.shadow.overlay',
    `0 0 0 1px ${N30A},
    0 2px 1px ${N30A},
    0 0 20px -6px ${N60A}`,
  )};
`;

const flexWrapperStyles = css`
  display: flex;
  flex: 1;
  box-sizing: border-box;
  overflow: hidden;
`;

const FlexWrapper = (props: HTMLAttributes<HTMLDivElement>) => {
  const { children, ...divProps } = props;
  return (
    <div css={flexWrapperStyles} {...divProps}>
      {children}
    </div>
  );
};

const ElementBrowserWrapper = withOuterListeners(FlexWrapper);

export default InsertMenu;
