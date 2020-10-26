import React, { ReactInstance } from 'react';
import ReactDOM from 'react-dom';
import { InjectedIntlProps, injectIntl } from 'react-intl';

import { EmojiPicker as AkEmojiPicker } from '@atlaskit/emoji/picker';
import { EmojiId } from '@atlaskit/emoji/types';
import { Popup } from '@atlaskit/editor-common';
import { akEditorMenuZIndex } from '@atlaskit/editor-shared-styles';
import DropdownMenu from '../../../../ui/DropdownMenu';
import ToolbarButton from '../../../../ui/ToolbarButton';
import { Separator, ButtonGroup, Wrapper } from '../../../../ui/styles';
import { createTable } from '../../../table/commands';
import { insertDate, openDatePicker } from '../../../date/actions';
import { openElementBrowserModal } from '../../../quick-insert/commands';
import { showPlaceholderFloatingToolbar } from '../../../placeholder-text/actions';
import { createHorizontalRule } from '../../../rule/pm-plugins/input-rule';
import { insertLayoutColumnsWithAnalytics } from '../../../layout/actions';
import { insertTaskDecision } from '../../../tasks-and-decisions/commands';
import { insertExpand } from '../../../expand/commands';
import { showLinkToolbar } from '../../../hyperlink/commands';
import { insertMentionQuery } from '../../../mentions/commands/insert-mention-query';
import { updateStatusWithAnalytics } from '../../../status/actions';
import {
  ACTION,
  ACTION_SUBJECT,
  ACTION_SUBJECT_ID,
  EVENT_TYPE,
  INPUT_METHOD,
  withAnalytics as commandWithAnalytics,
} from '../../../analytics';
import { insertEmoji } from '../../../emoji/commands/insert-emoji';
import { DropdownItem } from '../../../block-type/ui/ToolbarBlockType';

import InsertMenu from '../../../../ui/ElementBrowser/InsertMenu';
import { OnInsert } from '../../../../ui/ElementBrowser/types';

import { messages } from './messages';
import { Props, State, TOOLBAR_MENU_TYPE } from './types';
import { createItems, BlockMenuItem } from './create-items';
import { DropDownButton } from './dropdown-button';
import memoizeOne from 'memoize-one';

/**
 * Checks if an element is detached (i.e. not in the current document)
 */
const isDetachedElement = (el: HTMLElement) => !document.body.contains(el);
const noop = () => {};

class ToolbarInsertBlock extends React.PureComponent<
  Props & InjectedIntlProps,
  State
> {
  private dropdownButtonRef?: HTMLElement;
  private pickerRef?: ReactInstance;
  private emojiButtonRef?: HTMLElement;
  private plusButtonRef?: HTMLElement;

  state: State = {
    isPlusMenuOpen: false,
    emojiPickerOpen: false,
    buttons: [],
    dropdownItems: [],
  };

  static getDerivedStateFromProps(
    props: Props & InjectedIntlProps,
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
      macroProvider: props.macroProvider,
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

  private togglePlusMenuVisibility = () => {
    const { isPlusMenuOpen } = this.state;
    this.onOpenChange({ isPlusMenuOpen: !isPlusMenuOpen });
  };

  private toggleEmojiPicker = (
    inputMethod: TOOLBAR_MENU_TYPE = INPUT_METHOD.TOOLBAR,
  ) => {
    this.setState(
      prevState => ({ emojiPickerOpen: !prevState.emojiPickerOpen }),
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

  private renderPopup() {
    const { emojiPickerOpen } = this.state;
    const {
      popupsMountPoint,
      popupsBoundariesElement,
      popupsScrollableElement,
      emojiProvider,
    } = this.props;
    const dropdownEmoji = this.state.dropdownItems.some(
      ({ value: { name } }) => name === 'emoji',
    );

    const ref = dropdownEmoji ? this.dropdownButtonRef : this.emojiButtonRef;

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
      >
        <AkEmojiPicker
          emojiProvider={emojiProvider}
          onSelection={this.handleSelectedEmoji}
          onPickerRef={this.onPickerRef}
        />
      </Popup>
    );
  }

  private getLegacyInsertMenu() {
    const { isPlusMenuOpen, dropdownItems } = this.state;
    const {
      popupsMountPoint,
      popupsBoundariesElement,
      popupsScrollableElement,
      isDisabled,
      isReducedSpacing,
      intl: { formatMessage },
    } = this.props;

    const dropDownLabel = formatMessage(messages.insertMenu);
    const spacing = isReducedSpacing ? 'none' : 'default';

    return (
      <DropdownMenu
        items={this.toDropdownItems(dropdownItems)}
        onItemActivated={this.insertInsertMenuItem}
        onOpenChange={this.onOpenChange}
        mountTo={popupsMountPoint}
        boundariesElement={popupsBoundariesElement}
        scrollableElement={popupsScrollableElement}
        isOpen={isPlusMenuOpen}
        fitHeight={188}
        fitWidth={175}
        zIndex={akEditorMenuZIndex}
      >
        <DropDownButton
          handleRef={this.handleDropDownButtonRef}
          selected={isPlusMenuOpen}
          disabled={isDisabled}
          onClick={this.togglePlusMenuVisibility}
          spacing={spacing}
          label={dropDownLabel}
        />
      </DropdownMenu>
    );
  }

  private getElementBrowserForInsertMenu() {
    const { isPlusMenuOpen, dropdownItems } = this.state;
    const {
      popupsMountPoint,
      popupsBoundariesElement,
      popupsScrollableElement,
      isDisabled,
      isReducedSpacing,
      intl: { formatMessage },
      editorView,
    } = this.props;

    const dropDownLabel = formatMessage(messages.insertMenu);

    const spacing = isReducedSpacing ? 'none' : 'default';

    return (
      <>
        {isPlusMenuOpen && (
          <Popup
            target={this.plusButtonRef}
            fitHeight={500}
            fitWidth={350}
            offset={[0, 3]}
            mountTo={popupsMountPoint}
            boundariesElement={popupsBoundariesElement}
            scrollableElement={popupsScrollableElement}
          >
            <InsertMenu
              editorView={editorView}
              dropdownItems={dropdownItems}
              onInsert={this.insertInsertMenuItem as OnInsert}
              toggleVisiblity={this.togglePlusMenuVisibility}
            />
          </Popup>
        )}
        <DropDownButton
          handleRef={this.handlePlusButtonRef}
          selected={isPlusMenuOpen}
          disabled={isDisabled}
          onClick={this.togglePlusMenuVisibility}
          spacing={spacing}
          label={dropDownLabel}
        />
      </>
    );
  }

  private renderInsertMenu() {
    const { isPlusMenuOpen, dropdownItems } = this.state;
    const {
      isDisabled,
      isReducedSpacing,
      intl: { formatMessage },
      replacePlusMenuWithElementBrowser,
    } = this.props;

    const dropDownLabel = formatMessage(messages.insertMenu);
    const spacing = isReducedSpacing ? 'none' : 'default';

    if (dropdownItems.length === 0 || isDisabled) {
      return (
        <div>
          <DropDownButton
            handleRef={this.handleDropDownButtonRef}
            selected={isPlusMenuOpen}
            disabled={isDisabled}
            onClick={this.togglePlusMenuVisibility}
            spacing={spacing}
            label={dropDownLabel}
          />
        </div>
      );
    }

    return replacePlusMenuWithElementBrowser
      ? this.getElementBrowserForInsertMenu()
      : this.getLegacyInsertMenu();
  }

  private handleEmojiButtonRef = (button: ToolbarButton | null): void => {
    const ref = ReactDOM.findDOMNode(button) as HTMLElement | null;
    if (ref) {
      this.emojiButtonRef = ref;
    }
  };

  private handlePlusButtonRef = (button: ToolbarButton | null): void => {
    const ref = ReactDOM.findDOMNode(button) as HTMLElement | null;
    if (ref) {
      this.plusButtonRef = ref;
    }
  };

  private handleDropDownButtonRef = (button: ToolbarButton | null) => {
    const ref = ReactDOM.findDOMNode(button) as HTMLElement | null;
    if (ref) {
      this.dropdownButtonRef = ref;
    }
  };

  private onPickerRef = (ref: any) => {
    if (ref) {
      document.addEventListener('click', this.handleClickOutside);
    } else {
      document.removeEventListener('click', this.handleClickOutside);
    }
    this.pickerRef = ref;
  };

  private handleClickOutside = (e: MouseEvent) => {
    const picker = this.pickerRef && ReactDOM.findDOMNode(this.pickerRef);
    // Ignore click events for detached elements.
    // Workaround for FS-1322 - where two onClicks fire - one when the upload button is
    // still in the document, and one once it's detached. Does not always occur, and
    // may be a side effect of a react render optimisation
    if (
      !picker ||
      (e.target &&
        !isDetachedElement(e.target as HTMLElement) &&
        !picker.contains(e.target as HTMLElement))
    ) {
      this.toggleEmojiPicker();
    }
  };

  private toDropdownItems = memoizeOne((items: BlockMenuItem[]) => [{ items }]);

  render() {
    const { buttons, dropdownItems } = this.state;
    const { isDisabled, isReducedSpacing } = this.props;

    if (buttons.length === 0 && dropdownItems.length === 0) {
      return null;
    }

    return (
      <ButtonGroup width={isReducedSpacing ? 'small' : 'large'}>
        {buttons.map(btn => (
          <ToolbarButton
            item={btn}
            ref={btn.value.name === 'emoji' ? this.handleEmojiButtonRef : noop}
            key={btn.value.name}
            spacing={isReducedSpacing ? 'none' : 'default'}
            disabled={isDisabled || btn.isDisabled}
            iconBefore={btn.elemBefore}
            selected={btn.isActive}
            title={btn.title}
            onItemClick={this.insertToolbarMenuItem}
          />
        ))}
        <Wrapper>
          {this.renderPopup()}
          {this.renderInsertMenu()}
        </Wrapper>
        {this.props.showSeparator && <Separator />}
      </ButtonGroup>
    );
  }

  private toggleLinkPanel = (inputMethod: TOOLBAR_MENU_TYPE): boolean => {
    const { editorView } = this.props;
    showLinkToolbar(inputMethod)(editorView.state, editorView.dispatch);
    return true;
  };

  private insertMention = (inputMethod: TOOLBAR_MENU_TYPE): boolean => {
    const { editorView } = this.props;
    insertMentionQuery(inputMethod)(editorView.state, editorView.dispatch);
    return true;
  };

  private insertTable = (inputMethod: TOOLBAR_MENU_TYPE): boolean => {
    const { editorView } = this.props;
    return commandWithAnalytics({
      action: ACTION.INSERTED,
      actionSubject: ACTION_SUBJECT.DOCUMENT,
      actionSubjectId: ACTION_SUBJECT_ID.TABLE,
      attributes: { inputMethod },
      eventType: EVENT_TYPE.TRACK,
    })(createTable)(editorView.state, editorView.dispatch);
  };

  private createDate = (inputMethod: TOOLBAR_MENU_TYPE): boolean => {
    const { editorView } = this.props;
    insertDate(undefined, inputMethod)(editorView.state, editorView.dispatch);
    openDatePicker()(editorView.state, editorView.dispatch);
    return true;
  };

  private createPlaceholderText = (): boolean => {
    const { editorView } = this.props;
    showPlaceholderFloatingToolbar(editorView.state, editorView.dispatch);
    return true;
  };

  private insertLayoutColumns = (inputMethod: TOOLBAR_MENU_TYPE): boolean => {
    const { editorView } = this.props;
    insertLayoutColumnsWithAnalytics(inputMethod)(
      editorView.state,
      editorView.dispatch,
    );
    return true;
  };

  private createStatus = (inputMethod: TOOLBAR_MENU_TYPE): boolean => {
    const { editorView } = this.props;
    updateStatusWithAnalytics(inputMethod)(
      editorView.state,
      editorView.dispatch,
    );
    return true;
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

  private insertTaskDecision = (
    name: 'action' | 'decision',
    inputMethod: TOOLBAR_MENU_TYPE,
  ) => (): boolean => {
    const { editorView } = this.props;
    if (!editorView) {
      return false;
    }
    const listType = name === 'action' ? 'taskList' : 'decisionList';
    insertTaskDecision(
      editorView,
      listType,
      inputMethod,
    )(editorView.state, editorView.dispatch);
    return true;
  };

  private insertHorizontalRule = (inputMethod: TOOLBAR_MENU_TYPE): boolean => {
    const { editorView } = this.props;

    const tr = createHorizontalRule(
      editorView.state,
      editorView.state.selection.from,
      editorView.state.selection.to,
      inputMethod,
    );

    if (tr) {
      editorView.dispatch(tr);
      return true;
    }

    return false;
  };

  private insertExpand = (): boolean => {
    const { state, dispatch } = this.props.editorView;
    return insertExpand(state, dispatch);
  };

  private insertBlockType = (itemName: string) => () => {
    const { editorView, onInsertBlockType } = this.props;
    const { state, dispatch } = editorView;

    onInsertBlockType!(itemName)(state, dispatch);
    return true;
  };

  private handleSelectedEmoji = (emojiId: EmojiId): boolean => {
    this.props.editorView.focus();
    insertEmoji(emojiId, INPUT_METHOD.PICKER)(
      this.props.editorView.state,
      this.props.editorView.dispatch,
    );
    this.toggleEmojiPicker();
    return true;
  };

  private openElementBrowser = () => {
    openElementBrowserModal()(
      this.props.editorView.state,
      this.props.editorView.dispatch,
    );
  };

  private onItemActivated = ({
    item,
    inputMethod,
  }: {
    item: any;
    inputMethod: TOOLBAR_MENU_TYPE;
  }): void => {
    const {
      editorView,
      editorActions,
      handleImageUpload,
      expandEnabled,
    } = this.props;

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
