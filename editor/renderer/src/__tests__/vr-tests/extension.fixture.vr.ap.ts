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
import { generateRendererComponent } from '../__helpers/rendererComponents.vr.ap';
import { extensionHandlers } from '@atlaskit/editor-test-helpers/extensions';
import type { ComponentType } from 'react';

export const ExtensionAwesomeList: ComponentType<any> = generateRendererComponent({
	document: extensionAwesomeList,
	appearance: 'full-page',
	extensionHandlers,
});

export const ExtensionInlineEh: ComponentType<any> = generateRendererComponent({
	document: inlineExtensionAdf,
	appearance: 'full-page',
	extensionHandlers,
});

export const ExtensionInlineEhPlainTextMacro: ComponentType<any> = generateRendererComponent({
	document: inlineExtensionPlainTextMacroAdf,
	appearance: 'full-page',
	extensionHandlers,
});
export const ExtensionInlineEhPlainTextMacroLongText: ComponentType<any> =
	generateRendererComponent({
		document: inlineExtensionPlainTextMacroAdfLongText,
		appearance: 'full-page',
		extensionHandlers,
	});

export const ExtensionBlockEh: ComponentType<any> = generateRendererComponent({
	document: extensionBlockEh,
	appearance: 'full-page',
	extensionHandlers,
});

export const ExtensionsWithLayout: ComponentType<any> = generateRendererComponent({
	document: extensionsWithLayout,
	appearance: 'full-page',
	extensionHandlers,
});

export const ExtensionsWithinTable: ComponentType<any> = generateRendererComponent({
	document: extensionsWithinTable,
	appearance: 'full-page',
	extensionHandlers,
	UNSTABLE_allowTableResizing: true,
});

export const ExtensionIframeNested: ComponentType<any> = generateRendererComponent({
	document: nestedIframe,
	appearance: 'full-width',
	extensionHandlers,
});
