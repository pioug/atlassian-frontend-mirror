import React from 'react';
import { createElement } from 'react';
import {
  defineMessages,
  injectIntl,
  FormattedMessage,
  InjectedIntlProps,
} from 'react-intl';
import ExpandIcon from '@atlaskit/icon/glyph/chevron-down';
import TextStyleIcon from '@atlaskit/icon/glyph/editor/text-style';
import { akEditorMenuZIndex } from '@atlaskit/editor-common';

import { analyticsService as analytics } from '../../../../analytics';
import ToolbarButton from '../../../../ui/ToolbarButton';
import DropdownMenu from '../../../../ui/DropdownMenu';
import {
  ButtonContent,
  Separator,
  Wrapper,
  MenuWrapper,
  ExpandIconWrapper,
} from '../../../../ui/styles';
import { BlockTypeState } from '../../pm-plugins/main';
import { BlockType, NORMAL_TEXT } from '../../types';
import { BlockTypeMenuItem, KeyboardShortcut } from './styled';
import { tooltip, findKeymapByDescription } from '../../../../keymaps';
import { MenuItem } from '../../../../ui/DropdownMenu/types';

export const messages = defineMessages({
  textStyles: {
    id: 'fabric.editor.textStyles',
    defaultMessage: 'Text styles',
    description:
      'Menu provides access to various heading styles or normal text',
  },
});

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
      blockType => blockType.nodeName === 'heading',
    );

    if (isHeadingDisabled) {
      return null;
    }

    const blockTypeTitles = availableBlockTypes
      .filter(blockType => blockType.name === currentBlockType.name)
      .map(blockType => blockType.title);

    const longestDropdownMenuItem = [
      NORMAL_TEXT,
      ...availableBlockTypes,
    ].reduce((longest, item) => {
      const itemTitle = formatMessage(item.title);
      return itemTitle.length >= longest.length ? itemTitle : longest;
    }, '');

    const toolbarButtonFactory = (disabled: boolean) => {
      const labelTextStyles = formatMessage(messages.textStyles);
      return (
        <ToolbarButton
          spacing={isReducedSpacing ? 'none' : 'default'}
          selected={active}
          className="block-type-btn"
          disabled={disabled}
          onClick={this.handleTriggerClick}
          title={labelTextStyles}
          aria-label="Font style"
          iconAfter={
            <Wrapper isSmall={isSmall}>
              {isSmall && <TextStyleIcon label={labelTextStyles} />}
              <ExpandIconWrapper>
                <ExpandIcon label={labelTextStyles} />
              </ExpandIconWrapper>
            </Wrapper>
          }
        >
          {!isSmall && (
            <ButtonContent>
              <FormattedMessage
                {...(blockTypeTitles[0] || NORMAL_TEXT.title)}
              />
              <div style={{ overflow: 'hidden', height: 0 }}>
                {longestDropdownMenuItem}
              </div>
            </ButtonContent>
          )}
        </ToolbarButton>
      );
    };

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
            {toolbarButtonFactory(false)}
          </DropdownMenu>
          <Separator />
        </MenuWrapper>
      );
    }

    return (
      <Wrapper>
        {toolbarButtonFactory(true)}
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
    const items = availableBlockTypes.reduce((acc, blockType, blockTypeNo) => {
      const isActive = currentBlockType === blockType;
      const tagName = blockType.tagName || 'p';
      acc.push({
        content: (
          <BlockTypeMenuItem tagName={tagName} selected={isActive}>
            {createElement(tagName, {}, formatMessage(blockType.title))}
          </BlockTypeMenuItem>
        ),
        value: blockType,
        key: `${blockType.name}-${blockTypeNo}`,
        elemAfter: (
          <KeyboardShortcut selected={isActive}>
            {tooltip(findKeymapByDescription(blockType.title.defaultMessage))}
          </KeyboardShortcut>
        ),
        isActive,
      });
      return acc;
    }, [] as Array<DropdownItem>);
    return [{ items }];
  };

  private handleSelectBlockType = ({ item }: { item: DropdownItem }) => {
    const blockType = item.value;
    this.props.setBlockType(blockType.name);
    this.setState({ active: false });

    analytics.trackEvent(`atlassian.editor.format.${blockType.name}.button`);
  };
}

export default injectIntl(ToolbarBlockType);
