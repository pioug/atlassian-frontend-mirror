import type { API, default as core, FileInfo, Options } from 'jscodeshift';

import { getDefaultSpecifier } from './utils';

export default function transformer(fileInfo: FileInfo, { jscodeshift: j }: API, options: Options) {
	const base = j(fileInfo.source);
	const bannerSpecifier = getDefaultSpecifier(j, base, '@atlaskit/banner');
	if (!bannerSpecifier) {
		return;
	}

	replaceIsOpenProp(j, base, bannerSpecifier);

	return base.toSource();
}

function replaceIsOpenProp(j: core.JSCodeshift, source: ReturnType<typeof j>, specifier: string) {
	source.findJSXElements(specifier).forEach((element) => {
		j(element)
			.find(j.JSXAttribute, { name: { type: 'JSXIdentifier', name: 'isOpen' } })
			.forEach((attr) => {
				const attrValue = j(attr).nodes()[0].value;

				if (!attrValue) {
					j(attr).remove();
				} else {
					const expression = attrValue.expression;

					const originalElement = j(element).nodes()[0];
					const newExpression = j.jsxExpressionContainer(
						j.logicalExpression('&&', expression, originalElement),
					);

					j(element).replaceWith(newExpression);
					j(attr).remove();
				}
			});
	});
}
