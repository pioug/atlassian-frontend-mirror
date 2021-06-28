import React from 'react';
import { injectIntl, InjectedIntlProps } from 'react-intl';
import { akEditorMenuZIndex } from '@atlaskit/editor-shared-styles';

import DropdownMenu from '../../../../ui/DropdownMenu';
import { Separator, Wrapper, MenuWrapper } from '../../../../ui/styles';
import { BlockTypeState } from '../../pm-plugins/main';
import { BlockType, NORMAL_TEXT } from '../../types';
import { BlockTypeMenuItem, KeyboardShortcut } from './styled';
import { tooltip, findKeymapByDescription } from '../../../../keymaps';
import { MenuItem } from '../../../../ui/DropdownMenu/types';
import { BlockTypeButton } from './blocktype-button';

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
  setBlockType: (type: string) => void;
}

export interface State {
  active: boolean;
}

class ToolbarBlockType extends React.PureComponent<
  Props & InjectedIntlProps,
  State
> {
  state = {
    active: false,
  };

  private onOpenChange = (attrs: any) => {
    this.setState({ active: attrs.isOpen });
  };

  render() {
    const { active } = this.state;
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

    const longestDropdownMenuItem = [
      NORMAL_TEXT,
      ...availableBlockTypes,
    ].reduce((longest, item) => {
      const itemTitle = formatMessage(item.title);
      return itemTitle.length >= longest.length ? itemTitle : longest;
    }, '');

    if (!this.props.isDisabled && !blockTypesDisabled) {
      const items = this.createItems();
      return (
        <MenuWrapper>
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
          >
            <BlockTypeButton
              isSmall={isSmall}
              isReducedSpacing={isReducedSpacing}
              selected={active}
              disabled={false}
              title={blockTypeTitles[0]}
              onClick={this.handleTriggerClick}
              formatMessage={formatMessage}
            >
              {longestDropdownMenuItem}
            </BlockTypeButton>
          </DropdownMenu>
          <Separator />
        </MenuWrapper>
      );
    }

    return (
      <Wrapper>
        <BlockTypeButton
          isSmall={isSmall}
          isReducedSpacing={isReducedSpacing}
          selected={active}
          disabled={true}
          title={blockTypeTitles[0]}
          onClick={this.handleTriggerClick}
          formatMessage={formatMessage}
        >
          {longestDropdownMenuItem}
        </BlockTypeButton>
        <Separator />
      </Wrapper>
    );
  }

  private handleTriggerClick = () => {
    this.onOpenChange({ isOpen: !this.state.active });
  };

  private createItems = () => {
    const {
      intl: { formatMessage },
    } = this.props;
    const { currentBlockType, availableBlockTypes } = this.props.pluginState;

    const items: MenuItem[] = availableBlockTypes.map((blockType, index) => {
      const isActive = currentBlockType === blockType;
      const Tag = (blockType.tagName || 'p') as keyof React.ReactHTML;

      return {
        content: (
          <BlockTypeMenuItem tagName={Tag} selected={isActive}>
            <Tag>{formatMessage(blockType.title)}</Tag>
          </BlockTypeMenuItem>
        ),
        value: blockType,
        key: `${blockType.name}-${index}`,
        elemAfter: (
          <KeyboardShortcut selected={isActive}>
            {tooltip(findKeymapByDescription(blockType.title.defaultMessage))}
          </KeyboardShortcut>
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

  private handleSelectBlockType = ({ item }: { item: DropdownItem }) => {
    const blockType = item.value;
    this.props.setBlockType(blockType.name);
    this.setState({ active: false });
  };
}

export default injectIntl(ToolbarBlockType);
