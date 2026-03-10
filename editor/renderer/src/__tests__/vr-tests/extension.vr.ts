import {
	ExtensionAwesomeList,
	ExtensionBlockEh,
	ExtensionsWithLayout,
	ExtensionsWithinTable,
	ExtensionIframeNested,
	ExtensionInlineEh,
	ExtensionInlineEhPlainTextMacroLongText,
	ExtensionInlineEhPlainTextMacro,
} from './extension.fixture';
import { snapshot } from '@af/visual-regression';

snapshot(ExtensionAwesomeList);
snapshot(ExtensionBlockEh);
snapshot(ExtensionsWithLayout);
snapshot(ExtensionsWithinTable);
snapshot(ExtensionIframeNested);
snapshot(ExtensionInlineEh);
snapshot(ExtensionInlineEhPlainTextMacro);
snapshot(ExtensionInlineEhPlainTextMacroLongText);
