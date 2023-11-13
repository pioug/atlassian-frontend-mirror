import type { DispatchAnalyticsEvent } from '@atlaskit/editor-common/analytics';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import type {
  EditorActionsOptions as EditorActions,
  FeatureFlags,
  ImageUploadPluginReferenceEvent,
  Command,
  PluginInjectionAPIWithDependencies,
} from '@atlaskit/editor-common/types';
import type { EmojiProvider } from '@atlaskit/emoji';
import type { BlockType } from '@atlaskit/editor-plugin-block-type';
import type { MacroProvider } from '@atlaskit/editor-common/provider-factory';

import type { MenuItem } from '@atlaskit/editor-common/ui-menu';
import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import type { BlockMenuItem } from './create-items';

import type { InsertBlockPluginDependencies } from '../../types';

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
  handleImageUpload?: (event?: ImageUploadPluginReferenceEvent) => Command;
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
  featureFlags: FeatureFlags;
  pluginInjectionApi?: PluginInjectionAPIWithDependencies<InsertBlockPluginDependencies>;
  mentionsDisabled?: boolean;
}

export interface State {
  isPlusMenuOpen: boolean;
  emojiPickerOpen: boolean;
  buttons: BlockMenuItem[];
  dropdownItems: BlockMenuItem[];
  isOpenedByKeyboard: boolean;
}
