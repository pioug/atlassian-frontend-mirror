import { getDocument } from '@atlaskit/browser-apis';

export function getStylesheetMetrics(): any {
	try {
		const doc = getDocument();
		if (!doc) {
			return {};
		}
		const stylesheets = Array.from(doc.styleSheets);
		const stylesheetCount = stylesheets.length;
		const cssrules = Array.from(doc.styleSheets).reduce((acc, item) => {
			// Other domain stylesheets throw a SecurityError
			try {
				return acc + item.cssRules.length;
			} catch {
				return acc;
			}
		}, 0);

		const styleElements = doc.querySelectorAll('style').length;
		const styleProps = doc.querySelectorAll('[style]');
		const styleDeclarations = Array.from(doc.querySelectorAll('[style]')).reduce((acc, item) => {
			try {
				if ('style' in item) {
					return acc + (item as HTMLDivElement).style.length;
				} else {
					return acc;
				}
			} catch {
				return acc;
			}
		}, 0);

		return {
			'ufo:stylesheets': stylesheetCount,
			'ufo:styleElements': styleElements,
			'ufo:styleProps': styleProps.length,
			'ufo:styleDeclarations': styleDeclarations,
			'ufo:cssrules': cssrules,
		};
	} catch {
		return {};
	}
}
