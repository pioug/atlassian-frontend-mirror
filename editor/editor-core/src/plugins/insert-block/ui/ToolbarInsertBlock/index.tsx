import React, { ReactInstance } from 'react';
import ReactDOM from 'react-dom';
import { InjectedIntlProps, injectIntl, FormattedMessage } from 'react-intl';
import { EmojiPicker as AkEmojiPicker } from '@atlaskit/emoji/picker';
import { EmojiId } from '@atlaskit/emoji/types';
import { akEditorMenuZIndex, Popup } from '@atlaskit/editor-common';
import {
  analyticsService as analytics,
  withAnalytics,
} from '../../../../analytics';
import {
  findKeymapByDescription,
  findShortcutByDescription,
  tooltip,
} from '../../../../keymaps';
import DropdownMenu from '../../../../ui/DropdownMenu';
import ToolbarButton from '../../../../ui/ToolbarButton';
import { ButtonGroup, Wrapper } from '../../../../ui/styles';
import { BlockType } from '../../../block-type/types';
import { createTable } from '../../../table/commands';
import { insertDate, openDatePicker } from '../../../date/actions';
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
import { messages } from './messages';
import { Props, State, TOOLBAR_MENU_TYPE } from './types';
import { createItems } from './create-items';
import { DropDownButton } from './dropdown-button';

/**
 * Checks if an element is detached (i.e. not in the current document)
 */
const isDetachedElement = (el: HTMLElement) => !document.body.contains(el);
const noop = () => {};

class ToolbarInsertBlock extends React.Component<
  Props & InjectedIntlProps,
  State
> {
  private pickerRef?: ReactInstance;
  private button?: HTMLElement;

  state: State = {
    isOpen: false,
    emojiPickerOpen: false,
  };

  UNSAFE_componentWillReceiveProps(nextProps: Props) {
    // If number of visible buttons changed, close emoji picker
    if (nextProps.buttons !== this.props.buttons) {
      this.setState({ emojiPickerOpen: false });
    }
  }

  private onOpenChange = (attrs: { isOpen: boolean; open?: boolean }) => {
    const state = {
      isOpen: attrs.isOpen,
      emojiPickerOpen: this.state.emojiPickerOpen,
    };
    if (this.state.emojiPickerOpen && !attrs.open) {
      state.emojiPickerOpen = false;
    }
    this.setState(state);
  };

  private handleTriggerClick = () => {
    const { isOpen } = this.state;
    this.onOpenChange({ isOpen: !isOpen });
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
    if (!emojiPickerOpen || !this.button || !emojiProvider) {
      return null;
    }

    return (
      <Popup
        target={this.button}
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

  private handleButtonRef = (ref: HTMLElement): void => {
    const buttonRef = ref || null;
    if (buttonRef) {
      this.button = ReactDOM.findDOMNode(buttonRef) as HTMLElement;
    }
  };

  private handleDropDownButtonRef = (
    ref: ToolbarButton | null,
    items: Array<any>,
  ) => {
    items.forEach(item => item.handleRef && item.handleRef(ref));
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

  private getShortcutBlock = (blockType: BlockType) => {
    switch (blockType.name) {
      case 'blockquote':
        return '>';
      case 'codeblock':
        return '```';
      default:
        return tooltip(findKeymapByDescription(blockType.title.defaultMessage));
    }
  };

  private formatMessage = (
    input: FormattedMessage.MessageDescriptor,
    values?: any,
  ): string => {
    return this.props.intl.formatMessage(input, values);
  };

  render() {
    const { isOpen } = this.state;
    const {
      popupsMountPoint,
      popupsBoundariesElement,
      popupsScrollableElement,
      isDisabled,
      buttons: numberOfButtons,
      isReducedSpacing,
      intl: { formatMessage },
    } = this.props;

    const [buttons, dropdownItems] = createItems({
      isTypeAheadAllowed: this.props.isTypeAheadAllowed,
      tableSupported: this.props.tableSupported,
      mediaUploadsEnabled: this.props.mediaUploadsEnabled,
      mediaSupported: this.props.mediaSupported,
      imageUploadSupported: this.props.imageUploadSupported,
      imageUploadEnabled: this.props.imageUploadEnabled,
      mentionsSupported: this.props.mentionsSupported,
      actionSupported: this.props.actionSupported,
      decisionSupported: this.props.decisionSupported,
      linkSupported: this.props.linkSupported,
      linkDisabled: this.props.linkDisabled,
      emojiDisabled: this.props.emojiDisabled,
      nativeStatusSupported: this.props.nativeStatusSupported,
      dateEnabled: this.props.dateEnabled,
      placeholderTextEnabled: this.props.placeholderTextEnabled,
      horizontalRuleEnabled: this.props.horizontalRuleEnabled,
      layoutSectionEnabled: this.props.layoutSectionEnabled,
      expandEnabled: this.props.expandEnabled,
      macroProvider: this.props.macroProvider,
      emojiProvider: this.props.emojiProvider,
      availableWrapperBlockTypes: this.props.availableWrapperBlockTypes,
      insertMenuItems: this.props.insertMenuItems,
      schema: this.props.editorView.state.schema,
      numberOfButtons,
      handleButtonRef: this.handleButtonRef,
      getShortcutBlock: this.getShortcutBlock,
      formatMessage: this.formatMessage,
    });

    if (buttons.length === 0 && dropdownItems.length === 0) {
      return null;
    }

    findShortcutByDescription(messages.insertMenu.description);

    const dropDownLabel = formatMessage(messages.insertMenu);
    const spacing = isReducedSpacing ? 'none' : 'default';

    return (
      <ButtonGroup width={isReducedSpacing ? 'small' : 'large'}>
        {buttons.map(btn => (
          <ToolbarButton
            item={btn}
            ref={btn.handleRef || noop}
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
          {dropdownItems.length > 0 &&
            (!isDisabled ? (
              <DropdownMenu
                items={[{ items: dropdownItems }]}
                onItemActivated={this.insertInsertMenuItem}
                onOpenChange={this.onOpenChange}
                mountTo={popupsMountPoint}
                boundariesElement={popupsBoundariesElement}
                scrollableElement={popupsScrollableElement}
                isOpen={isOpen}
                fitHeight={188}
                fitWidth={175}
                zIndex={akEditorMenuZIndex}
              >
                <DropDownButton
                  handleRef={this.handleDropDownButtonRef}
                  selected={isOpen}
                  disabled={isDisabled}
                  onClick={this.handleTriggerClick}
                  spacing={spacing}
                  label={dropDownLabel}
                  items={dropdownItems}
                />
              </DropdownMenu>
            ) : (
              <div>
                <DropDownButton
                  handleRef={this.handleDropDownButtonRef}
                  selected={isOpen}
                  disabled={isDisabled}
                  onClick={this.handleTriggerClick}
                  spacing={spacing}
                  label={dropDownLabel}
                  items={dropdownItems}
                />
              </div>
            ))}
        </Wrapper>
      </ButtonGroup>
    );
  }

  private toggleLinkPanel = withAnalytics(
    'atlassian.editor.format.hyperlink.button',
    (inputMethod: TOOLBAR_MENU_TYPE): boolean => {
      const { editorView } = this.props;
      showLinkToolbar(inputMethod)(editorView.state, editorView.dispatch);
      return true;
    },
  );

  private insertMention = withAnalytics(
    'atlassian.fabric.mention.picker.trigger.button',
    (inputMethod: TOOLBAR_MENU_TYPE): boolean => {
      const { editorView } = this.props;
      insertMentionQuery(inputMethod)(editorView.state, editorView.dispatch);
      return true;
    },
  );

  private insertTable = withAnalytics(
    'atlassian.editor.format.table.button',
    (inputMethod: TOOLBAR_MENU_TYPE): boolean => {
      const { editorView } = this.props;
      return commandWithAnalytics({
        action: ACTION.INSERTED,
        actionSubject: ACTION_SUBJECT.DOCUMENT,
        actionSubjectId: ACTION_SUBJECT_ID.TABLE,
        attributes: { inputMethod },
        eventType: EVENT_TYPE.TRACK,
      })(createTable)(editorView.state, editorView.dispatch);
    },
  );

  private createDate = withAnalytics(
    'atlassian.editor.format.date.button',
    (inputMethod: TOOLBAR_MENU_TYPE): boolean => {
      const { editorView } = this.props;
      insertDate(undefined, inputMethod)(editorView.state, editorView.dispatch);
      openDatePicker()(editorView.state, editorView.dispatch);
      return true;
    },
  );

  private createPlaceholderText = withAnalytics(
    'atlassian.editor.format.placeholder.button',
    (): boolean => {
      const { editorView } = this.props;
      showPlaceholderFloatingToolbar(editorView.state, editorView.dispatch);
      return true;
    },
  );

  private insertLayoutColumns = withAnalytics(
    'atlassian.editor.format.layout.button',
    (inputMethod: TOOLBAR_MENU_TYPE): boolean => {
      const { editorView } = this.props;
      insertLayoutColumnsWithAnalytics(inputMethod)(
        editorView.state,
        editorView.dispatch,
      );
      return true;
    },
  );

  private createStatus = withAnalytics(
    'atlassian.editor.format.status.button',
    (inputMethod: TOOLBAR_MENU_TYPE): boolean => {
      const { editorView } = this.props;
      updateStatusWithAnalytics(inputMethod)(
        editorView.state,
        editorView.dispatch,
      );
      return true;
    },
  );

  private openMediaPicker = withAnalytics(
    'atlassian.editor.format.media.button',
    (inputMethod: TOOLBAR_MENU_TYPE): boolean => {
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
    },
  );

  private insertTaskDecision = (
    name: 'action' | 'decision',
    inputMethod: TOOLBAR_MENU_TYPE,
  ) =>
    withAnalytics(`atlassian.fabric.${name}.trigger.button`, (): boolean => {
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
    });

  private insertHorizontalRule = withAnalytics(
    'atlassian.editor.format.horizontalrule.button',
    (inputMethod: TOOLBAR_MENU_TYPE): boolean => {
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
    },
  );

  private insertExpand = (): boolean => {
    const { state, dispatch } = this.props.editorView;
    return insertExpand(state, dispatch);
  };

  private insertBlockType = (itemName: string) =>
    withAnalytics(`atlassian.editor.format.${itemName}.button`, () => {
      const { editorView, onInsertBlockType } = this.props;
      const { state, dispatch } = editorView;

      onInsertBlockType!(itemName)(state, dispatch);
      return true;
    });

  private handleSelectedEmoji = withAnalytics(
    'atlassian.editor.emoji.button',
    (emojiId: EmojiId): boolean => {
      this.props.editorView.focus();
      insertEmoji(emojiId, INPUT_METHOD.PICKER)(
        this.props.editorView.state,
        this.props.editorView.dispatch,
      );
      this.toggleEmojiPicker();
      return true;
    },
  );

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
      onInsertMacroFromMacroBrowser,
      macroProvider,
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
        analytics.trackEvent(
          `atlassian.editor.format.${item.value.name}.button`,
        );
        onInsertMacroFromMacroBrowser!(macroProvider!)(
          editorView.state,
          editorView.dispatch,
        );
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
      // It's expected to fall through to default
      // @ts-ignore
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
    this.setState({ isOpen: false });
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
