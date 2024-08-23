import type { JSONDocNode } from '@atlaskit/editor-json-transformer';
import type { Schema } from '@atlaskit/editor-prosemirror/model';

import type {
	CorePlugin,
	DefaultTransformerResultCallback,
	InferTransformerResultCallback,
	Transformer,
} from '../../types';
import { editorCommandToPMCommand } from '../editor-commands';

import { scheduleDocumentRequest } from './requestDocument';

/**
 * Core plugin that is always included in the preset.
 * Allows for executing `EditorCommand` and other core functionality.
 */
export const corePlugin: CorePlugin = ({ config }) => {
	return {
		name: 'core',
		actions: {
			execute: (command) => {
				const editorView = config?.getEditorView();
				if (!editorView || !command) {
					return false;
				}

				const { state, dispatch } = editorView;
				return editorCommandToPMCommand(command)(state, dispatch);
			},
			// Code copied from `EditorActions.focus()`
			focus: (options?: { scrollIntoView: boolean }) => {
				const editorView = config?.getEditorView();

				if (!editorView || editorView.hasFocus()) {
					return false;
				}

				editorView.focus();
				if (options?.scrollIntoView ?? true) {
					editorView.dispatch(editorView.state.tr.scrollIntoView());
				}
				return true;
			},
			// Code copied from `EditorActions.blur()`
			blur: () => {
				const editorView = config?.getEditorView();

				if (!editorView || !editorView.hasFocus()) {
					return false;
				}

				(editorView.dom as HTMLElement).blur();
				return true;
			},

			requestDocument<GenericTransformer extends Transformer<any> = Transformer<JSONDocNode>>(
				onReceive: GenericTransformer extends undefined
					? DefaultTransformerResultCallback
					: InferTransformerResultCallback<GenericTransformer>,
				options?: { transformer?: GenericTransformer },
			) {
				const view = config?.getEditorView() ?? null;
				scheduleDocumentRequest(view, onReceive, options?.transformer);
			},

			createTransformer<Format>(
				cb: (schema: Schema) => Transformer<Format>,
			): Transformer<Format> | undefined {
				const view = config?.getEditorView() ?? null;
				if (!view?.state.schema) {
					return undefined;
				}
				return cb(view?.state.schema);
			},
		},
	};
};
