import type { EditorView } from '@atlaskit/editor-prosemirror/view';

import type { OnEditorViewStateUpdated } from '../create-editor/get-plugins';
import type { EventDispatcher } from '../event-dispatcher';
import type { MenuItem } from '../ui/DropdownMenu/types';
import type { ToolbarUIComponentFactory } from '../ui/Toolbar/types';

import type { UIComponentFactory } from './ui-components';

export interface EditorInstance {
  editorView: EditorView;
  eventDispatcher: EventDispatcher;
  contentComponents: UIComponentFactory[];
  primaryToolbarComponents: ToolbarUIComponentFactory[];
  secondaryToolbarComponents: UIComponentFactory[];
  onEditorViewStateUpdatedCallbacks: {
    pluginName: string;
    callback: OnEditorViewStateUpdated;
  }[];
  contentTransformer?: Transformer<string>;
  insertMenuItems?: MenuItem[];
}
