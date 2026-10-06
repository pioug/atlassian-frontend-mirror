import type { Node } from '@atlaskit/editor-prosemirror/model';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';

import type { VIEW_METHOD } from '../analytics';
import type {
	EditorContainerWidth,
	Command,
	NextEditorPlugin,
	OptionalPlugin,
	PublicPluginAPI,
} from '../types';

export type ExtensionCommentBadgeProps = {
	container: HTMLElement;
	editorView: EditorView;
	getPos: () => number | undefined;
	node: Node;
};

// A narrow contract keeps the shared node view independent of the annotation plugin.
export type ExtensionAnnotationPlugin = NextEditorPlugin<
	'annotation',
	{
		actions: {
			isBlockNodeSupported: (node: Node) => boolean;
			requestCloseInlineComment: () => Promise<boolean>;
			showCommentForBlockNode: (node: Node, viewMethod: VIEW_METHOD) => Command;
		};
		sharedState:
			| {
					annotations: { [id: string]: boolean | undefined };
					isDrafting: boolean;
					isInlineCommentViewClosed: boolean;
					isVisible: boolean;
					selectedAnnotations: { id: string }[];
					targetNodeId?: string;
			  }
			| undefined;
	}
>;

// Warning: Duplicate type
// Workaround as we don't want to import this package into `editor-common`
// We'll get type errors if this gets out of sync with `editor-plugin-width`.
// TODO: ED-17836 - Remove extension workaround
// When we remove the workaround for `WithPluginState` we can possibly refactor
// and bring the width state information outside of the component
type WidthPluginType = NextEditorPlugin<'width', { sharedState: EditorContainerWidth | undefined }>;

export type ExtensionsPluginInjectionAPI =
	| PublicPluginAPI<[WidthPluginType, OptionalPlugin<ExtensionAnnotationPlugin>]>
	| undefined;

export type MacroInteractionDesignFeatureFlags = {
	showMacroInteractionDesignUpdates?: boolean;
};

export type GetPMNodeHeight = (node: Node) => string | undefined;
