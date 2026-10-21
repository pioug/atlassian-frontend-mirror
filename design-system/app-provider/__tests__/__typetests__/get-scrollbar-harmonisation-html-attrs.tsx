import getDefaultHtmlAttrs, {
	getScrollbarHarmonisationHtmlAttrs,
} from '../../src/scrollbar-harmonisation/get-scrollbar-harmonisation-html-attrs';

export function checkInputTypes(
	input?: boolean | { isEnabled: boolean; isTransparentEnabled: boolean },
): void {
	getScrollbarHarmonisationHtmlAttrs(input);
	getDefaultHtmlAttrs(input);
	getScrollbarHarmonisationHtmlAttrs();
	getDefaultHtmlAttrs(undefined);
	getScrollbarHarmonisationHtmlAttrs(true);
	getDefaultHtmlAttrs(false);
	getScrollbarHarmonisationHtmlAttrs({ isEnabled: true, isTransparentEnabled: false });
	getDefaultHtmlAttrs({ isEnabled: false, isTransparentEnabled: true });

	// @ts-expect-error Both product-resolved gate results are required.
	getScrollbarHarmonisationHtmlAttrs({ isEnabled: true });
	// @ts-expect-error Both product-resolved gate results are required.
	getDefaultHtmlAttrs({ isTransparentEnabled: true });
}
