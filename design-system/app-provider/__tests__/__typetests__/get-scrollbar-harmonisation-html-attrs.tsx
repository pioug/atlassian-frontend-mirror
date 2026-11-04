import getDefaultHtmlAttrs, {
	getScrollbarHarmonisationHtmlAttrs,
} from '../../src/scrollbar-harmonisation/get-scrollbar-harmonisation-html-attrs';

export function checkInputTypes(
	input?: boolean | { isEnabled: boolean; isTransparentEnabled?: boolean },
): void {
	getScrollbarHarmonisationHtmlAttrs(input);
	getDefaultHtmlAttrs(input);
	getScrollbarHarmonisationHtmlAttrs();
	getDefaultHtmlAttrs(undefined);
	getScrollbarHarmonisationHtmlAttrs(true);
	getDefaultHtmlAttrs(false);
	getScrollbarHarmonisationHtmlAttrs({ isEnabled: true, isTransparentEnabled: false });
	getDefaultHtmlAttrs({ isEnabled: false, isTransparentEnabled: true });

	getScrollbarHarmonisationHtmlAttrs({ isEnabled: true });
	// @ts-expect-error The product-resolved base value is required.
	getDefaultHtmlAttrs({ isTransparentEnabled: true });
}
