import React, {
  useState,
  useCallback,
  ComponentClass,
  ReactElement,
} from 'react';
import styled, { ThemeProvider } from 'styled-components';

import { QuickInsertItem } from '@atlaskit/editor-common/provider-factory';
import Item, { itemThemeNamespace } from '@atlaskit/item';
// AFP-2532 TODO: Fix automatic suppressions below
// eslint-disable-next-line @atlassian/tangerine/import/entry-points
import { borderRadius, gridSize } from '@atlaskit/theme';
import { themed } from '@atlaskit/theme/components';
import { DN50, N0, N30A, N60A } from '@atlaskit/theme/colors';

import {
  IconCode,
  IconDate,
  IconDecision,
  IconDivider,
  IconExpand,
  IconPanel,
  IconQuote,
  IconStatus,
} from '../../plugins/quick-insert/assets';

import { QuickInsertPluginState } from '../../plugins/quick-insert/types';
import withOuterListeners from '../with-outer-listeners';
import WithPluginState from '../WithPluginState';
import { pluginKey } from '../../plugins/quick-insert/plugin-key';
import {
  getFeaturedQuickInsertItems,
  searchQuickInsertItems,
} from '../../plugins/quick-insert/search';
import { insertItem } from '../../plugins/quick-insert/commands';
import ElementBrowser from './components/ElementBrowserLoader';

import { MenuItem } from '../DropdownMenu/types';
import { ELEMENT_ITEM_HEIGHT } from './constants';
import { InsertMenuProps, SvgGetterParams } from './types';

const InsertMenu = ({
  editorView,
  dropdownItems,
  onInsert,
  toggleVisiblity,
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
      action: () => onInsert({ item }),
      // "insertInsertMenuItem" expects these 2 properties.
      onClick: item.onClick,
      value: item.value,
    }),
    [onInsert],
  );

  const quickInsertDropdownItems = dropdownItems.map(transform);

  const viewMoreItem = quickInsertDropdownItems.pop();

  const onInsertItem = useCallback(
    (item) => {
      toggleVisiblity();
      if (!editorView.hasFocus()) {
        editorView.focus();
      }
      insertItem(item)(editorView.state, editorView.dispatch);
    },
    [editorView, toggleVisiblity],
  );

  const getItems = useCallback(
    (quickInsertState: QuickInsertPluginState) => (
      query?: string,
      category?: string,
    ) => {
      let result;
      if (query) {
        result = searchQuickInsertItems(quickInsertState, {})(query, category);
      } else {
        result = quickInsertDropdownItems.concat(
          getFeaturedQuickInsertItems(quickInsertState, {})(),
        ) as QuickInsertItem[];
      }
      setItemCount(result.length);
      return result;
    },
    [quickInsertDropdownItems],
  );

  const render = useCallback(
    ({ quickInsertState }) => (
      <ElementBrowserWrapper
        handleClickOutside={toggleVisiblity}
        handleEscapeKeydown={toggleVisiblity}
      >
        <ElementBrowser
          mode="inline"
          getItems={getItems(quickInsertState)}
          emptyStateHandler={quickInsertState?.emptyStateHandler}
          onInsertItem={onInsertItem}
          showSearch
          showCategories={false}
          // On page resize we want the InlineElementBrowser to show updated tools/overflow items
          key={quickInsertDropdownItems.length}
        />
      </ElementBrowserWrapper>
    ),
    [getItems, onInsertItem, quickInsertDropdownItems.length, toggleVisiblity],
  );

  return (
    <InsertMenuWrapper itemCount={itemCount}>
      <WithPluginState
        plugins={{ quickInsertState: pluginKey }}
        render={render}
      />
      {itemCount > 0 && viewMoreItem && <ViewMore item={viewMoreItem} />}
    </InsertMenuWrapper>
  );
};

const ViewMore = ({ item }: { item: QuickInsertItem }) => {
  const onKeyPress = useCallback(
    (e: React.KeyboardEvent) => {
      const SPACE_KEY = 32;
      const ENTER_KEY = 13;

      if (e.which === ENTER_KEY || e.which === SPACE_KEY) {
        // @ts-ignore We manually transformed "view more" to a quickInsert item
        // action would always toggle the ModalElementBrowser
        item.action();
      }
    },
    [item],
  );
  return (
    <ThemeProvider theme={viewMoreItemTheme}>
      <Item
        onClick={item.action}
        elemBefore={<ItemBefore>{item.icon!()}</ItemBefore>}
        aria-describedby={item.title}
        data-testid="view-more-elements-item"
        onKeyPress={onKeyPress}
      >
        {item.title}
      </Item>
    </ThemeProvider>
  );
};

const getSvgIconForItem = ({
  name,
}: SvgGetterParams): ReactElement | undefined => {
  type IconType = { [key: string]: ComponentClass<{ label: string }> };

  const Icon = ({
    codeblock: IconCode,
    panel: IconPanel,
    blockquote: IconQuote,
    decision: IconDecision,
    horizontalrule: IconDivider,
    expand: IconExpand,
    date: IconDate,
    status: IconStatus,
  } as IconType)[name];

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

const InsertMenuWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 320px;
  height: ${getInsertMenuHeight}px;
  background-color: ${themed({ light: N0, dark: DN50 })()};
  border-radius: ${borderRadius()}px;
  box-shadow: 0 0 0 1px ${N30A}, 0 2px 1px ${N30A}, 0 0 20px -6px ${N60A};
`;

const ItemBefore = styled.div`
  width: 40px;
  height: 40px;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: ${gridSize() / 2}px;
`;

const PADDING_LEFT = 14;
const HEIGHT = 40;

const viewMoreItemTheme = {
  [itemThemeNamespace]: {
    padding: {
      default: {
        left: PADDING_LEFT,
      },
    },
    height: HEIGHT,
  },
};

const FlexWrapper = styled.div`
  display: flex;
  flex: 1;
  box-sizing: border-box;
  overflow: hidden;
`;

const ElementBrowserWrapper = withOuterListeners(FlexWrapper);

export default InsertMenu;
