import { INPUT_METHOD } from '../../../analytics/types';
import { EditorView } from 'prosemirror-view';
import EditorActions from '../../../../actions';
import { Command } from '../../../../types/command';
import { EmojiProvider } from '@atlaskit/emoji';
import { BlockType } from '../../../block-type/types';
import { MacroProvider } from '@atlaskit/editor-common/provider-factory';
import { MenuItem } from '../../../../ui/DropdownMenu/types';
import { Node as PMNode } from 'prosemirror-model';
import { DispatchAnalyticsEvent } from '../../../analytics';
import { BlockMenuItem } from './create-items';

export interface Props {
  buttons: number;
  isReducedSpacing: boolean;
  isDisabled?: boolean;
  isTypeAheadAllowed?: boolean;
  editorView: EditorView;
  editorActions?: EditorActions;
  tableSupported?: boolean;
  actionSupported?: boolean;
  decisionSupported?: boolean;
  mentionsSupported?: boolean;
  mediaUploadsEnabled?: boolean;
  mediaSupported?: boolean;
  imageUploadSupported?: boolean;
  imageUploadEnabled?: boolean;
  handleImageUpload?: (event?: Event) => Command;
  dateEnabled?: boolean;
  horizontalRuleEnabled?: boolean;
  placeholderTextEnabled?: boolean;
  layoutSectionEnabled?: boolean;
  expandEnabled?: boolean;
  emojiProvider?: Promise<EmojiProvider>;
  availableWrapperBlockTypes?: BlockType[];
  linkSupported?: boolean;
  linkDisabled?: boolean;
  emojiDisabled?: boolean;
  nativeStatusSupported?: boolean;
  popupsMountPoint?: HTMLElement;
  popupsBoundariesElement?: HTMLElement;
  popupsScrollableElement?: HTMLElement;
  macroProvider?: MacroProvider | null;
  insertMenuItems?: MenuItem[];
  showElementBrowserLink?: boolean;
  showSeparator?: boolean;
  replacePlusMenuWithElementBrowser?: boolean;
  onShowMediaPicker?: () => void;
  onInsertBlockType?: (name: string) => Command;
  onInsertMacroFromMacroBrowser?: (
    macroProvider: MacroProvider,
    node?: PMNode,
    isEditing?: boolean,
  ) => (view: EditorView) => void;
  dispatchAnalyticsEvent?: DispatchAnalyticsEvent;
}

export interface State {
  isPlusMenuOpen: boolean;
  emojiPickerOpen: boolean;
  buttons: BlockMenuItem[];
  dropdownItems: BlockMenuItem[];
}

export type TOOLBAR_MENU_TYPE = INPUT_METHOD.TOOLBAR | INPUT_METHOD.INSERT_MENU;
