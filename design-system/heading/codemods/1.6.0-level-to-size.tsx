import type {
	API,
	ASTPath,
	default as core,
	FileInfo,
	ImportDeclaration,
	Options,
} from 'jscodeshift';

export default function transformer(fileInfo: FileInfo, { jscodeshift: j }: API, options: Options) {
	const base = j(fileInfo.source);
	const headingSpecifier = getDefaultSpecifier(j, base, '@atlaskit/heading');
	if (!headingSpecifier) {
		return;
	}

	replaceLevelWithSize(j, base, headingSpecifier);

	return base.toSource();
}

const levelToSizeMap = {
	h900: 'xxlarge',
	h800: 'xlarge',
	h700: 'large',
	h600: 'medium',
	h500: 'small',
	h400: 'xsmall',
	h300: 'xxsmall',
	// We may want to auto-transform h100s and h200s in the future
	// h200: 'xxsmall',
	// h100: 'xxsmall',
};

function replaceLevelWithSize(
	j: core.JSCodeshift,
	source: ReturnType<typeof j>,
	specifier: string,
) {
	source.findJSXElements(specifier).forEach((element) => {
		j(element)
			.find(j.JSXAttribute, { name: { type: 'JSXIdentifier', name: 'level' } })
			.forEach((attr) => {
				const attrValue = j(attr).nodes()[0].value;
				if (attrValue.type === 'StringLiteral') {
					const replacementValue = levelToSizeMap[attrValue.value as keyof typeof levelToSizeMap];
					if (replacementValue) {
						j(attr).replaceWith(
							j.jsxAttribute(j.jsxIdentifier('size'), j.stringLiteral(replacementValue)),
						);
					}
				}
			});
	});
}

function getDefaultSpecifier(j: core.JSCodeshift, source: any, specifier: string) {
	const specifiers = source
		.find(j.ImportDeclaration)
		.filter((path: ASTPath<ImportDeclaration>) => path.node.source.value === specifier)
		.find(j.ImportDefaultSpecifier);
	if (!specifiers.length) {
		return null;
	}
	return specifiers.nodes()[0]!.local!.name;
}
