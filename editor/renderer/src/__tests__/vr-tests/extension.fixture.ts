import {
	extensionAwesomeList,
	extensionBlockEh,
	extensionsWithLayout,
	extensionsWithinTable,
	inlineExtensionAdf,
	inlineExtensionPlainTextMacroAdf,
	inlineExtensionPlainTextMacroAdfLongText,
} from '../__fixtures__/extension-layouts';
import * as nestedIframe from '../__fixtures__/extension-iframe-nested.adf.json';
import { generateRendererComponent } from '../__helpers/rendererComponents';
import { extensionHandlers } from '@atlaskit/editor-test-helpers/extensions';

export const ExtensionAwesomeList = generateRendererComponent({
	document: extensionAwesomeList,
	appearance: 'full-page',
	extensionHandlers,
});

export const ExtensionInlineEh = generateRendererComponent({
	document: inlineExtensionAdf,
	appearance: 'full-page',
	extensionHandlers,
});

export const ExtensionInlineEhPlainTextMacro = generateRendererComponent({
	document: inlineExtensionPlainTextMacroAdf,
	appearance: 'full-page',
	extensionHandlers,
});
export const ExtensionInlineEhPlainTextMacroLongText = generateRendererComponent({
	document: inlineExtensionPlainTextMacroAdfLongText,
	appearance: 'full-page',
	extensionHandlers,
});

export const ExtensionBlockEh = generateRendererComponent({
	document: extensionBlockEh,
	appearance: 'full-page',
	extensionHandlers,
});

export const ExtensionsWithLayout = generateRendererComponent({
	document: extensionsWithLayout,
	appearance: 'full-page',
	extensionHandlers,
});

export const ExtensionsWithinTable = generateRendererComponent({
	document: extensionsWithinTable,
	appearance: 'full-page',
	extensionHandlers,
	UNSTABLE_allowTableResizing: true,
});

export const ExtensionIframeNested = generateRendererComponent({
	document: nestedIframe,
	appearance: 'full-width',
	extensionHandlers,
});
