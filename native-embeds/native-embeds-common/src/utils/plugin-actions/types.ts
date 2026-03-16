import type { Command, NextEditorPlugin } from '@atlaskit/editor-common/types';
import type { Node, Schema } from '@atlaskit/editor-prosemirror/model';
import type { EditorState, Transaction } from '@atlaskit/editor-prosemirror/state';

/** Accepted layout values from ADF schema (embedCard) */
export type NativeEmbedLayout =
	| 'wide'
	| 'full-width'
	| 'center'
	| 'wrap-right'
	| 'wrap-left'
	| 'align-end'
	| 'align-start';

/** Input attrs for embedCard node (subset used by transform) */
export interface NativeEmbedTransformAttrs {
	layout?: NativeEmbedLayout;
	originalHeight?: number | null;
	originalWidth?: number | null;
	url: string;
	width?: number;
}

/** Type for cardToNativeEmbedNode - converts embed attrs to native embed Node */
export type CardToNativeEmbedNode = (
	schema: Schema,
	attrs: NativeEmbedTransformAttrs,
) => Node | undefined;

/** Type for createEmbedCardToNativeEmbedTransform - returns a Command */
export type CreateCardToNativeEmbedTransform = (
	options?: CardToNativeEmbedTransformOptions,
) => Command;

export interface CardToNativeEmbedTransformOptions {
	/**
	 * Called before dispatch to allow the caller to augment the transaction
	 * (e.g. datasource stash, analytics, link metadata).
	 */
	augmentTransaction?: (tr: Transaction, state: EditorState) => void;
}

/**
 * Minimal plugin type for native embeds action integration.
 */
export type EditorPluginNativeEmbedsPlugin = NextEditorPlugin<
	'editorPluginNativeEmbeds',
	{
		actions: {
			cardToNativeEmbedNode: CardToNativeEmbedNode;
			createCardToNativeEmbedTransform: CreateCardToNativeEmbedTransform;
		};
	}
>;
