/** @jsx jsx */
import { jsx } from '@emotion/react';
import React from 'react';
import { useIntl } from 'react-intl-next';
import ExpandIcon from '@atlaskit/icon/glyph/chevron-down';
import BulletListIcon from '@atlaskit/icon/glyph/editor/bullet-list';
import {
  toggleBulletList as toggleBulletListKeymap,
  toggleOrderedList as toggleOrderedListKeymap,
  indent as toggleIndentKeymap,
  outdent as toggleOutdentKeymap,
  tooltip,
} from '../../../keymaps';
import type { DropdownItem } from '@atlaskit/editor-plugin-block-type';
import { DropdownMenuWithKeyboardNavigation as DropdownMenu } from '@atlaskit/editor-common/ui-menu';
import ToolbarButton from '../../../ui/ToolbarButton';
import { shortcutStyle } from '../../../ui/styles';
import { expandIconWrapperStyle } from '@atlaskit/editor-common/styles';
import { wrapperStyle, separatorStyles } from '@atlaskit/editor-common/styles';
import {
  listMessages,
  indentationMessages,
} from '@atlaskit/editor-common/messages';
import type { ButtonName, ToolbarProps } from '../types';

export type DropdownProps = ToolbarProps & {
  popupsMountPoint?: HTMLElement;
  popupsBoundariesElement?: HTMLElement;
  popupsScrollableElement?: HTMLElement;
};

export function ToolbarDropdown(props: DropdownProps) {
  const { formatMessage } = useIntl();
  const {
    disabled,
    isReducedSpacing,
    bulletListActive,
    orderedListActive,
    popupsMountPoint,
    popupsBoundariesElement,
    popupsScrollableElement,
    onItemActivated,
  } = props;
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);
  const [isOpenedByKeyboard, setOpenedByKeyboard] = React.useState(false);

  const labelLists = formatMessage(listMessages.lists);

  const onOpenChange = (attrs: any) => {
    setIsDropdownOpen(attrs.isDropdownOpen);
  };

  const handleTriggerClick = () => {
    onOpenChange({ isDropdownOpen: !isDropdownOpen });
  };

  const handleOnKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      setIsDropdownOpen(!isDropdownOpen);
      setOpenedByKeyboard(true);
    }
  };

  const items = useItems(props);

  const handleOnItemActivated = ({
    item,
    shouldCloseMenu = true,
  }: {
    item: DropdownItem;
    shouldCloseMenu: boolean;
  }) => {
    setIsDropdownOpen(!shouldCloseMenu);
    return onItemActivated({
      editorView: props.editorView,
      buttonName: item.value.name as ButtonName,
    });
  };

  return (
    <span css={wrapperStyle}>
      <DropdownMenu
        items={items}
        onItemActivated={handleOnItemActivated}
        mountTo={popupsMountPoint}
        boundariesElement={popupsBoundariesElement}
        scrollableElement={popupsScrollableElement}
        isOpen={isDropdownOpen}
        onOpenChange={onOpenChange}
        fitHeight={188}
        fitWidth={175}
        shouldUseDefaultRole
        shouldFocusFirstItem={() => {
          if (isOpenedByKeyboard) {
            setOpenedByKeyboard(false);
          }
          return isOpenedByKeyboard;
        }}
      >
        <ToolbarButton
          spacing={isReducedSpacing ? 'none' : 'default'}
          selected={bulletListActive || orderedListActive}
          aria-expanded={isDropdownOpen}
          aria-haspopup
          aria-label={labelLists}
          disabled={disabled}
          onClick={handleTriggerClick}
          onKeyDown={handleOnKeyDown}
          title={labelLists}
          iconBefore={
            <span css={wrapperStyle}>
              <BulletListIcon label={labelLists} />
              <span css={expandIconWrapperStyle}>
                <ExpandIcon label="" />
              </span>
            </span>
          }
        />
      </DropdownMenu>
      <span css={separatorStyles} />
    </span>
  );
}

function useItems(
  props: Pick<
    DropdownProps,
    | 'bulletListDisabled'
    | 'bulletListActive'
    | 'orderedListDisabled'
    | 'orderedListActive'
    | 'indentDisabled'
    | 'outdentDisabled'
    | 'showIndentationButtons'
  >,
) {
  const { formatMessage } = useIntl();

  const labelUnorderedList = formatMessage(listMessages.unorderedList);
  const labelOrderedList = formatMessage(listMessages.orderedList);

  let items = [
    {
      key: 'unorderedList',
      content: labelUnorderedList,
      value: { name: 'bullet_list' },
      isDisabled: props.bulletListDisabled,
      isActive: Boolean(props.bulletListActive),
      elemAfter: (
        <div css={shortcutStyle}>{tooltip(toggleBulletListKeymap)}</div>
      ),
    },
    {
      key: 'orderedList',
      content: labelOrderedList,
      value: { name: 'ordered_list' },
      isDisabled: props.orderedListDisabled,
      isActive: Boolean(props.orderedListActive),
      elemAfter: (
        <div css={shortcutStyle}>{tooltip(toggleOrderedListKeymap)}</div>
      ),
    },
  ];
  if (props.showIndentationButtons) {
    const labelIndent = formatMessage(indentationMessages.indent);
    const labelOutdent = formatMessage(indentationMessages.outdent);
    items.push(
      {
        key: 'outdent',
        content: labelOutdent,
        value: { name: 'outdent' },
        isDisabled: props.outdentDisabled,
        isActive: false,
        elemAfter: (
          <div css={shortcutStyle}>{tooltip(toggleOutdentKeymap)}</div>
        ),
      },
      {
        key: 'indent',
        content: labelIndent,
        value: { name: 'indent' },
        isDisabled: props.indentDisabled,
        isActive: false,
        elemAfter: <div css={shortcutStyle}>{tooltip(toggleIndentKeymap)}</div>,
      },
    );
  }
  return [{ items }];
}
