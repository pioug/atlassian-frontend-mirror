import React from 'react';
import { PureComponent } from 'react';
import { injectIntl, InjectedIntlProps } from 'react-intl';
import { EditorView } from 'prosemirror-view';
import BulletListIcon from '@atlaskit/icon/glyph/editor/bullet-list';
import NumberListIcon from '@atlaskit/icon/glyph/editor/number-list';
import ExpandIcon from '@atlaskit/icon/glyph/chevron-down';
import {
  toggleBulletList as toggleBulletListKeymap,
  toggleOrderedList as toggleOrderedListKeymap,
  tooltip,
  ToolTipContent,
} from '../../../../keymaps';
import ToolbarButton, { TOOLBAR_BUTTON } from '../../../../ui/ToolbarButton';
import DropdownMenu from '../../../../ui/DropdownMenu';
import {
  ButtonGroup,
  Separator,
  Wrapper,
  ExpandIconWrapper,
  Shortcut,
} from '../../../../ui/styles';
import { toggleBulletList, toggleOrderedList } from '../../commands';
import { messages } from '../../messages';
import { INPUT_METHOD } from '../../../analytics';
import { DropdownItem } from '../../../block-type/ui/ToolbarBlockType';
import { TOOLBAR_MENU_TYPE } from '../../../insert-block/ui/ToolbarInsertBlock/types';

export interface Props {
  editorView: EditorView;
  bulletListActive?: boolean;
  bulletListDisabled?: boolean;
  orderedListActive?: boolean;
  orderedListDisabled?: boolean;
  disabled?: boolean;
  isSmall?: boolean;
  isSeparator?: boolean;
  isReducedSpacing?: boolean;
  popupsMountPoint?: HTMLElement;
  popupsBoundariesElement?: HTMLElement;
  popupsScrollableElement?: HTMLElement;
}

export interface State {
  isDropdownOpen: boolean;
}

class ToolbarLists extends PureComponent<Props & InjectedIntlProps, State> {
  state: State = {
    isDropdownOpen: false,
  };

  private onOpenChange = (attrs: any) => {
    this.setState({
      isDropdownOpen: attrs.isDropdownOpen,
    });
  };

  private handleTriggerClick = () => {
    this.onOpenChange({ isDropdownOpen: !this.state.isDropdownOpen });
  };

  createItems = () => {
    const {
      bulletListDisabled,
      orderedListDisabled,
      bulletListActive,
      orderedListActive,
      intl: { formatMessage },
    } = this.props;
    const labelUnorderedList = formatMessage(messages.unorderedList);
    const labelOrderedList = formatMessage(messages.orderedList);

    let items = [
      {
        key: 'unorderedList',
        content: labelUnorderedList,
        value: { name: 'bullet_list' },
        isDisabled: bulletListDisabled,
        isActive: Boolean(bulletListActive),
        elemAfter: <Shortcut>{tooltip(toggleBulletListKeymap)}</Shortcut>,
      },
      {
        key: 'orderedList',
        content: labelOrderedList,
        value: { name: 'ordered_list' },
        isDisabled: orderedListDisabled,
        isActive: Boolean(orderedListActive),
        elemAfter: <Shortcut>{tooltip(toggleOrderedListKeymap)}</Shortcut>,
      },
    ];
    return [{ items }];
  };

  render() {
    const {
      disabled,
      isSmall,
      isReducedSpacing,
      isSeparator,
      bulletListActive,
      bulletListDisabled,
      orderedListActive,
      orderedListDisabled,
      intl: { formatMessage },
    } = this.props;
    const { isDropdownOpen } = this.state;
    if (!isSmall) {
      const labelUnorderedList = formatMessage(messages.unorderedList);
      const labelOrderedList = formatMessage(messages.orderedList);
      return (
        <ButtonGroup width={isReducedSpacing ? 'small' : 'large'}>
          <ToolbarButton
            buttonId={TOOLBAR_BUTTON.BULLET_LIST}
            spacing={isReducedSpacing ? 'none' : 'default'}
            onClick={this.handleBulletListClick}
            selected={bulletListActive}
            disabled={bulletListDisabled || disabled}
            title={
              <ToolTipContent
                description={labelUnorderedList}
                keymap={toggleBulletListKeymap}
              />
            }
            iconBefore={<BulletListIcon label={labelUnorderedList} />}
          />
          <ToolbarButton
            buttonId={TOOLBAR_BUTTON.ORDERED_LIST}
            spacing={isReducedSpacing ? 'none' : 'default'}
            onClick={this.handleOrderedListClick}
            selected={orderedListActive}
            disabled={orderedListDisabled || disabled}
            title={
              <ToolTipContent
                description={labelOrderedList}
                keymap={toggleOrderedListKeymap}
              />
            }
            iconBefore={<NumberListIcon label={labelOrderedList} />}
          />
          {isSeparator && <Separator />}
        </ButtonGroup>
      );
    } else {
      const items = this.createItems();
      const {
        popupsMountPoint,
        popupsBoundariesElement,
        popupsScrollableElement,
      } = this.props;

      const labelLists = formatMessage(messages.lists);
      return (
        <Wrapper>
          <DropdownMenu
            items={items}
            onItemActivated={this.onItemActivated}
            mountTo={popupsMountPoint}
            boundariesElement={popupsBoundariesElement}
            scrollableElement={popupsScrollableElement}
            isOpen={isDropdownOpen}
            onOpenChange={this.onOpenChange}
            fitHeight={188}
            fitWidth={175}
          >
            <ToolbarButton
              spacing={isReducedSpacing ? 'none' : 'default'}
              selected={bulletListActive || orderedListActive}
              disabled={disabled}
              onClick={this.handleTriggerClick}
              title={labelLists}
              iconBefore={
                <Wrapper>
                  <BulletListIcon label={labelLists} />
                  <ExpandIconWrapper>
                    <ExpandIcon label="" />
                  </ExpandIconWrapper>
                </Wrapper>
              }
            />
          </DropdownMenu>
          {isSeparator && <Separator />}
        </Wrapper>
      );
    }
  }

  private handleBulletListClick = () => {
    if (!this.props.bulletListDisabled) {
      if (toggleBulletList(this.props.editorView, INPUT_METHOD.TOOLBAR)) {
        return true;
      }
    }
    return false;
  };

  private handleOrderedListClick = () => {
    if (!this.props.orderedListDisabled) {
      if (toggleOrderedList(this.props.editorView, INPUT_METHOD.TOOLBAR)) {
        return true;
      }
    }
    return false;
  };

  private onItemActivated = ({
    item,
  }: {
    item: DropdownItem;
    inputMethod: TOOLBAR_MENU_TYPE;
  }) => {
    this.setState({ isDropdownOpen: false });
    switch (item.value.name) {
      case 'bullet_list':
        this.handleBulletListClick();
        break;
      case 'ordered_list':
        this.handleOrderedListClick();
        break;
    }
  };
}

export default injectIntl(ToolbarLists);
