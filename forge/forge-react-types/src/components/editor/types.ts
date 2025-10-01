// COPIED FROM forge-ui-kit-editor/src/types.ts

import type { JSONDocNode } from '@atlaskit/editor-json-transformer';

export type Appearance = 'comment' | 'chromeless';

export type Features = {
	/**
	 * Enables text to be different heading levels or in quote blocks.
	 */
	blockType?: boolean;
	/**
	 * Enables text to be placed in a code block.
	 */
	codeBlock?: boolean;
	/**
	 * Enables links to become hyperlink.
	 */
	hyperLink?: boolean;
	/**
	 * Enables toolbar items for link, codeblock and quote block.
	 */
	insertBlock?: boolean;
	/**
	 * Enables ordered and unordered lists.
	 */
	list?: boolean;
	/**
	 * Enables the quick insert menu. Type '/' to open the menu in the editor.
	 */
	quickInsert?: boolean;
	/**
	 * Enables color on text.
	 */
	textColor?: boolean;
	/**
	 * Enables stylistic formatting on text. This allows text to be set to bold, italic, underline, strikethrough code, subscript and superscript.
	 */
	textFormatting?: boolean;
};

export type EditorProps = {
	/**
	 * Set the default editor content.
	 */
	defaultValue?: JSONDocNode;
	/**
	 * Set allowed features in the editor.
	 */
	features?: Features;
	/**
	 * Set if the editor should be disabled
	 */
	isDisabled?: boolean;
	/**
	 * Handler called when the inputs value changes.
	 */
	onChange?: (value?: JSONDocNode) => void;
};
