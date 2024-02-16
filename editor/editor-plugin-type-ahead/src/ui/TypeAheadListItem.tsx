// Disabling for ED-21403 fixing accessibility issue.
/* eslint-disable jsx-a11y/role-supports-aria-props */
/** @jsx jsx */
import React, { useCallback, useLayoutEffect, useMemo } from 'react';

import { css, jsx } from '@emotion/react';
import { useIntl } from 'react-intl-next';

import { IconFallback } from '@atlaskit/editor-common/quick-insert';
import {
  SelectItemMode,
  typeAheadListMessages,
} from '@atlaskit/editor-common/type-ahead';
import { relativeFontSizeToBase16 } from '@atlaskit/editor-shared-styles';
import { shortcutStyle } from '@atlaskit/editor-shared-styles/shortcut';
import { ButtonItem } from '@atlaskit/menu';
import { B400, N200, N30, N800 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

import type { TypeAheadItem } from '../types';

export const itemIcon = css({
  width: token('space.500', '40px'),
  height: token('space.500', '40px'),
  overflow: 'hidden',
  border: `1px solid ${token(
    'color.border',
    'rgba(223, 225, 229, 0.5)',
  )}` /* N60 at 50% */,
  borderRadius: token('border.radius', '3px'),
  boxSizing: 'border-box',

  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',

  div: {
    width: token('space.500', '40px'),
    height: token('space.500', '40px'),
  },
});

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
    margin-top: ${token('space.050', '4px')};
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

const FallbackIcon = React.memo(({ label }: Record<'label', string>) => {
  return <IconFallback />;
});

const noop = () => {};

type TypeAheadListItemProps = {
  item: TypeAheadItem;
  itemsLength: number;
  itemIndex: number;
  selectedIndex: number;
  ariaLabel?: string;
  onItemClick: (mode: SelectItemMode, index: number) => void;
};

export const TypeAheadListItem = ({
  item,
  itemsLength,
  selectedIndex,
  onItemClick,
  itemIndex,
  ariaLabel,
}: TypeAheadListItemProps) => {
  /**
   * To select and highlight the first Item when no item is selected
   * However selectedIndex remains -1, So that user does not skip the first item when down arrow key is used from typeahead query(inputQuery.tsx)
   */
  const isSelected =
    itemIndex === selectedIndex || (selectedIndex === -1 && itemIndex === 0);

  // Assistive text
  const intl = useIntl();
  const descriptionText = item.description ? `${item.description}.` : '';
  const shortcutText = item.keyshortcut
    ? ` ${intl.formatMessage(typeAheadListMessages.shortcutLabel)} ${
        item.keyshortcut
      }.`
    : '';

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
        aria-description={`${descriptionText} ${shortcutText}`}
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
      </ButtonItem>
    </span>
  );
};
