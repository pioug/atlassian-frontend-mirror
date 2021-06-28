import { Node } from 'prosemirror-model';
import { JSONDocNode } from '@atlaskit/editor-json-transformer';
import { TextSelection, Selection } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { Transformer } from '@atlaskit/editor-common';
import { toJSON } from '../utils';
import { processRawValue, isEmptyDocument } from '../utils/document';
import {
  getEditorValueWithMedia,
  __temporaryFixForConfigPanel,
} from '../utils/action';
import { EventDispatcher, createDispatch } from '../event-dispatcher';
import { safeInsert } from 'prosemirror-utils';
import { AnalyticsEventPayload } from '@atlaskit/analytics-next/AnalyticsEvent';
import { analyticsEventKey } from '@atlaskit/editor-common';
import { findNodePosWithLocalId } from '../plugins/extension/utils';

export type ContextUpdateHandler = (
  editorView: EditorView,
  eventDispatcher: EventDispatcher,
) => void;

export interface EditorActionsOptions<T> {
  focus(): boolean;
  blur(): boolean;
  clear(): boolean;
  getValue(): Promise<T | JSONDocNode | undefined>;
  getNodeByLocalId(id: string): Node | undefined;
  replaceDocument(rawValue: any): boolean;
  replaceSelection(rawValue: Node | Object | string): boolean;
  appendText(text: string): boolean;
  isDocumentEmpty(): boolean;
}

export default class EditorActions<T = any> implements EditorActionsOptions<T> {
  private editorView?: EditorView;
  private contentTransformer?: Transformer<T>;
  private contentEncode?: Transformer<T>['encode'];
  private eventDispatcher?: EventDispatcher;
  private listeners: Array<ContextUpdateHandler> = [];

  static from<T>(
    view: EditorView,
    eventDispatcher: EventDispatcher,
    transformer?: Transformer<T>,
  ) {
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

  // This method needs to be public for EditorContext component.
  _privateRegisterEditor(
    editorView: EditorView,
    eventDispatcher: EventDispatcher,
    contentTransformer?: Transformer<T>,
  ): void {
    this.contentTransformer = contentTransformer;
    this.eventDispatcher = eventDispatcher;

    if (!this.editorView && editorView) {
      this.editorView = editorView;
      this.listeners.forEach((cb) => cb(editorView, eventDispatcher));
    } else if (this.editorView !== editorView) {
      throw new Error(
        "Editor has already been registered! It's not allowed to re-register editor with the new Editor instance.",
      );
    }

    if (this.contentTransformer) {
      this.contentEncode = this.contentTransformer.encode.bind(
        this.contentTransformer,
      );
    }
  }

  // This method needs to be public for EditorContext component.
  _privateUnregisterEditor(): void {
    this.editorView = undefined;
    this.contentTransformer = undefined;
    this.contentEncode = undefined;
    this.eventDispatcher = undefined;
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

  async __temporaryFixForConfigPanel() {
    const { editorView } = this;
    if (!editorView) {
      return;
    }

    __temporaryFixForConfigPanel(editorView);
  }

  // WARNING: this may be called repeatedly, async with care
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

    const nodeSanitized = Node.fromJSON(this.editorView!.state.schema, json);
    return this.contentEncode(nodeSanitized);
  }

  getNodeByLocalId(id: string): Node | undefined {
    if (this.editorView?.state) {
      return findNodePosWithLocalId(this.editorView?.state, id)?.node;
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

  replaceDocument(
    rawValue: any,
    shouldScrollToBottom = true,
    shouldAddToHistory = true,
  ): boolean {
    if (!this.editorView || rawValue === undefined || rawValue === null) {
      return false;
    }

    const { state } = this.editorView;
    const { schema } = state;

    const content = processRawValue(
      schema,
      rawValue,
      undefined,
      undefined,
      this.contentTransformer as Transformer<any>,
      this.dispatchAnalyticsEvent,
    );

    if (!content) {
      return false;
    }

    // In case of replacing a whole document, we only need a content of a top level node e.g. document.
    let tr = state.tr.replaceWith(0, state.doc.nodeSize - 2, content.content);
    if (!shouldScrollToBottom && !tr.selectionSet) {
      // Restore selection at start of document instead of the end.
      tr.setSelection(Selection.atStart(tr.doc));
    }

    if (shouldScrollToBottom) {
      tr = tr.scrollIntoView();
    }
    if (!shouldAddToHistory) {
      tr.setMeta('addToHistory', false);
    }

    this.editorView.dispatch(tr);

    return true;
  }

  replaceSelection(
    rawValue: Node | Object | string,
    tryToReplace?: boolean,
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
    const content = processRawValue(schema, rawValue);

    if (!content) {
      return false;
    }

    // try to find a place in the document where to insert a node if its not allowed at the cursor position by schema
    this.editorView.dispatch(
      safeInsert(content, undefined, tryToReplace)(state.tr).scrollIntoView(),
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
}
