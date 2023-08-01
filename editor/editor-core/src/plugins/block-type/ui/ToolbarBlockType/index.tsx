/** @jsx jsx */
import React from 'react';
import { jsx } from '@emotion/react';
import type { WrappedComponentProps } from 'react-intl-next';
import { injectIntl } from 'react-intl-next';
import { akEditorMenuZIndex } from '@atlaskit/editor-shared-styles';

import DropdownMenu from '../../../../ui/DropdownMenu';
import { separatorStyles, wrapperStyle } from '@atlaskit/editor-common/styles';
import type { BlockTypeState } from '../../pm-plugins/main';
import type { BlockType } from '../../types';
import {
  blockTypeMenuItemStyle,
  keyboardShortcut,
  keyboardShortcutSelect,
} from './styled';
import { tooltip, findKeymapByDescription } from '../../../../keymaps';
import type { MenuItem } from '@atlaskit/editor-common/ui-menu';
import { BlockTypeButton } from './blocktype-button';
import { getAriaKeyshortcuts } from '@atlaskit/editor-common/keymaps';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';

export type DropdownItem = MenuItem & {
  value: BlockType;
};

export interface Props {
  isDisabled?: boolean;
  isSmall?: boolean;
  isReducedSpacing?: boolean;
  pluginState: BlockTypeState;
  popupsMountPoint?: HTMLElement;
  popupsBoundariesElement?: HTMLElement;
  popupsScrollableElement?: HTMLElement;
  editorView?: EditorView;
  setBlockType: (type: string) => void;
}

export interface State {
  active: boolean;
  isOpenedByKeyboard: boolean;
}

class ToolbarBlockType extends React.PureComponent<
  Props & WrappedComponentProps,
  State
> {
  state = {
    active: false,
    isOpenedByKeyboard: false,
  };

  private onOpenChange = (attrs: any) => {
    this.setState({
      ...this.state,
      active: attrs.isOpen,
      isOpenedByKeyboard: attrs.isOpenedByKeyboard,
    });
  };

  render() {
    const { active, isOpenedByKeyboard } = this.state;
    const {
      popupsMountPoint,
      popupsBoundariesElement,
      popupsScrollableElement,
      isSmall,
      isReducedSpacing,
      pluginState: {
        currentBlockType,
        blockTypesDisabled,
        availableBlockTypes,
      },
      intl: { formatMessage },
    } = this.props;

    const isHeadingDisabled = !availableBlockTypes.some(
      (blockType) => blockType.nodeName === 'heading',
    );

    if (isHeadingDisabled) {
      return null;
    }

    const blockTypeTitles = availableBlockTypes
      .filter((blockType) => blockType.name === currentBlockType.name)
      .map((blockType) => blockType.title);

    if (!this.props.isDisabled && !blockTypesDisabled) {
      const items = this.createItems();
      return (
        <span css={wrapperStyle}>
          <DropdownMenu
            items={items}
            onOpenChange={this.onOpenChange}
            onItemActivated={this.handleSelectBlockType}
            isOpen={active}
            mountTo={popupsMountPoint}
            boundariesElement={popupsBoundariesElement}
            scrollableElement={popupsScrollableElement}
            zIndex={akEditorMenuZIndex}
            fitHeight={360}
            fitWidth={106}
            shouldUseDefaultRole
            shouldFocusFirstItem={() => {
              if (isOpenedByKeyboard) {
                this.setState({ ...this.state, isOpenedByKeyboard: false });
              }
              return isOpenedByKeyboard;
            }}
          >
            <BlockTypeButton
              isSmall={isSmall}
              isReducedSpacing={isReducedSpacing}
              selected={active}
              disabled={false}
              title={blockTypeTitles[0]}
              onClick={this.handleTriggerClick}
              onKeyDown={this.handleTriggerByKeyboard}
              formatMessage={formatMessage}
              aria-expanded={active}
            />
          </DropdownMenu>
          <span css={separatorStyles} />
        </span>
      );
    }

    return (
      <span css={wrapperStyle}>
        <BlockTypeButton
          isSmall={isSmall}
          isReducedSpacing={isReducedSpacing}
          selected={active}
          disabled={true}
          title={blockTypeTitles[0]}
          onClick={this.handleTriggerClick}
          onKeyDown={this.handleTriggerByKeyboard}
          formatMessage={formatMessage}
          aria-expanded={active}
        />
        <span css={separatorStyles} />
      </span>
    );
  }

  private handleTriggerClick = () => {
    this.onOpenChange({
      isOpen: !this.state.active,
      isOpenedByKeyboard: false,
    });
  };

  private handleTriggerByKeyboard = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.onOpenChange({
        isOpen: !this.state.active,
        isOpenedByKeyboard: true,
      });
    }
  };

  private createItems = () => {
    const {
      intl: { formatMessage },
    } = this.props;
    const { currentBlockType, availableBlockTypes } = this.props.pluginState;

    const items: MenuItem[] = availableBlockTypes.map((blockType, index) => {
      const isActive = currentBlockType === blockType;
      const tagName = blockType.tagName || 'p';
      const Tag = tagName as keyof React.ReactHTML;
      const keyMap = findKeymapByDescription(blockType.title.defaultMessage);

      return {
        content: (
          <div css={blockTypeMenuItemStyle(tagName, isActive)}>
            <Tag>{formatMessage(blockType.title)}</Tag>
          </div>
        ),
        value: blockType,
        label: formatMessage(blockType.title),
        'aria-label': tooltip(keyMap, formatMessage(blockType.title)),
        keyShortcuts: getAriaKeyshortcuts(keyMap),
        key: `${blockType.name}-${index}`,
        elemAfter: (
          <div css={[keyboardShortcut, isActive && keyboardShortcutSelect]}>
            {tooltip(keyMap)}
          </div>
        ),
        isActive,
      };
    });
    return [
      {
        items,
      },
    ];
  };

  private handleSelectBlockType = ({
    item,
    shouldCloseMenu = true,
  }: {
    item: DropdownItem;
    shouldCloseMenu: boolean;
  }) => {
    const blockType = item.value;
    this.props.setBlockType(blockType.name);
    if (shouldCloseMenu) {
      this.setState({ ...this.state, active: false });
    }
  };
}

export default injectIntl(ToolbarBlockType);
