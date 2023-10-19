/** @jsx jsx */
import React, { useCallback, useLayoutEffect, useMemo } from 'react';

import { css, jsx } from '@emotion/react';
import { useIntl } from 'react-intl-next';

import { IconFallback } from '@atlaskit/editor-common/quick-insert';
import { SelectItemMode } from '@atlaskit/editor-common/type-ahead';
import { relativeFontSizeToBase16 } from '@atlaskit/editor-shared-styles';
import { shortcutStyle } from '@atlaskit/editor-shared-styles/shortcut';
import { ButtonItem } from '@atlaskit/menu';
import { B400, N200, N30, N800 } from '@atlaskit/theme/colors';
import { borderRadius } from '@atlaskit/theme/constants';
import { token } from '@atlaskit/tokens';

import { typeAheadListMessages } from '../messages';
import type { TypeAheadItem } from '../types';

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
`;

const itemText = css`
  white-space: initial;
  color: ${token('color.text', N800)};
  .item-title {
    line-height: 1.4;
  }
  .item-description {
    font-size: ${relativeFontSizeToBase16(12)};
    color: ${token('color.text.subtlest', N200)};
    margin-top: 3px;
  }
`;

const itemAfter = css`
  flex: 0 0 auto;
`;

const customRenderItemDivStyle = css`
  overflow: hidden;
  &:focus {
    box-shadow: inset 2px 0px 0px ${token('color.border.focused', B400)};
    background-color: ${token('color.background.neutral.subtle.hovered', N30)};
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
    boxShadow: `inset 2px 0px 0px ${token('color.border.focused', B400)};`,
    backgroundColor: `${token('color.background.neutral.subtle.hovered', N30)}`,
    outline: 'none',
    '&:active': {
      boxShadow: 'none',
    },
  },
  '& > button:hover': {
    backgroundColor: 'inherit',
    outline: 'none',
  },
};

const selectedStyle = css`
  background-color: ${token('color.background.neutral.subtle.hovered', N30)};
  box-shadow: inset 2px 0px 0px ${token('color.border.focused', B400)};
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
  ariaLabel?: string;
  onItemClick: (mode: SelectItemMode, index: number) => void;
};

const AssistiveText = ({
  title,
  description,
  shortcut,
}: {
  title: string;
  description?: string;
  shortcut?: string;
}) => {
  const intl = useIntl();
  const descriptionText = description
    ? ` ${intl.formatMessage(
        typeAheadListMessages.descriptionLabel,
      )} ${description}.`
    : '';
  const shortcutText = shortcut
    ? ` ${intl.formatMessage(typeAheadListMessages.shortcutLabel)} ${shortcut}.`
    : '';
  return (
    <span className="assistive">{`${title}. ${descriptionText} ${shortcutText}`}</span>
  );
};

export const TypeAheadListItem: React.FC<TypeAheadListItemProps> = ({
  item,
  itemsLength,
  selectedIndex,
  onItemClick,
  itemIndex,
  ariaLabel,
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
        role="option"
        aria-label={ariaLabel}
        aria-setsize={itemsLength}
        aria-posinset={itemIndex}
        tabIndex={0}
        css={listItemClasses}
        className={`ak-typeahead-item ${
          isSelected ? 'typeahead-selected-item' : ''
        }`}
        //CSS classes added for test cases purpose
        ref={customItemRef}
      >
        <div aria-hidden={true}>
          <Comp
            onClick={insertSelectedItem}
            isSelected={false} //The selection styles are handled in the parent div instead. Hence isSelected is made false always.
            onHover={noop}
          />
        </div>
      </div>
    );
  }, [
    customRenderItem,
    isSelected,
    ariaLabel,
    itemsLength,
    customItemRef,
    insertSelectedItem,
    itemIndex,
  ]);

  if (customItem) {
    return customItem;
  }
  const listItemClasses = [selectionFrame, isSelected && selectedStyle];
  return (
    <span css={listItemClasses}>
      <ButtonItem
        onClick={insertSelectedItem}
        iconBefore={elementIcon}
        isSelected={isSelected}
        aria-selected={isSelected}
        aria-label={title}
        aria-setsize={itemsLength}
        aria-posinset={itemIndex}
        role="option"
        ref={buttonItemRef}
        // @ts-ignore
        css={listItemClasses}
      >
        <div aria-hidden={true}>
          <div css={itemText}>
            <div css={itemBody}>
              <div className="item-title">{item.title}</div>
              <div css={itemAfter}>
                {item.keyshortcut && (
                  <div css={shortcutStyle}>{item.keyshortcut}</div>
                )}
              </div>
            </div>
            <div className="item-description">{item.description}</div>
          </div>
        </div>
        <AssistiveText
          title={item.title}
          description={item.description}
          shortcut={item.keyshortcut}
        />
      </ButtonItem>
    </span>
  );
};
