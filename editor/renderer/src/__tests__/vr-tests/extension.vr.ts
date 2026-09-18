import { snapshot } from '@af/visual-regression';

import {
	ExtensionAwesomeList,
	ExtensionBlockEh,
	ExtensionsWithLayout,
	ExtensionsWithinTable,
	ExtensionIframeNested,
	ExtensionInlineEh,
	ExtensionInlineEhPlainTextMacroLongText,
	ExtensionInlineEhPlainTextMacro,
} from './extension.fixture.vr.ap';

snapshot(ExtensionAwesomeList);
snapshot(ExtensionBlockEh);
snapshot(ExtensionsWithLayout);
snapshot(ExtensionsWithinTable);
snapshot(ExtensionIframeNested);
snapshot(ExtensionInlineEh);
snapshot(ExtensionInlineEhPlainTextMacro);
snapshot(ExtensionInlineEhPlainTextMacroLongText);
