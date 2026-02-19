import type { JSONDocNode } from '@atlaskit/editor-json-transformer';
import type { Fragment, Schema } from '@atlaskit/editor-prosemirror/model';
import { Node } from '@atlaskit/editor-prosemirror/model';
import { fg } from '@atlaskit/platform-feature-flags';

import { getNodeIdProvider } from '../../node-anchor/node-anchor-provider';
import type {
	CorePlugin,
	DefaultTransformerResultCallback,
	InferTransformerResultCallback,
	Transformer,
	TransformerResult,
} from '../../types';
import {
	processRawFragmentValue,
	processRawValue,
	processRawValueWithoutValidation,
} from '../../utils/processRawValue';
import { editorCommandToPMCommand } from '../editor-commands';

import {
	createThrottleSchedule,
	returnDocumentRequest,
	returnDocumentRequestNoThrowError,
} from './requestDocument';

/**
 * Core plugin that is always included in the preset.
 * Allows for executing `EditorCommand` and other core functionality.
 */
export const corePlugin: CorePlugin = ({ config }) => {
	// Create the document request throttler per editor (rather than at a module level)
	const scheduleDocumentRequest = createThrottleSchedule(returnDocumentRequest);
	const scheduleDocumentRequestNoThrowError = createThrottleSchedule(
		returnDocumentRequestNoThrowError,
	);

	return {
		name: 'core',
		getSharedState(state) {
			return {
				schema: state?.schema,
			};
		},
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
			scrollToPos(pos: number, scrollOptions?: boolean | ScrollIntoViewOptions) {
				const editorView = config?.getEditorView();

				if (!editorView) {
					return false;
				}

				const tr = editorView.state.tr;
				const isValidPos = typeof pos === 'number' && pos >= 0 && pos <= tr.doc.content.size;

				if (!isValidPos) {
					return false;
				}

				const dom = editorView.domAtPos(pos).node;

				if (!(dom instanceof Element)) {
					// If it's not an element (e.g. #text node), we'll try the parent.
					// This is expected to cover most of the scenarios, if not, window.scrollTo is an alternative
					if (dom.parentNode instanceof Element) {
						dom.parentNode.scrollIntoView(scrollOptions);
						return true;
					}
					return false;
				}

				dom.scrollIntoView(scrollOptions);
				return true;
			},
			replaceDocument: (
				replaceValue: Node | Fragment | Array<Node> | Object | String,
				options?: {
					addToHistory?: boolean;
					scrollIntoView?: boolean;
					skipValidation?: boolean;
					transformer?: Transformer<string>;
				},
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
						? processRawFragmentValue(
								schema,
								replaceValue,
								undefined,
								undefined,
								options?.transformer,
							)
						: processRawValue(schema, replaceValue, undefined, undefined, options?.transformer);

				// Don't replace the document if it's the same document, as full size
				// replace transactions cause issues for collaborative editing and
				// content reconciliation (eg. inline comments getting dropped)
				if (content instanceof Node && state.doc.eq(content)) {
					return false;
				}

				if (content) {
					const tr = state.tr.replaceWith(0, state.doc.nodeSize - 2, content);

					if (options?.addToHistory === false) {
						tr.setMeta('addToHistory', false);
					}

					if (options?.scrollIntoView ?? true) {
						editorView.dispatch(tr.scrollIntoView());
					} else {
						editorView.dispatch(tr.setMeta('scrollIntoView', false));
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
				options?: { alwaysFire?: boolean; transformer?: GenericTransformer },
			) {
				const view = config?.getEditorView() ?? null;
				scheduleDocumentRequest(
					view,
					onReceive,
					options?.transformer,
					config?.fireAnalyticsEvent,
					options?.alwaysFire,
				);
			},

			requestDocumentAsync: <
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				GenericTransformer extends Transformer<any> = Transformer<JSONDocNode>,
			>(options?: {
				transformer?: GenericTransformer;
			}) => {
				return new Promise((resolve) => {
					const view = config?.getEditorView() ?? null;
					scheduleDocumentRequestNoThrowError<GenericTransformer>(
						view,
						(doc) => {
							resolve(doc as TransformerResult<GenericTransformer>);
						},
						options?.transformer,
						config?.fireAnalyticsEvent,
						true,
					);
				});
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

			getAnchorIdForNode(node, pos): string | undefined {
				const view = config?.getEditorView() ?? null;
				if (!view) {
					return undefined;
				}

				const nodeIdProvider = getNodeIdProvider(view);
				const cachedId = nodeIdProvider.getIdForNode(node);
				if (cachedId) {
					return cachedId;
				}

				if (pos < 0) {
					return undefined;
				}

				// [FEATURE FLAG: platform_editor_fix_node_anchor_dom_cache]
				// Fixes drag handle misalignment on first focus after clicking from title
				// by checking DOM for existing anchor before generating a new ID with collision suffix.
				// To clean up: remove if-else block, keep only flag-on behavior (lines 217-229), remove old behavior (lines 231-238)
				if (fg('platform_editor_fix_node_anchor_dom_cache')) {
					// Check DOM first to avoid generating a new ID with a collision suffix
					// when the DOM already has a valid anchor. This prevents misalignment
					// of drag handles on first focus after clicking from the title.
					const nodeDOM = view.nodeDOM(pos);
					if (nodeDOM instanceof HTMLElement) {
						const domAnchor = nodeDOM.getAttribute('data-node-anchor');
						if (domAnchor) {
							// Cache the DOM anchor for this node to maintain consistency
							// This ensures subsequent calls return the same anchor
							nodeIdProvider.setIdForNode(node, domAnchor);
							return domAnchor;
						}
					}

					// Only generate a new ID if DOM doesn't have one
					const generatedId = nodeIdProvider.getOrGenerateId(node, pos);
					if (generatedId) {
						return generatedId;
					}

					return undefined;
				} else {
					// OLD BEHAVIOR (to be removed when flag is cleaned up)
					// This approach can generate incorrect IDs with collision suffixes when
					// the DOM already has a valid anchor, causing drag handle misalignment
					const generatedId = nodeIdProvider.getOrGenerateId(node, pos);
					if (generatedId) {
						return generatedId;
					}
					const nodeDOM = view.nodeDOM(pos);
					if (nodeDOM instanceof HTMLElement) {
						return nodeDOM.getAttribute('data-node-anchor') || undefined;
					}

					return undefined;
				}
			},
		},
	};
};
