/** @jsx jsx */
import React, { useCallback, useMemo, useLayoutEffect } from 'react';
import { css, jsx } from '@emotion/react';
import { DN600, N200, N800, N30, B100 } from '@atlaskit/theme/colors';
import { themed } from '@atlaskit/theme/components';
import { borderRadius } from '@atlaskit/theme/constants';
import { ThemeProps } from '@atlaskit/theme/types';
import { ButtonItem } from '@atlaskit/menu';
import { relativeFontSizeToBase16 } from '@atlaskit/editor-shared-styles';

import IconFallback from '../../quick-insert/assets/fallback';
import { shortcutStyle } from '../../../ui/styles';
import type { TypeAheadItem } from '../types';
import { SelectItemMode } from '@atlaskit/editor-common/type-ahead';
import { token } from '@atlaskit/tokens';

export const ICON_HEIGHT = 40;
export const ICON_WIDTH = 40;
export const ITEM_PADDING = 12;

export const itemIcon = css`
  width: ${ICON_WIDTH}px;
  height: ${ICON_HEIGHT}px;
  overflow: hidden;
  border: 1px solid ${token('color.border', 'rgba(223, 225, 229, 0.5)')}; /* N60 at 50% */
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

const itemBody = css`
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: space-between;
  line-height: 1.4;
`;

const itemText = (theme: ThemeProps) => css`
  white-space: initial;
  color: ${themed({
    light: token('color.text', N800),
    dark: token('color.text', DN600),
  })(theme)};
  .item-description {
    font-size: ${relativeFontSizeToBase16(11.67)};
    color: ${token('color.text.subtlest', N200)};
    margin-top: 4px;
  }
`;

const itemAfter = css`
  flex: 0 0 auto;
`;

const customRenderItemDivStyle = css`
  overflow: hidden;
  &:hover {
    background-color: ${token('color.background.selected', N30)};
  }
  &:focus {
    box-shadow: inset 0px 0px 0px 2px ${token('color.border.focused', B100)};
    outline: none;
  }
`;

/**
 * This CSS emulates the desired behaviour with :focus-visible for firefox.
 * Firefox unfortunately does not register keyboard focus if user mouseDown and drag a typeahead item
 * resulting in focus-visible style not drawn.
 */
const selectionFrame = {
  '& > button:focus': {
    boxShadow: `inset 0px 0px 0px 2px ${token('color.border.focused', B100)}`,
    outline: 'none',
    '&:active': {
      boxShadow: 'none',
    },
  },
};

const selectedStyle = css`
  background-color: ${token('color.background.selected', N30)};
`;

const FallbackIcon: React.FC<Record<'label', string>> = React.memo(
  ({ label }) => {
    return <IconFallback />;
  },
);

const noop = () => {};

type TypeAheadListItemProps = {
  item: TypeAheadItem;
  itemsLength: number;
  itemIndex: number;
  selectedIndex: number;
  onItemClick: (mode: SelectItemMode, index: number) => void;
};
export const TypeAheadListItem: React.FC<TypeAheadListItemProps> = ({
  item,
  itemsLength,
  selectedIndex,
  onItemClick,
  itemIndex,
}) => {
  /**
   * To select and highlight the first Item when no item is selected
   * However selectedIndex remains -1, So that user does not skip the first item when down arrow key is used from typeahead query(inputQuery.tsx)
   */
  const isSelected =
    itemIndex === selectedIndex || (selectedIndex === -1 && itemIndex === 0);

  const { icon, title, render: customRenderItem } = item;
  const elementIcon = useMemo(() => {
    return (
      <div css={itemIcon}>{icon ? icon() : <FallbackIcon label={title} />}</div>
    );
  }, [icon, title]);

  const insertSelectedItem = useCallback(() => {
    onItemClick(SelectItemMode.SELECTED, itemIndex);
  }, [onItemClick, itemIndex]);

  const customItemRef = React.createRef<HTMLDivElement>();
  const buttonItemRef = React.createRef<HTMLDivElement>();
  const shouldUpdateFocus = selectedIndex === itemIndex;

  useLayoutEffect(() => {
    if (shouldUpdateFocus) {
      customItemRef?.current?.focus();
    }
  }, [customItemRef, shouldUpdateFocus]);

  useLayoutEffect(() => {
    if (shouldUpdateFocus) {
      buttonItemRef?.current?.focus();
    }
  }, [buttonItemRef, shouldUpdateFocus]);

  const customItem = useMemo(() => {
    if (!customRenderItem) {
      return null;
    }
    const Comp = customRenderItem;
    const listItemClasses = [
      customRenderItemDivStyle,
      isSelected && selectedStyle,
    ];
    return (
      <div
        aria-selected={isSelected}
        aria-label={title}
        role="option"
        aria-setsize={itemsLength}
        tabIndex={0}
        css={listItemClasses}
        className={`ak-typeahead-item ${
          isSelected ? 'typeahead-selected-item' : ''
        }`}
        //CSS classes added for test cases purpose
        ref={customItemRef}
      >
        <Comp
          onClick={insertSelectedItem}
          isSelected={false} //The selection styles are handled in the parent div instead. Hence isSelected is made false always.
          onHover={noop}
        />
      </div>
    );
  }, [
    customRenderItem,
    insertSelectedItem,
    isSelected,
    title,
    customItemRef,
    itemsLength,
  ]);

  if (customItem) {
    return customItem;
  }

  return (
    <span css={selectionFrame}>
      <ButtonItem
        onClick={insertSelectedItem}
        iconBefore={elementIcon}
        isSelected={isSelected}
        aria-selected={isSelected}
        aria-label={item.title}
        aria-setsize={itemsLength}
        role="option"
        ref={buttonItemRef}
        description={item.description}
      >
        <div css={itemBody}>
          <div css={itemText}>
            <div className="item-title">{item.title}</div>
          </div>
          <div css={itemAfter}>
            {item.keyshortcut && (
              <div css={shortcutStyle}>{item.keyshortcut}</div>
            )}
          </div>
        </div>
      </ButtonItem>
    </span>
  );
};
