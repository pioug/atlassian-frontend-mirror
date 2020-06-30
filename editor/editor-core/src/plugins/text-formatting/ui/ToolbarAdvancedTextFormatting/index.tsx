import React, { PureComponent } from 'react';

import { EditorView } from 'prosemirror-view';
import { defineMessages, InjectedIntlProps, injectIntl } from 'react-intl';

import { akEditorMenuZIndex } from '@atlaskit/editor-common';
import MoreIcon from '@atlaskit/icon/glyph/editor/more';

import { analyticsService } from '../../../../analytics';
import {
  clearFormatting as clearFormattingKeymap,
  toggleCode,
  toggleStrikethrough,
  toggleUnderline,
  tooltip,
} from '../../../../keymaps';
import DropdownMenu from '../../../../ui/DropdownMenu';
import { MenuItem } from '../../../../ui/DropdownMenu/types';
import {
  Separator,
  Shortcut,
  TriggerWrapper,
  Wrapper,
} from '../../../../ui/styles';
import ToolbarButton from '../../../../ui/ToolbarButton';
import { INPUT_METHOD } from '../../../analytics';
import { clearFormattingWithAnalytics } from '../../commands/clear-formatting';
import * as commands from '../../commands/text-formatting';
import { ClearFormattingState } from '../../pm-plugins/clear-formatting';
import { TextFormattingState } from '../../pm-plugins/main';

export interface Props {
  isDisabled?: boolean;
  editorView: EditorView;
  textFormattingState?: TextFormattingState;
  clearFormattingState?: ClearFormattingState;
  popupsMountPoint?: HTMLElement;
  popupsBoundariesElement?: HTMLElement;
  popupsScrollableElement?: HTMLElement;
  isReducedSpacing?: boolean;
}

export const messages = defineMessages({
  underline: {
    id: 'fabric.editor.underline',
    defaultMessage: 'Underline',
    description: 'Whether the text selection has underlined text',
  },
  strike: {
    id: 'fabric.editor.strike',
    defaultMessage: 'Strikethrough',
    description: 'Whether the text selection has crossed out text',
  },
  code: {
    id: 'fabric.editor.code',
    defaultMessage: 'Code',
    description: 'Whether the text selection has monospaced/code font',
  },
  subscript: {
    id: 'fabric.editor.subscript',
    defaultMessage: 'Subscript',
    description:
      'Whether the text selection is written below the line in a slightly smaller size',
  },
  superscript: {
    id: 'fabric.editor.superscript',
    defaultMessage: 'Superscript',
    description:
      'Whether the text selection is written above the line in a slightly smaller size',
  },
  clearFormatting: {
    id: 'fabric.editor.clearFormatting',
    defaultMessage: 'Clear formatting',
    description: 'Remove all rich text formatting from the selected text',
  },
  moreFormatting: {
    id: 'fabric.editor.moreFormatting',
    defaultMessage: 'More formatting',
    description:
      'Clicking this will show a menu with additional formatting options',
  },
});

export interface State {
  isOpen?: boolean;
}

class ToolbarAdvancedTextFormatting extends PureComponent<
  Props & InjectedIntlProps,
  State
> {
  state: State = {
    isOpen: false,
  };

  private onOpenChange = (attrs: any) => {
    this.setState({
      isOpen: attrs.isOpen,
    });
  };

  private handleTriggerClick = () => {
    this.onOpenChange({ isOpen: !this.state.isOpen });
  };

  render() {
    const { isOpen } = this.state;
    const {
      popupsMountPoint,
      popupsBoundariesElement,
      popupsScrollableElement,
      isReducedSpacing,
      textFormattingState = {},
      clearFormattingState = {},
      intl: { formatMessage },
    } = this.props;
    const {
      codeActive,
      underlineActive,
      strikeActive,
      subscriptActive,
      superscriptActive,
      codeDisabled,
      underlineDisabled,
      strikeDisabled,
      subscriptDisabled,
      superscriptDisabled,
    } = textFormattingState;
    const { formattingIsPresent } = clearFormattingState;
    const items = this.createItems();
    const labelMoreFormatting = formatMessage(messages.moreFormatting);

    const toolbarButtonFactory = (disabled: boolean) => (
      <ToolbarButton
        spacing={isReducedSpacing ? 'none' : 'default'}
        selected={
          isOpen ||
          underlineActive ||
          codeActive ||
          strikeActive ||
          subscriptActive ||
          superscriptActive
        }
        disabled={disabled}
        onClick={this.handleTriggerClick}
        title={labelMoreFormatting}
        iconBefore={
          <TriggerWrapper>
            <MoreIcon label={labelMoreFormatting} />
          </TriggerWrapper>
        }
      />
    );

    if (
      !this.props.isDisabled &&
      !(
        strikeDisabled &&
        !formattingIsPresent &&
        codeDisabled &&
        subscriptDisabled &&
        superscriptDisabled &&
        underlineDisabled
      ) &&
      items[0].items.length > 0
    ) {
      return (
        <Wrapper>
          <DropdownMenu
            items={items}
            onItemActivated={this.onItemActivated}
            onOpenChange={this.onOpenChange}
            mountTo={popupsMountPoint}
            boundariesElement={popupsBoundariesElement}
            scrollableElement={popupsScrollableElement}
            isOpen={isOpen}
            zIndex={akEditorMenuZIndex}
            fitHeight={188}
            fitWidth={136}
          >
            {toolbarButtonFactory(false)}
          </DropdownMenu>
          <Separator />
        </Wrapper>
      );
    } else {
      return (
        <Wrapper>
          <div>{toolbarButtonFactory(true)}</div>
          <Separator />
        </Wrapper>
      );
    }
  }

  private createItems = () => {
    const {
      textFormattingState,
      clearFormattingState,
      editorView,
      intl: { formatMessage },
    } = this.props;
    const { code, underline, subsup, strike } = editorView.state.schema.marks;
    let items: MenuItem[] = [];

    if (textFormattingState) {
      const {
        underlineHidden,
        codeHidden,
        strikeHidden,
        subscriptHidden,
        superscriptHidden,
      } = textFormattingState;
      if (!underlineHidden && underline) {
        this.addRecordToItems(
          items,
          formatMessage(messages.underline),
          'underline',
          tooltip(toggleUnderline),
        );
      }
      if (!strikeHidden && strike) {
        this.addRecordToItems(
          items,
          formatMessage(messages.strike),
          'strike',
          tooltip(toggleStrikethrough),
        );
      }
      if (!codeHidden && code) {
        this.addRecordToItems(
          items,
          formatMessage(messages.code),
          'code',
          tooltip(toggleCode),
        );
      }
      if (!subscriptHidden && subsup) {
        this.addRecordToItems(
          items,
          formatMessage(messages.subscript),
          'subscript',
        );
      }
      if (!superscriptHidden && subsup) {
        this.addRecordToItems(
          items,
          formatMessage(messages.superscript),
          'superscript',
        );
      }
    }
    if (clearFormattingState) {
      this.addRecordToItems(
        items,
        formatMessage(messages.clearFormatting),
        'clearFormatting',
        tooltip(clearFormattingKeymap),
        !clearFormattingState.formattingIsPresent,
      );
    }
    return [{ items }];
  };

  private addRecordToItems = (
    items: MenuItem[],
    content: string,
    value: string,
    tooltip?: string,
    isDisabled?: boolean,
  ) => {
    let active = false;
    let disabled = false;
    if (this.props.textFormattingState) {
      active =
        this.props.textFormattingState![
          `${value}Active` as keyof TextFormattingState
        ] || false;
      disabled =
        isDisabled ||
        this.props.textFormattingState![
          `${value}Disabled` as keyof TextFormattingState
        ] ||
        false;
    }
    items.push({
      key: value,
      content,
      elemAfter: tooltip ? <Shortcut>{tooltip}</Shortcut> : undefined,
      value: {
        name: value,
      },
      isActive: active,
      isDisabled: disabled,
    });
  };

  private onItemActivated = ({ item }: { item: MenuItem }) => {
    analyticsService.trackEvent(
      `atlassian.editor.format.${item.value.name}.button`,
    );

    const { state, dispatch } = this.props.editorView;
    switch (item.value.name) {
      case 'underline':
        commands.toggleUnderlineWithAnalytics({
          inputMethod: INPUT_METHOD.TOOLBAR,
        })(state, dispatch);
        break;
      case 'code':
        commands.toggleCodeWithAnalytics({ inputMethod: INPUT_METHOD.TOOLBAR })(
          state,
          dispatch,
        );
        break;
      case 'strike':
        commands.toggleStrikeWithAnalytics({
          inputMethod: INPUT_METHOD.TOOLBAR,
        })(state, dispatch);
        break;
      case 'subscript':
        commands.toggleSubscriptWithAnalytics({
          inputMethod: INPUT_METHOD.TOOLBAR,
        })(state, dispatch);
        break;
      case 'superscript':
        commands.toggleSuperscriptWithAnalytics({
          inputMethod: INPUT_METHOD.TOOLBAR,
        })(state, dispatch);
        break;
      case 'clearFormatting':
        clearFormattingWithAnalytics(INPUT_METHOD.TOOLBAR)(state, dispatch);
        break;
    }
    this.setState({ isOpen: false });
  };
}

export default injectIntl(ToolbarAdvancedTextFormatting);
