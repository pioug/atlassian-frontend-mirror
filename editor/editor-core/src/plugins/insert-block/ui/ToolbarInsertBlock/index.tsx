/** @jsx jsx */
import React from 'react';
import { jsx } from '@emotion/react';
import ReactDOM from 'react-dom';
import type { WrappedComponentProps } from 'react-intl-next';
import { injectIntl } from 'react-intl-next';

import { EmojiPicker as AkEmojiPicker } from '@atlaskit/emoji/picker';
import type { EmojiId } from '@atlaskit/emoji/types';
import { Popup } from '@atlaskit/editor-common/ui';
import type { ToolbarButtonRef } from '@atlaskit/editor-common/ui-menu';
import { ToolbarButton } from '@atlaskit/editor-common/ui-menu';
import {
  separatorStyles,
  buttonGroupStyle,
  wrapperStyle,
} from '@atlaskit/editor-common/styles';
import { akEditorMenuZIndex } from '@atlaskit/editor-shared-styles';
import {
  ACTION,
  ACTION_SUBJECT,
  ACTION_SUBJECT_ID,
  EVENT_TYPE,
  INPUT_METHOD,
} from '@atlaskit/editor-common/analytics';
import type { DropdownItem } from '@atlaskit/editor-plugin-block-type';
import type { OnInsert } from '../ElementBrowser/types';
import { messages } from './messages';
import type { Props, State } from './types';
import type { TOOLBAR_MENU_TYPE } from '@atlaskit/editor-common/types';
import { createItems } from './create-items';
import { BlockInsertMenu } from './block-insert-menu';
import { withReactEditorViewOuterListeners as withOuterListeners } from '@atlaskit/editor-common/ui-react';

/**
 * Checks if an element is detached (i.e. not in the current document)
 */
const isDetachedElement = (el: HTMLElement) => !document.body.contains(el);
const noop = () => {};

const EmojiPickerWithListeners = withOuterListeners(AkEmojiPicker);

export class ToolbarInsertBlock extends React.PureComponent<
  Props & WrappedComponentProps,
  State
> {
  private dropdownButtonRef?: HTMLElement;
  private emojiButtonRef?: HTMLElement;
  private plusButtonRef?: HTMLElement;

  state: State = {
    isPlusMenuOpen: false,
    emojiPickerOpen: false,
    isOpenedByKeyboard: false,
    buttons: [],
    dropdownItems: [],
  };

  static getDerivedStateFromProps(
    props: Props & WrappedComponentProps,
    state: State,
  ): State | null {
    const [buttons, dropdownItems] = createItems({
      isTypeAheadAllowed: props.isTypeAheadAllowed,
      tableSupported: props.tableSupported,
      mediaUploadsEnabled: props.mediaUploadsEnabled,
      mediaSupported: props.mediaSupported,
      imageUploadSupported: props.imageUploadSupported,
      imageUploadEnabled: props.imageUploadEnabled,
      mentionsSupported: props.mentionsSupported,
      mentionsDisabled: props.mentionsDisabled,
      actionSupported: props.actionSupported,
      decisionSupported: props.decisionSupported,
      linkSupported: props.linkSupported,
      linkDisabled: props.linkDisabled,
      emojiDisabled: props.emojiDisabled,
      nativeStatusSupported: props.nativeStatusSupported,
      dateEnabled: props.dateEnabled,
      placeholderTextEnabled: props.placeholderTextEnabled,
      horizontalRuleEnabled: props.horizontalRuleEnabled,
      layoutSectionEnabled: props.layoutSectionEnabled,
      expandEnabled: props.expandEnabled,
      showElementBrowserLink: props.showElementBrowserLink,
      emojiProvider: props.emojiProvider,
      availableWrapperBlockTypes: props.availableWrapperBlockTypes,
      insertMenuItems: props.insertMenuItems,
      schema: props.editorView.state.schema,
      numberOfButtons: props.buttons,
      formatMessage: props.intl.formatMessage,
      isNewMenuEnabled: props.replacePlusMenuWithElementBrowser,
    });

    return {
      ...state,
      buttons,
      dropdownItems,
    };
  }

  componentDidUpdate(prevProps: Props) {
    // If number of visible buttons changed, close emoji picker
    if (prevProps.buttons !== this.props.buttons) {
      this.setState({ emojiPickerOpen: false });
    }

    if (this.state.isOpenedByKeyboard) {
      const downArrowEvent = new KeyboardEvent('keydown', {
        bubbles: true,
        key: 'ArrowDown',
      });
      this.dropdownButtonRef?.dispatchEvent(downArrowEvent);
      this.setState({ ...this.state, isOpenedByKeyboard: false });
    }
  }

  private onOpenChange = (attrs: {
    isPlusMenuOpen: boolean;
    open?: boolean;
  }) => {
    const state = {
      isPlusMenuOpen: attrs.isPlusMenuOpen,
      emojiPickerOpen: this.state.emojiPickerOpen,
    };
    if (this.state.emojiPickerOpen && !attrs.open) {
      state.emojiPickerOpen = false;
    }
    this.setState(state, () => {
      const { dispatchAnalyticsEvent } = this.props;
      if (!dispatchAnalyticsEvent) {
        return;
      }

      const { isPlusMenuOpen } = this.state;

      if (isPlusMenuOpen) {
        return dispatchAnalyticsEvent({
          action: ACTION.OPENED,
          actionSubject: ACTION_SUBJECT.PLUS_MENU as any,
          eventType: EVENT_TYPE.UI,
        });
      }
      return dispatchAnalyticsEvent({
        action: ACTION.CLOSED,
        actionSubject: ACTION_SUBJECT.PLUS_MENU as any,
        eventType: EVENT_TYPE.UI,
      });
    });
  };

  private togglePlusMenuVisibility = (event?: KeyboardEvent) => {
    const { isPlusMenuOpen } = this.state;
    this.onOpenChange({ isPlusMenuOpen: !isPlusMenuOpen });
    if (event?.key === 'Escape') {
      (this.plusButtonRef || this.dropdownButtonRef)?.focus();
    }
  };

  private toggleEmojiPicker = (
    inputMethod:
      | TOOLBAR_MENU_TYPE
      | INPUT_METHOD.KEYBOARD = INPUT_METHOD.TOOLBAR,
  ) => {
    this.setState(
      (prevState) => ({ emojiPickerOpen: !prevState.emojiPickerOpen }),
      () => {
        if (this.state.emojiPickerOpen) {
          const { dispatchAnalyticsEvent } = this.props;
          if (dispatchAnalyticsEvent) {
            dispatchAnalyticsEvent({
              action: ACTION.OPENED,
              actionSubject: ACTION_SUBJECT.PICKER,
              actionSubjectId: ACTION_SUBJECT_ID.PICKER_EMOJI,
              attributes: { inputMethod },
              eventType: EVENT_TYPE.UI,
            });
          }
        }
      },
    );
  };

  private handleEmojiPressEscape = () => {
    this.toggleEmojiPicker(INPUT_METHOD.KEYBOARD);
    this.emojiButtonRef?.focus();
  };

  private handleEmojiClickOutside = (e: MouseEvent) => {
    // Ignore click events for detached elements.
    // Workaround for FS-1322 - where two onClicks fire - one when the upload button is
    // still in the document, and one once it's detached. Does not always occur, and
    // may be a side effect of a react render optimisation
    if (e.target && !isDetachedElement(e.target as HTMLElement)) {
      this.toggleEmojiPicker(INPUT_METHOD.TOOLBAR);
    }
  };

  private renderPopup() {
    const { emojiPickerOpen } = this.state;
    const {
      popupsMountPoint,
      popupsBoundariesElement,
      popupsScrollableElement,
      emojiProvider,
      replacePlusMenuWithElementBrowser,
    } = this.props;
    const dropdownEmoji = this.state.dropdownItems.some(
      ({ value: { name } }) => name === 'emoji',
    );
    const dropDownButtonRef = replacePlusMenuWithElementBrowser
      ? this.plusButtonRef
      : this.dropdownButtonRef;
    const ref = dropdownEmoji ? dropDownButtonRef : this.emojiButtonRef;

    if (!emojiPickerOpen || !ref || !emojiProvider) {
      return null;
    }

    return (
      <Popup
        target={ref}
        fitHeight={350}
        fitWidth={350}
        offset={[0, 3]}
        mountTo={popupsMountPoint}
        boundariesElement={popupsBoundariesElement}
        scrollableElement={popupsScrollableElement}
        focusTrap
        zIndex={akEditorMenuZIndex}
      >
        <EmojiPickerWithListeners
          emojiProvider={emojiProvider}
          onSelection={this.handleSelectedEmoji}
          handleClickOutside={this.handleEmojiClickOutside}
          handleEscapeKeydown={this.handleEmojiPressEscape}
        />
      </Popup>
    );
  }

  private handleEmojiButtonRef = (button: ToolbarButtonRef): void => {
    const ref = ReactDOM.findDOMNode(button) as HTMLElement | null;
    if (ref) {
      this.emojiButtonRef = ref;
    }
  };

  private handlePlusButtonRef = (button: ToolbarButtonRef): void => {
    const ref = ReactDOM.findDOMNode(button) as HTMLElement | null;
    if (ref) {
      this.plusButtonRef = ref;
    }
  };

  private handleDropDownButtonRef = (button: ToolbarButtonRef) => {
    const ref = ReactDOM.findDOMNode(button) as HTMLElement | null;
    if (ref) {
      this.dropdownButtonRef = ref;
    }
  };

  render() {
    const { buttons, dropdownItems, emojiPickerOpen } = this.state;
    const { isDisabled, isReducedSpacing } = this.props;

    if (buttons.length === 0 && dropdownItems.length === 0) {
      return null;
    }

    return (
      <span css={buttonGroupStyle}>
        {buttons.map((btn) => (
          <ToolbarButton
            item={btn}
            testId={String(btn.content)}
            ref={btn.value.name === 'emoji' ? this.handleEmojiButtonRef : noop}
            key={btn.value.name}
            spacing={isReducedSpacing ? 'none' : 'default'}
            disabled={isDisabled || btn.isDisabled}
            iconBefore={btn.elemBefore}
            selected={
              (btn.value.name === 'emoji' && emojiPickerOpen) || btn.isActive
            }
            title={btn.title}
            aria-label={btn['aria-label']}
            aria-haspopup={btn['aria-haspopup']}
            aria-keyshortcuts={btn['aria-keyshortcuts']}
            onItemClick={this.insertToolbarMenuItem}
          />
        ))}
        <span css={wrapperStyle}>
          {this.renderPopup()}
          <BlockInsertMenu
            popupsMountPoint={this.props.popupsMountPoint}
            popupsBoundariesElement={this.props.popupsBoundariesElement}
            popupsScrollableElement={this.props.popupsScrollableElement}
            disabled={this.props.isDisabled ?? false}
            editorView={this.props.editorView}
            spacing={this.props.isReducedSpacing ? 'none' : 'default'}
            label={this.props.intl.formatMessage(messages.insertMenu)}
            open={this.state.isPlusMenuOpen}
            plusButtonRef={this.plusButtonRef}
            items={this.state.dropdownItems}
            onRef={this.handleDropDownButtonRef}
            onPlusButtonRef={this.handlePlusButtonRef}
            onClick={this.handleClick}
            onKeyDown={this.handleOpenByKeyboard}
            onItemActivated={this.insertInsertMenuItem}
            onInsert={this.insertInsertMenuItem as OnInsert}
            onOpenChange={this.onOpenChange}
            togglePlusMenuVisibility={this.togglePlusMenuVisibility}
            replacePlusMenuWithElementBrowser={
              this.props.replacePlusMenuWithElementBrowser ?? false
            }
            showElementBrowserLink={this.props.showElementBrowserLink || false}
            pluginInjectionApi={this.props.pluginInjectionApi}
          />
        </span>
        {this.props.showSeparator && <span css={separatorStyles} />}
      </span>
    );
  }

  private handleClick = () => {
    this.togglePlusMenuVisibility();
  };

  private handleOpenByKeyboard = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      this.setState({ ...this.state, isOpenedByKeyboard: true });
      event.preventDefault();
      this.togglePlusMenuVisibility();
    }
  };

  private toggleLinkPanel = (inputMethod: TOOLBAR_MENU_TYPE): boolean => {
    const { pluginInjectionApi } = this.props;

    return (
      pluginInjectionApi?.core.actions.execute(
        pluginInjectionApi?.hyperlink?.commands.showLinkToolbar(inputMethod),
      ) ?? false
    );
  };

  private insertMention = (inputMethod: TOOLBAR_MENU_TYPE): boolean => {
    const { editorView, pluginInjectionApi } = this.props;
    if (!editorView) {
      return true;
    }
    const pluginState = pluginInjectionApi?.mention?.sharedState.currentState();
    if (pluginState && pluginState.canInsertMention === false) {
      return false;
    }
    return Boolean(
      pluginInjectionApi?.mention?.actions?.openTypeAhead(inputMethod),
    );
  };

  private insertTable = (inputMethod: TOOLBAR_MENU_TYPE): boolean => {
    const { pluginInjectionApi, editorView } = this.props;

    const { state, dispatch } = editorView;

    return (
      pluginInjectionApi?.table?.actions.insertTable?.({
        action: ACTION.INSERTED,
        actionSubject: ACTION_SUBJECT.DOCUMENT,
        actionSubjectId: ACTION_SUBJECT_ID.TABLE,
        attributes: { inputMethod },
        eventType: EVENT_TYPE.TRACK,
      })(state, dispatch) ?? false
    );
  };

  private createDate = (inputMethod: TOOLBAR_MENU_TYPE): boolean => {
    const { pluginInjectionApi } = this.props;
    pluginInjectionApi?.core.actions.execute(
      pluginInjectionApi?.date?.commands?.insertDate({
        inputMethod,
      }),
    );

    return true;
  };

  private createPlaceholderText = (): boolean => {
    const { editorView, pluginInjectionApi } = this.props;
    pluginInjectionApi?.placeholderText?.actions.showPlaceholderFloatingToolbar(
      editorView.state,
      editorView.dispatch,
    );
    return true;
  };

  private insertLayoutColumns = (inputMethod: TOOLBAR_MENU_TYPE): boolean => {
    const { editorView, pluginInjectionApi } = this.props;
    pluginInjectionApi?.layout?.actions.insertLayoutColumns(inputMethod)(
      editorView.state,
      editorView.dispatch,
    );
    return true;
  };

  private createStatus = (inputMethod: TOOLBAR_MENU_TYPE): boolean => {
    const { pluginInjectionApi, editorView } = this.props;
    return (
      pluginInjectionApi?.status?.actions?.updateStatus(inputMethod)(
        editorView.state,
        editorView.dispatch,
      ) ?? false
    );
  };

  private openMediaPicker = (inputMethod: TOOLBAR_MENU_TYPE): boolean => {
    const { onShowMediaPicker, dispatchAnalyticsEvent } = this.props;
    if (onShowMediaPicker) {
      onShowMediaPicker();
      if (dispatchAnalyticsEvent) {
        dispatchAnalyticsEvent({
          action: ACTION.OPENED,
          actionSubject: ACTION_SUBJECT.PICKER,
          actionSubjectId: ACTION_SUBJECT_ID.PICKER_CLOUD,
          attributes: { inputMethod },
          eventType: EVENT_TYPE.UI,
        });
      }
    }
    return true;
  };

  private insertTaskDecision =
    (name: 'action' | 'decision', inputMethod: TOOLBAR_MENU_TYPE) =>
    (): boolean => {
      const {
        editorView: { state, dispatch },
        pluginInjectionApi,
      } = this.props;
      const listType = name === 'action' ? 'taskList' : 'decisionList';

      return (
        pluginInjectionApi?.taskDecision?.actions.insertTaskDecision(
          listType,
          inputMethod,
        )(state, dispatch) ?? false
      );
    };

  private insertHorizontalRule = (inputMethod: TOOLBAR_MENU_TYPE): boolean => {
    const {
      editorView: { state, dispatch },
      pluginInjectionApi,
    } = this.props;

    return (
      pluginInjectionApi?.rule?.actions.insertHorizontalRule(inputMethod)(
        state,
        dispatch,
      ) ?? false
    );
  };

  private insertExpand = (): boolean => {
    const {
      editorView: { state, dispatch },
      pluginInjectionApi,
    } = this.props;
    return (
      pluginInjectionApi?.expand?.actions.insertExpand(state, dispatch) ?? false
    );
  };

  private insertBlockType = (itemName: string) => () => {
    const { editorView, onInsertBlockType } = this.props;
    const { state, dispatch } = editorView;

    onInsertBlockType!(itemName)(state, dispatch);
    return true;
  };

  private handleSelectedEmoji = (emojiId: EmojiId): boolean => {
    const { pluginInjectionApi } = this.props;
    this.props.editorView.focus();
    pluginInjectionApi?.core.actions.execute(
      pluginInjectionApi.emoji?.commands.insertEmoji(
        emojiId,
        INPUT_METHOD.PICKER,
      ),
    );
    this.toggleEmojiPicker();
    return true;
  };

  private openElementBrowser = () => {
    const { pluginInjectionApi } = this.props;

    pluginInjectionApi?.core.actions.execute(
      pluginInjectionApi?.quickInsert?.commands.openElementBrowserModal,
    );
  };

  private onItemActivated = ({
    item,
    inputMethod,
  }: {
    item: any;
    inputMethod: TOOLBAR_MENU_TYPE;
  }): void => {
    const { editorView, editorActions, handleImageUpload, expandEnabled } =
      this.props;

    // need to do this before inserting nodes so scrollIntoView works properly
    if (!editorView.hasFocus()) {
      editorView.focus();
    }

    switch (item.value.name) {
      case 'link':
        this.toggleLinkPanel(inputMethod);
        break;
      case 'table':
        this.insertTable(inputMethod);
        break;
      case 'image upload':
        if (handleImageUpload) {
          const { state, dispatch } = editorView;
          handleImageUpload()(state, dispatch);
        }
        break;
      case 'media':
        this.openMediaPicker(inputMethod);
        break;
      case 'mention':
        this.insertMention(inputMethod);
        break;
      case 'emoji':
        this.toggleEmojiPicker(inputMethod);
        break;
      case 'codeblock':
      case 'blockquote':
      case 'panel':
        this.insertBlockType(item.value.name)();
        break;
      case 'action':
      case 'decision':
        this.insertTaskDecision(item.value.name, inputMethod)();
        break;

      case 'horizontalrule':
        this.insertHorizontalRule(inputMethod);
        break;
      case 'macro':
        this.openElementBrowser();
        break;
      case 'date':
        this.createDate(inputMethod);
        break;
      case 'placeholder text':
        this.createPlaceholderText();
        break;
      case 'layout':
        this.insertLayoutColumns(inputMethod);
        break;
      case 'status':
        this.createStatus(inputMethod);
        break;

      // https://product-fabric.atlassian.net/browse/ED-8053
      // @ts-ignore: OK to fallthrough to default
      case 'expand':
        if (expandEnabled) {
          this.insertExpand();
          break;
        }

      // eslint-disable-next-line no-fallthrough
      default:
        if (item && item.onClick) {
          item.onClick(editorActions);
          break;
        }
    }
    this.setState({ isPlusMenuOpen: false });
  };

  private insertToolbarMenuItem = (btn: any) =>
    this.onItemActivated({
      item: btn,
      inputMethod: INPUT_METHOD.TOOLBAR,
    });

  private insertInsertMenuItem = ({ item }: { item: DropdownItem }) =>
    this.onItemActivated({
      item,
      inputMethod: INPUT_METHOD.INSERT_MENU,
    });
}

export default injectIntl(ToolbarInsertBlock);
