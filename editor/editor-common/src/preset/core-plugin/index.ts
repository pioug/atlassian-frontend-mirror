import type { JSONDocNode } from '@atlaskit/editor-json-transformer';
import type { Fragment, Node, Schema } from '@atlaskit/editor-prosemirror/model';

import type {
	CorePlugin,
	DefaultTransformerResultCallback,
	InferTransformerResultCallback,
	Transformer,
} from '../../types';
import {
	processRawFragmentValue,
	processRawValue,
	processRawValueWithoutValidation,
} from '../../utils/processRawValue';
import { editorCommandToPMCommand } from '../editor-commands';

import { createThrottleSchedule, returnDocumentRequest } from './requestDocument';

/**
 * Core plugin that is always included in the preset.
 * Allows for executing `EditorCommand` and other core functionality.
 */
export const corePlugin: CorePlugin = ({ config }) => {
	// Create the document request throttler per editor (rather than at a module level)
	const scheduleDocumentRequest = createThrottleSchedule(returnDocumentRequest);
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

				// Ignored via go/ees005
				// eslint-disable-next-line @atlaskit/editor/no-as-casting
				(editorView.dom as HTMLElement).blur();
				return true;
			},
			replaceDocument: (
				replaceValue: Node | Fragment | Array<Node> | Object | String,
				options?: { scrollIntoView?: boolean; skipValidation?: boolean },
			) => {
				const editorView = config?.getEditorView();
				if (!editorView || replaceValue === undefined || replaceValue === null) {
					return false;
				}

				const { state } = editorView;
				const { schema } = state;

				const content = options?.skipValidation
					? processRawValueWithoutValidation(schema, replaceValue)
					: Array.isArray(replaceValue)
						? processRawFragmentValue(schema, replaceValue)
						: processRawValue(schema, replaceValue);

				if (content) {
					const tr = state.tr.replaceWith(0, state.doc.nodeSize - 2, content);
					if (options?.scrollIntoView ?? true) {
						editorView.dispatch(tr.scrollIntoView());
					} else {
						editorView.dispatch(tr);
					}
					return true;
				}
				return false;
			},

			// Ignored via go/ees005
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			requestDocument<GenericTransformer extends Transformer<any> = Transformer<JSONDocNode>>(
				onReceive: GenericTransformer extends undefined
					? DefaultTransformerResultCallback
					: InferTransformerResultCallback<GenericTransformer>,
				options?: { transformer?: GenericTransformer },
			) {
				const view = config?.getEditorView() ?? null;
				scheduleDocumentRequest(view, onReceive, options?.transformer, config?.fireAnalyticsEvent);
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
