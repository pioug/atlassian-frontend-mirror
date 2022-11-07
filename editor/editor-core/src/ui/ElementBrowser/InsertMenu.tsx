/** @jsx jsx */
import {
  useState,
  useCallback,
  ComponentClass,
  ReactElement,
  HTMLAttributes,
} from 'react';
import { css, jsx } from '@emotion/react';

import { QuickInsertItem } from '@atlaskit/editor-common/provider-factory';
import { Section, ButtonItem } from '@atlaskit/menu';
// AFP-2532 TODO: Fix automatic suppressions below
// eslint-disable-next-line @atlassian/tangerine/import/entry-points
import { borderRadius, gridSize } from '@atlaskit/theme';
import { ThemeProps } from '@atlaskit/theme/types';
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
import { token } from '@atlaskit/tokens';

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
    <div css={(theme: ThemeProps) => insertMenuWrapper(theme, itemCount)}>
      <WithPluginState
        plugins={{ quickInsertState: pluginKey }}
        render={render}
      />
      {itemCount > 0 && viewMoreItem && <ViewMore item={viewMoreItem} />}
    </div>
  );
};

const ViewMore = ({ item }: { item: QuickInsertItem }) => {
  return (
    <Section hasSeparator>
      <ButtonItem
        onClick={item.action as any}
        iconBefore={<div css={itemBefore}>{item.icon!()}</div>}
        aria-describedby={item.title}
        data-testid="view-more-elements-item"
        // @ts-ignore Overriding Menu styles is not supported
        css={css`
          padding: 0px 12px;
        `}
      >
        {item.title}
      </ButtonItem>
    </Section>
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

const insertMenuWrapper = (theme: ThemeProps, itemCount: number) => css`
  display: flex;
  flex-direction: column;
  width: 320px;
  height: ${getInsertMenuHeight({ itemCount })}px;
  background-color: ${themed({
    light: token('elevation.surface.overlay', N0),
    dark: token('elevation.surface.overlay', DN50),
  })(theme)};
  border-radius: ${borderRadius()}px;
  box-shadow: ${token(
    'elevation.shadow.overlay',
    `0 0 0 1px ${N30A},
    0 2px 1px ${N30A},
    0 0 20px -6px ${N60A}`,
  )};
`;

const itemBefore = css`
  width: 40px;
  height: 40px;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: ${gridSize() / 2}px;
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
