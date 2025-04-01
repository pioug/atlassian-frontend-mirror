/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Shared types file for UI Kit components. Add shared types to `packages/forge/forge-ui/src/components/UIKit/types.ts` for it to be code generated here and imported correctly into prop type files
 *
 * @codegen <<SignedSource::7534fd56d0755471bbb511d02af85755>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit/types.ts <<SignedSource::8e94b178979d70c4e88516b6704efa32>>
 */
import type { JSONDocNode } from '@atlaskit/editor-json-transformer';

// ---- Types for Form components
export type SerialisableEvent = {
	bubbles: boolean;
	cancelable: boolean;
	defaultPrevented: boolean;
	eventPhase: number;
	isTrusted: boolean;
	target: {
		selectionStart?: number | null;
		selectionEnd?: number | null;
		value?: any;
		checked?: boolean;
		name?: string;
		id?: string;
		tagName?: string;
		type?: string;
	};
	timeStamp: number;
	type: string;
};

export type InputEvent = SerialisableEvent;

export type EventHandlerProps = {
	onChange?: (event: InputEvent) => void;
	onBlur?: (event: InputEvent) => void;
	onFocus?: (event: InputEvent) => void;
};

// ----- Types for Editor component
export type Appearance = 'comment' | 'chromeless';

export type Features = {
	/**
	 * Enables text to be different heading levels or in quote blocks.
	 */
	blockType?: boolean;
	/**
	 * Enables stylistic formatting on text. This allows text to be set to bold, italic, underline, strikethrough code, subscript and superscript.
	 */
	textFormatting?: boolean;
	/**
	 * Enables ordered and unordered lists.
	 */
	list?: boolean;
	/**
	 * Enables toolbar items for link, codeblock and quote block.
	 */
	insertBlock?: boolean;
	/**
	 * Enables color on text.
	 */
	textColor?: boolean;
	/**
	 * Enables links to become hyperlink.
	 */
	hyperLink?: boolean;
	/**
	 * Enables the quick insert menu. Type '/' to open the menu in the editor.
	 */
	quickInsert?: boolean;
	/**
	 * Enables text to be placed in a code block.
	 */
	codeBlock?: boolean;
};

export type EditorProps = {
	/**
	 * Handler called when the inputs value changes.
	 */
	onChange?: (value?: JSONDocNode) => void;
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
};
// ------
