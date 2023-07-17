import type { Node } from 'prosemirror-model';
import type { EditorView } from 'prosemirror-view';

import type { JSONDocNode } from '@atlaskit/editor-json-transformer';

import type { ResolvedEditorState } from '../collab';
import type { EventDispatcher } from '../event-dispatcher';

export type ContextUpdateHandler = (
  editorView: EditorView,
  eventDispatcher: EventDispatcher,
) => void;

export type ReplaceRawValue = Node | object | string;
export interface EditorActionsOptions<T = any> {
  focus(): boolean;
  blur(): boolean;
  clear(): boolean;
  getValue(): Promise<T | JSONDocNode | undefined>;
  getNodeByLocalId(id: string): Node | undefined;
  getNodeByFragmentLocalId(id: string): Node | undefined;
  getSelectedNode(): Node | undefined;
  replaceDocument(rawValue: any): boolean;
  replaceSelection(rawValue: ReplaceRawValue | Array<ReplaceRawValue>): boolean;
  appendText(text: string): boolean;
  isDocumentEmpty(): boolean;
  getResolvedEditorState(): Promise<ResolvedEditorState | undefined>;
}
