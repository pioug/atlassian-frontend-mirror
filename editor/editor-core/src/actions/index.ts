import type { AnalyticsEventPayload } from '@atlaskit/analytics-next/AnalyticsEvent';
import { ACTION, ACTION_SUBJECT, EVENT_TYPE } from '@atlaskit/editor-common/analytics';
import type { ResolvedEditorState } from '@atlaskit/editor-common/collab';
import { createDispatch } from '@atlaskit/editor-common/event-dispatcher';
import type { EventDispatcher } from '@atlaskit/editor-common/event-dispatcher';
import {
	processRawFragmentValue,
	processRawValue,
} from '@atlaskit/editor-common/process-raw-value';
import type {
	ContextUpdateHandler,
	EditorActionsOptions,
	FeatureFlags,
	ReplaceRawValue,
	GetResolvedEditorStateReason,
	Transformer,
} from '@atlaskit/editor-common/types';
import { analyticsEventKey } from '@atlaskit/editor-common/utils/analytics';
import { Node } from '@atlaskit/editor-prosemirror/model';
import type { EditorState, PluginKey } from '@atlaskit/editor-prosemirror/state';
import { NodeSelection, TextSelection } from '@atlaskit/editor-prosemirror/state';
import { findParentNode, safeInsert } from '@atlaskit/editor-prosemirror/utils';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';

import { getEditorValueWithMedia } from '../utils/action';
import deprecationWarnings from '../utils/deprecation-warnings';
import { findNodePosByFragmentLocalIds } from '../utils/nodes-by-localIds';

import { isEmptyDocument } from './temp-is-empty-document';
import { findNodePosByLocalIds } from './temp-nodes-by-localids';
import { toJSON } from './temp-to-json';

// Please, do not copy or use this kind of code below
// @ts-ignore
const fakePluginKey = {
	key: 'nativeCollabProviderPlugin$',
	getState: (state: EditorState) => {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		return (state as any)['nativeCollabProviderPlugin$'];
	},
} as PluginKey;

/**
 * @deprecated {@link https://hello.atlassian.net/browse/ENGHEALTH-26729 Internal documentation for deprecation (no external access)} Editor actions is no longer supported and will be removed in a future version. Please use the core actions, or Plugin APIs directly instead
 * @example If you were using editorActions.getValue() replace with:
	const { editorApi, preset } = usePreset(...);
	editorApi?.core.actions.requestDocument((doc) => {
  		// use doc as desired
	})
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default class EditorActions<T = any> implements EditorActionsOptions<T> {
	private editorView?: EditorView;
	private contentTransformer?: Transformer<T>;
	private contentEncode?: Transformer<T>['encode'];
	private eventDispatcher?: EventDispatcher;
	private listeners: Array<ContextUpdateHandler> = [];

	static from<T>(view: EditorView, eventDispatcher: EventDispatcher, transformer?: Transformer<T>) {
		const editorActions = new EditorActions<T>();
		editorActions._privateRegisterEditor(view, eventDispatcher, transformer);
		return editorActions;
	}

	//#region private
	// This method needs to be public for context based helper components.
	_privateGetEditorView(): EditorView | undefined {
		return this.editorView;
	}

	_privateGetEventDispatcher(): EventDispatcher | undefined {
		return this.eventDispatcher;
	}

	private getFeatureFlags(): FeatureFlags {
		return {};
	}

	// This method needs to be public for EditorContext component.
	_privateRegisterEditor(
		editorView: EditorView,
		eventDispatcher: EventDispatcher,
		contentTransformer?: Transformer<T>,
		getFeatureFlags: () => FeatureFlags = () => ({}),
	): void {
		this.contentTransformer = contentTransformer;
		this.eventDispatcher = eventDispatcher;
		this.getFeatureFlags = getFeatureFlags;

		if (!this.editorView && editorView) {
			this.editorView = editorView;
			this.listeners.forEach((cb) => cb(editorView, eventDispatcher));
		} else if (this.editorView !== editorView) {
			throw new Error(
				"Editor has already been registered! It's not allowed to re-register editor with the new Editor instance.",
			);
		}

		if (this.contentTransformer) {
			this.contentEncode = this.contentTransformer.encode.bind(this.contentTransformer);
		}
	}

	// This method needs to be public for EditorContext component.
	_privateUnregisterEditor(): void {
		this.editorView = undefined;
		this.contentTransformer = undefined;
		this.contentEncode = undefined;
		this.eventDispatcher = undefined;
		this.getFeatureFlags = () => ({});
	}

	_privateSubscribe(cb: ContextUpdateHandler): void {
		// If editor is registered and somebody is trying to add a listener,
		// just call it first.
		if (this.editorView && this.eventDispatcher) {
			cb(this.editorView, this.eventDispatcher);
		}

		this.listeners.push(cb);
	}

	_privateUnsubscribe(cb: ContextUpdateHandler): void {
		this.listeners = this.listeners.filter((c) => c !== cb);
	}
	//#endregion

	focus(): boolean {
		if (!this.editorView || this.editorView.hasFocus()) {
			return false;
		}

		this.editorView.focus();

		this.editorView.dispatch(this.editorView.state.tr.scrollIntoView());

		return true;
	}

	blur(): boolean {
		if (!this.editorView || !this.editorView.hasFocus()) {
			return false;
		}

		// Ignored via go/ees005
		// eslint-disable-next-line @atlaskit/editor/no-as-casting
		(this.editorView.dom as HTMLElement).blur();
		return true;
	}

	clear(): boolean {
		if (!this.editorView) {
			return false;
		}

		const editorView = this.editorView;
		const { state } = editorView;
		const tr = editorView.state.tr
			.setSelection(TextSelection.create(state.doc, 0, state.doc.nodeSize - 2))
			.deleteSelection();

		editorView.dispatch(tr);

		return true;
	}

	// eslint-disable-next-line @repo/internal/deprecations/deprecation-ticket-required -- Ignored via go/ED-25883
	/**
	 * @deprecated This is deprecated and is no longer maintained.
	 *
	 * Use the `requestDocument` API from `editorAPI` (ie. `editorApi?.core?.actions.requestDocument( ... ))
	 * it has inbuilt throttling and is designed for use with `ComposableEditor`.
	 *
	 * Docs on its usage are available from: https://atlaskit.atlassian.com/packages/editor/editor-core
	 *
	 * WARNING: this may be called repeatedly, async with care
	 */
	async getValue() {
		const { editorView } = this;
		if (!editorView) {
			return;
		}

		const doc = await getEditorValueWithMedia(editorView);
		const json = toJSON(doc);

		if (!this.contentEncode) {
			return json;
		}

		// Ignored via go/ees005
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		const nodeSanitized = Node.fromJSON(this.editorView!.state.schema, json);

		try {
			return this.contentEncode(nodeSanitized);
		} catch (e) {
			this.dispatchAnalyticsEvent({
				action: ACTION.DOCUMENT_PROCESSING_ERROR,
				actionSubject: ACTION_SUBJECT.EDITOR,
				eventType: EVENT_TYPE.OPERATIONAL,
				attributes: {
					errorMessage: `${e instanceof Error && e.name === 'NodeNestingTransformError' ? 'NodeNestingTransformError - Failed to encode one or more nested tables' : undefined}`,
				},
			});
			throw e;
		}
	}

	getNodeByLocalId(id: string): Node | undefined {
		if (this.editorView?.state) {
			const nodes = findNodePosByLocalIds(this.editorView?.state, [id]);
			const node = nodes.length >= 1 ? nodes[0] : undefined;
			return node?.node;
		}
	}

	getNodeByFragmentLocalId(id: string): Node | undefined {
		if (this.editorView?.state) {
			const nodes = findNodePosByFragmentLocalIds(this.editorView?.state, [id]);

			return nodes.length > 0 ? nodes[0].node : undefined;
		}
	}

	/**
	 * This method will return the currently selected `Node` if the selection is a `Node`.
	 * Otherwise, if the selection is textual or a non-selectable `Node` within another selectable `Node`, the closest selectable parent `Node` will be returned.
	 */
	getSelectedNode(): Node | undefined {
		if (this.editorView?.state?.selection) {
			const { selection } = this.editorView.state;

			if (selection instanceof NodeSelection) {
				return selection.node;
			}
			return findParentNode((node) => Boolean(node.type.spec.selectable))(selection)?.node;
		}
	}

	isDocumentEmpty(): boolean {
		// Unlikely case when editorView has been destroyed before calling isDocumentEmpty,
		// we treat this case as if document was empty.
		if (!this.editorView) {
			return true;
		}

		return isEmptyDocument(this.editorView.state.doc);
	}

	// eslint-disable-next-line @repo/internal/deprecations/deprecation-ticket-required -- Ignored via go/ED-25883
	/**
	 * @deprecated - please use `replaceDocument` found in the core plugin actions instead
	 * using this will reset your Editor State which could cause some things to break (like emojis)
	 * @example - use the `replaceDocument` from the core plugin actions instead
	 * ```ts
	 * const { editorApi, preset } = usePreset(...);
		// where you need it
		editorApi?.core.actions.replaceDocument(value);
		return <ComposableEditor preset={preset} ... />
	 */
	replaceDocument(
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		rawValue: any,
		shouldScrollToBottom = true,
		// eslint-disable-next-line @repo/internal/deprecations/deprecation-ticket-required -- Ignored via go/ED-25883
		/** @deprecated [ED-14158] shouldAddToHistory is not being used in this function */
		shouldAddToHistory = true,
	): boolean {
		deprecationWarnings('EditorActions.replaceDocument', { shouldAddToHistory }, [
			{
				property: 'shouldAddToHistory',
				description:
					'[ED-14158] EditorActions.replaceDocument does not use the shouldAddToHistory arg',
				type: 'removed',
			},
		]);

		if (!this.editorView || rawValue === undefined || rawValue === null) {
			return false;
		}

		if (this.eventDispatcher) {
			this.eventDispatcher.emit('resetEditorState', {
				doc: rawValue,
				shouldScrollToBottom,
			});
		}

		return true;
	}

	replaceSelection(
		rawValue: ReplaceRawValue | Array<ReplaceRawValue>,
		tryToReplace?: boolean,
		position?: number,
	): boolean {
		if (!this.editorView) {
			return false;
		}

		const { state } = this.editorView;

		if (!rawValue) {
			const tr = state.tr.deleteSelection().scrollIntoView();
			this.editorView.dispatch(tr);
			return true;
		}

		const { schema } = state;
		const content = Array.isArray(rawValue)
			? processRawFragmentValue(
					schema,
					rawValue,
					undefined,
					undefined,
					undefined,
					this.dispatchAnalyticsEvent,
				)
			: processRawValue(
					schema,
					rawValue,
					undefined,
					undefined,
					undefined,
					this.dispatchAnalyticsEvent,
				);

		if (!content) {
			return false;
		}

		// try to find a place in the document where to insert a node if its not allowed at the cursor position by schema
		this.editorView.dispatch(
			safeInsert(content, position, tryToReplace)(state.tr).scrollIntoView(),
		);

		return true;
	}

	appendText(text: string): boolean {
		if (!this.editorView || !text) {
			return false;
		}

		const { state } = this.editorView;
		const lastChild = state.doc.lastChild;

		if (lastChild && lastChild.type !== state.schema.nodes.paragraph) {
			return false;
		}

		const tr = state.tr.insertText(text).scrollIntoView();
		this.editorView.dispatch(tr);

		return true;
	}

	dispatchAnalyticsEvent = (payload: AnalyticsEventPayload): void => {
		if (this.eventDispatcher) {
			const dispatch = createDispatch(this.eventDispatcher);
			dispatch(analyticsEventKey, {
				payload,
			});
		}
	};

	/**
	 * If editor is using new collab service,
	 * we want editor to call the collab provider to
	 * retrieve the final acknowledged state of the
	 * editor. The final acknowledged editor state
	 * refers to the latest state of editor with confirmed
	 * steps.
	 */
	getResolvedEditorState = async (
		reason: GetResolvedEditorStateReason,
	): Promise<ResolvedEditorState | undefined> => {
		const { useNativeCollabPlugin } = this.getFeatureFlags();

		if (!this.editorView) {
			throw new Error('Called getResolvedEditorState before editorView is ready');
		}

		if (!useNativeCollabPlugin) {
			const editorValue = await this.getValue();
			if (!editorValue) {
				throw new Error('editorValue is undefined');
			}
			return {
				content: editorValue,
				title: null,
				stepVersion: -1,
			};
		}
		const editorView = this.editorView;
		await getEditorValueWithMedia(editorView);
		const collabEditState = fakePluginKey.getState(editorView.state);
		return collabEditState?.getFinalAcknowledgedState(reason);
	};
}
