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
	// eslint-disable-next-line @typescript-eslint/method-signature-style -- ignored via go/ees013 (to be fixed)
	focus(): boolean;
	// eslint-disable-next-line @typescript-eslint/method-signature-style -- ignored via go/ees013 (to be fixed)
	blur(): boolean;
	// eslint-disable-next-line @typescript-eslint/method-signature-style -- ignored via go/ees013 (to be fixed)
	clear(): boolean;
	// eslint-disable-next-line @typescript-eslint/method-signature-style -- ignored via go/ees013 (to be fixed)
	getValue(): Promise<T | JSONDocNode | undefined>;
	// eslint-disable-next-line @typescript-eslint/method-signature-style -- ignored via go/ees013 (to be fixed)
	getNodeByLocalId(id: string): Node | undefined;
	// eslint-disable-next-line @typescript-eslint/method-signature-style -- ignored via go/ees013 (to be fixed)
	getNodeByFragmentLocalId(id: string): Node | undefined;
	// eslint-disable-next-line @typescript-eslint/method-signature-style -- ignored via go/ees013 (to be fixed)
	getSelectedNode(): Node | undefined;
	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/method-signature-style -- method-signature-style ignored via go/ees013 (to be fixed)
	replaceDocument(rawValue: any): boolean;
	// eslint-disable-next-line @typescript-eslint/method-signature-style -- ignored via go/ees013 (to be fixed)
	replaceSelection(rawValue: ReplaceRawValue | Array<ReplaceRawValue>): boolean;
	// eslint-disable-next-line @typescript-eslint/method-signature-style -- ignored via go/ees013 (to be fixed)
	appendText(text: string): boolean;
	// eslint-disable-next-line @typescript-eslint/method-signature-style -- ignored via go/ees013 (to be fixed)
	isDocumentEmpty(): boolean;
	// eslint-disable-next-line @typescript-eslint/method-signature-style -- ignored via go/ees013 (to be fixed)
	getResolvedEditorState(
		reason: GetResolvedEditorStateReason,
	): Promise<ResolvedEditorState | undefined>;
}
