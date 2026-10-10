import type { EventDispatcher } from '@atlaskit/editor-common/event-dispatcher';
import type { ToolbarUIComponentFactory } from '@atlaskit/editor-common/types/toolbar';
import type {
	UIComponentFactory,
	ReactHookFactory,
} from '@atlaskit/editor-common/types/ui-components';
import type { MenuItem } from '@atlaskit/editor-common/ui-menu/DropdownMenu/types';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';

import type { OnEditorViewStateUpdated } from '../create-editor/get-plugins';

export interface EditorInstance {
	contentComponents: UIComponentFactory[];
	contentTransformer?: Transformer<string>;
	editorView: EditorView;
	eventDispatcher: EventDispatcher;
	insertMenuItems?: MenuItem[];
	onEditorViewStateUpdatedCallbacks: {
		callback: OnEditorViewStateUpdated;
		pluginName: string;
	}[];
	pluginHooks: ReactHookFactory[];
	primaryToolbarComponents: ToolbarUIComponentFactory[];
	secondaryToolbarComponents: UIComponentFactory[];
}
