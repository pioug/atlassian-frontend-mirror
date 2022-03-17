import React, { useCallback, useMemo, useRef, useLayoutEffect } from 'react';
import {
  text as colorsText,
  N200,
  N20,
  DN70,
  N800,
  DN600,
  DN300,
} from '@atlaskit/theme/colors';
import { themed } from '@atlaskit/theme/components';
import { borderRadius } from '@atlaskit/theme/constants';
// eslint-disable-next-line @atlaskit/design-system/no-deprecated-imports
import Item, { itemThemeNamespace } from '@atlaskit/item';
import { relativeFontSizeToBase16 } from '@atlaskit/editor-shared-styles';
import styled from 'styled-components';

import IconFallback from '../../quick-insert/assets/fallback';
import { Shortcut } from '../../../ui/styles';
import type { TypeAheadItem, OnSelectItem } from '../types';
import { SelectItemMode } from '@atlaskit/editor-common/type-ahead';

export const ICON_HEIGHT = 40;
export const ICON_WIDTH = 40;
export const ITEM_PADDING = 12;

export const itemTheme = {
  [itemThemeNamespace]: {
    padding: {
      default: {
        bottom: ITEM_PADDING,
        left: ITEM_PADDING,
        right: ITEM_PADDING,
        top: ITEM_PADDING,
      },
    },
    beforeItemSpacing: {
      default: () => ITEM_PADDING,
    },
    borderRadius: () => 0,
    hover: {
      // background: colors.transparent, transparent is not a thing
      text: colorsText,
      secondaryText: N200,
    },
    selected: {
      background: themed({ light: N20, dark: DN70 }),
      text: themed({ light: N800, dark: DN600 }),
      secondaryText: themed({ light: N200, dark: DN300 }),
    },
  },
};

export const ItemIcon = styled.div`
  width: ${ICON_WIDTH}px;
  height: ${ICON_HEIGHT}px;
  overflow: hidden;
  border: 1px solid rgba(223, 225, 229, 0.5); /* N60 at 50% */
  border-radius: ${borderRadius()}px;
  box-sizing: border-box;

  display: flex;
  justify-content: center;
  align-items: center;

  div {
    width: ${ICON_WIDTH}px;
    height: ${ICON_HEIGHT}px;
  }
`;

const ItemBody = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: space-between;
  line-height: 1.4;
`;

const ItemText = styled.div`
  white-space: initial;
  .item-description {
    font-size: ${relativeFontSizeToBase16(11.67)};
    color: ${N200};
    margin-top: 4px;
  }
`;

const ItemAfter = styled.div`
  flex: 0 0 auto;
`;

const hidden = { overflow: 'hidden' };
const FallbackIcon: React.FC<Record<'label', string>> = React.memo(
  ({ label }) => {
    return <IconFallback />;
  },
);

const noop = () => {};

type TypeAheadListItemProps = {
  item: TypeAheadItem;
  itemIndex: number;
  selectedIndex: number;
  onItemHover: OnSelectItem;
  onItemClick: (mode: SelectItemMode, index: number) => void;
};
export const TypeAheadListItem: React.FC<TypeAheadListItemProps> = ({
  item,
  selectedIndex,
  onItemHover,
  onItemClick,
  itemIndex,
}) => {
  const isSelected = itemIndex === selectedIndex;

  // It's possible for onMouseMove to be called multiple times in quick
  // succession because the mousemove event can fire very rapidly. This
  // provides an additional safety net to prevent that.
  const mouseMoveCalled = useRef(false);

  const onMouseMove = useCallback(() => {
    if (isSelected || mouseMoveCalled.current) {
      return;
    }
    mouseMoveCalled.current = true;
    onItemHover({
      item,
      index: itemIndex,
    });
  }, [item, itemIndex, onItemHover, isSelected]);

  useLayoutEffect(() => {
    if (!isSelected) {
      mouseMoveCalled.current = false;
    }
  }, [isSelected]);

  const { icon, title, render: customRenderItem } = item;
  const elementIcon = useMemo(() => {
    return (
      <ItemIcon>{icon ? icon() : <FallbackIcon label={title} />}</ItemIcon>
    );
  }, [icon, title]);

  const insertSelectedItem = useCallback(() => {
    onItemClick(SelectItemMode.SELECTED, itemIndex);
  }, [onItemClick, itemIndex]);

  const customItem = useMemo(() => {
    if (!customRenderItem) {
      return null;
    }

    const Comp = customRenderItem;
    return (
      <div
        aria-selected={isSelected}
        aria-label={title}
        role="option"
        tabIndex={0}
        style={hidden}
        onMouseMove={onMouseMove}
      >
        <Comp
          onClick={insertSelectedItem}
          isSelected={isSelected}
          onHover={noop}
        />
      </div>
    );
  }, [customRenderItem, insertSelectedItem, onMouseMove, isSelected, title]);

  if (customItem) {
    return customItem;
  }

  return (
    <Item
      onClick={insertSelectedItem}
      onMouseMove={onMouseMove}
      elemBefore={elementIcon}
      isSelected={isSelected}
      aria-selected={isSelected}
      aria-label={item.title}
      role="option"
      theme={itemTheme}
    >
      <ItemBody>
        <ItemText>
          <div className="item-title">{item.title}</div>
          {item.description && (
            <div className="item-description">{item.description}</div>
          )}
        </ItemText>
        <ItemAfter>
          {item.keyshortcut && <Shortcut>{item.keyshortcut}</Shortcut>}
        </ItemAfter>
      </ItemBody>
    </Item>
  );
};
