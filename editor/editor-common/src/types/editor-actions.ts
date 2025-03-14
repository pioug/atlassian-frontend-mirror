import type { JSONDocNode } from '@atlaskit/editor-json-transformer';
import type { Node } from '@atlaskit/editor-prosemirror/model';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';

import type { ResolvedEditorState } from '../collab';
import type { EventDispatcher } from '../event-dispatcher';

export type ContextUpdateHandler = (
	editorView: EditorView,
	eventDispatcher: EventDispatcher,
) => void;

export type ReplaceRawValue = Node | object | string;
export type GetResolvedEditorStateReason = 'publish' | 'draft-sync' | 'get-content';
// Ignored via go/ees005
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface EditorActionsOptions<T = any> {
	focus(): boolean;
	blur(): boolean;
	clear(): boolean;
	getValue(): Promise<T | JSONDocNode | undefined>;
	getNodeByLocalId(id: string): Node | undefined;
	getNodeByFragmentLocalId(id: string): Node | undefined;
	getSelectedNode(): Node | undefined;
	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	replaceDocument(rawValue: any): boolean;
	replaceSelection(rawValue: ReplaceRawValue | Array<ReplaceRawValue>): boolean;
	appendText(text: string): boolean;
	isDocumentEmpty(): boolean;
	getResolvedEditorState(
		reason: GetResolvedEditorStateReason,
	): Promise<ResolvedEditorState | undefined>;
}
