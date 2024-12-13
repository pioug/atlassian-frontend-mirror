import type { EventDispatcher } from '@atlaskit/editor-common/event-dispatcher';
import type {
	ToolbarUIComponentFactory,
	UIComponentFactory,
	ReactHookFactory,
} from '@atlaskit/editor-common/types';
import type { MenuItem } from '@atlaskit/editor-common/ui-menu';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';

import type { OnEditorViewStateUpdated } from '../create-editor/get-plugins';

export interface EditorInstance {
	editorView: EditorView;
	eventDispatcher: EventDispatcher;
	contentComponents: UIComponentFactory[];
	pluginHooks: ReactHookFactory[];
	primaryToolbarComponents: ToolbarUIComponentFactory[];
	secondaryToolbarComponents: UIComponentFactory[];
	onEditorViewStateUpdatedCallbacks: {
		pluginName: string;
		callback: OnEditorViewStateUpdated;
	}[];
	contentTransformer?: Transformer<string>;
	insertMenuItems?: MenuItem[];
}
