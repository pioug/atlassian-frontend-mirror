import type { INPUT_METHOD } from '../analytics';
/**
 * Configuration for the Text Formatting plugin
 */
export interface TextFormattingOptions {
	disableSuperscriptAndSubscript?: boolean;
	disableUnderline?: boolean;
	disableCode?: boolean;
	disableSmartTextCompletion?: boolean;
	disableStrikethrough?: boolean;
	responsiveToolbarMenu?: boolean;
}

export interface TextFormattingState {
	emActive?: boolean;
	emDisabled?: boolean;
	emHidden?: boolean;
	codeActive?: boolean;
	codeDisabled?: boolean;
	codeHidden?: boolean;
	underlineActive?: boolean;
	underlineDisabled?: boolean;
	underlineHidden?: boolean;
	strikeActive?: boolean;
	strikeDisabled?: boolean;
	strikeHidden?: boolean;
	strongActive?: boolean;
	strongDisabled?: boolean;
	strongHidden?: boolean;
	superscriptActive?: boolean;
	superscriptDisabled?: boolean;
	superscriptHidden?: boolean;
	subscriptActive?: boolean;
	subscriptDisabled?: boolean;
	subscriptHidden?: boolean;
	formattingIsPresent?: boolean;
}

export type InputMethodToolbar = INPUT_METHOD.TOOLBAR;
export type InputMethodBasic = InputMethodToolbar | INPUT_METHOD.SHORTCUT | INPUT_METHOD.FORMATTING;
