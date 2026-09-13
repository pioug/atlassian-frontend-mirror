import type {
	ASTPath,
	CallExpression,
	Collection,
	default as core,
	importDeclaration,
	ImportDeclaration,
	ImportDefaultSpecifier,
	ImportSpecifier,
	JSXAttribute,
	JSXElement,
	Program,
	StringLiteral,
	TemplateElement,
	VariableDeclaration,
	VariableDeclarator,
} from 'jscodeshift';

function getNamedSpecifier(
	j: core.JSCodeshift,
	source: Collection<Node>,
	specifier: string,
	importName: string,
): string | null {
	const specifiers = source
		.find(j.ImportDeclaration)
		.filter((path: ASTPath<ImportDeclaration>) => path.node.source.value === specifier)
		.find(j.ImportSpecifier)
		.filter((path: ASTPath<ImportSpecifier>) => path.node.imported.name === importName);

	if (!specifiers.length) {
		return null;
	}
	return specifiers.nodes()[0]!.local!.name;
}

const getDynamicImportName = (
	j: core.JSCodeshift,
	source: Collection<any>,
	importPath: string,
): string | null => {
	const dynamicImports = source.find(j.VariableDeclarator).filter((variableDeclaratorPath) => {
		return (
			j(variableDeclaratorPath)
				.find(j.CallExpression)
				.filter((callExpressionPath) => {
					const { callee, arguments: callExpressionArguments } = callExpressionPath.node;

					return !!(
						isCallExpressionCalleeImportType(callee) &&
						isCallExpressionArgumentStringLiteralType(callExpressionArguments) &&
						isCallExpressionArgumentValueMatches(callExpressionArguments[0], j, importPath)
					);
				}).length > 0
		);
	});

	if (!dynamicImports.length) {
		return null;
	}

	const { id } = dynamicImports.nodes()[0];

	if (id.type !== 'Identifier') {
		return null;
	}

	return id.name;
};
const isCallExpressionCalleeImportType = (callee: CallExpression['callee']) => {
	return callee && callee.type === 'Import';
};
const isCallExpressionArgumentStringLiteralType = (
	callExpressionArguments: CallExpression['arguments'],
) => {
	return (
		callExpressionArguments &&
		callExpressionArguments.length &&
		callExpressionArguments[0].type === 'StringLiteral'
	);
};
const isCallExpressionArgumentValueMatches = (
	callExpressionArgument: CallExpression['arguments'][0],
	j: core.JSCodeshift,
	value: string,
) => {
	return j(callExpressionArgument).some((path) => path.node.value === value);
};

const addDynamicImport = (
	j: core.JSCodeshift,
	target: Collection<VariableDeclaration>,
	name: string,
	packageEndpoint: string,
): void => {
	const node = j.variableDeclaration('const', [
		j.variableDeclarator(
			j.identifier(name),
			j.callExpression(j.memberExpression(j.identifier('React'), j.identifier('lazy')), [
				j.arrowFunctionExpression(
					[],
					j.callExpression(j.import(), [j.stringLiteral(packageEndpoint)]),
				),
			]),
		),
	]);

	target.insertAfter(node);
	addCommentBefore(
		j,
		j(node),
		'We have added "React.lazy" here. Feel free to change it to "lazy" or other named import depending upon how you imported.',
	);
};

// not replacing newlines (which \s does)
const spacesAndTabs: RegExp = /[ \t]{2,}/g;
const lineStartWithSpaces: RegExp = /^[ \t]*/gm;

function clean(value: string): string {
	return value.replace(spacesAndTabs, ' ').replace(lineStartWithSpaces, '').trim();
}

const addCommentToStartOfFile = ({
	j,
	base,
	message,
}: {
	j: core.JSCodeshift;
	base: Collection<Node>;
	message: string;
}): void => {
	addCommentBefore(j, base.find(j.Program), message);
};

function addCommentBefore(
	j: core.JSCodeshift,
	target:
		| Collection<Program>
		| Collection<ImportDeclaration>
		| Collection<JSXElement>
		| Collection<JSXAttribute>
		| Collection<CallExpression>
		| Collection<VariableDeclarator>,
	message: string,
	commentType: 'block' | 'line' = 'block',
	messagePrefix = 'TODO: (from codemod) ',
): void {
	const msg = clean(messagePrefix + message);
	const content = commentType === 'block' ? ` ${msg} ` : ` ${msg}`;
	target.forEach(
		(
			path:
				| ASTPath<Program>
				| ASTPath<ImportDeclaration>
				| ASTPath<JSXElement>
				| ASTPath<CallExpression>
				| ASTPath<VariableDeclarator>
				| ASTPath<JSXAttribute>,
		) => {
			path.value.comments = path.value.comments || [];

			const exists = path.value.comments.find((comment: any) => comment.value === content);

			// avoiding duplicates of the same comment
			if (exists) {
				return;
			}

			if (commentType === 'block') {
				path.value.comments.push(j.commentBlock(content));
			} else {
				path.value.comments.push(j.commentLine(content));
			}
		},
	);
}

const getDefaultSpecifier = (
	j: core.JSCodeshift,
	source: Collection<Node>,
	specifier: string,
): string | null => {
	const specifiers = source
		.find(j.ImportDeclaration)
		.filter((path: ASTPath<ImportDeclaration>) => path.node.source.value === specifier)
		.find(j.ImportDefaultSpecifier);

	if (!specifiers.length) {
		return null;
	}
	return specifiers.nodes()[0]!.local!.name;
};

// @ts-ignore
const getJSXAttributesByName = (
	j: core.JSCodeshift,
	element: ASTPath<any>,
	attributeName: string,
): Collection<JSXAttribute> => {
	return j(element)
		.find(j.JSXOpeningElement)
		.at(0)
		.find(j.JSXAttribute)
		.filter((attribute) => {
			const matches = j(attribute)
				.find(j.JSXIdentifier)
				.filter((identifier) => identifier.value.name === attributeName);
			return Boolean(matches.length);
		});
};

const isEmpty: any = (string: StringLiteral): boolean => string && string.value !== '';

const hasImportDeclaration = (
	j: core.JSCodeshift,
	source: Collection<Node>,
	importPath: string,
): boolean => {
	const imports = source
		.find(j.ImportDeclaration)
		.filter((path: ASTPath<ImportDeclaration>) => path.node.source.value === importPath);

	return Boolean(imports.length);
};

const hasImportDeclarationFromAnyPackageEntrypoint = (
	j: core.JSCodeshift,
	source: Collection<Node>,
	packageName: string,
): boolean => {
	const imports = source.find(j.ImportDeclaration).filter((path: ASTPath<ImportDeclaration>) =>
		// @ts-ignore
		path?.node?.source?.value.toString().startsWith(packageName),
	);

	return Boolean(imports.length);
};

const debug =
	(component: string) =>
	(j: core.JSCodeshift, source: Collection<Node>): void => {
		const defaultSpecifier = getDefaultSpecifier(j, source, component);

		if (!defaultSpecifier) {
			return;
		}

		source.findJSXElements(defaultSpecifier).forEach((element) => {
			console.log(element); //eslint-disable-line no-console
		});
	};

export function placeholderStringMatches(placeholderStr: string, resolvedStr: string): boolean {
	if (placeholderStr === resolvedStr) {
		return true;
	}
	let value = '';
	let offset = 0;
	const partsPlaceholder = placeholderStr.split(' ');
	const partsResolved = resolvedStr.split(' ');
	partsPlaceholder.forEach((p, i) => {
		// Placeholder
		if (p.startsWith('%')) {
			// Trim remaining words from current position to avoid premature matching from previous parts
			const remainingWords = partsResolved.slice(i + offset);
			const nextWordIndex = remainingWords.indexOf(partsPlaceholder[i + 1]);
			const hasNextWord = nextWordIndex !== -1;
			if (hasNextWord) {
				offset += nextWordIndex - 1;
			}
			const insert = remainingWords.slice(0, hasNextWord ? nextWordIndex : undefined).join(' ');
			value += `${insert} `;
			// Regular words
		} else {
			value += `${p} `;
		}
	});
	return value.trimRight() === resolvedStr;
}

/**
 * Check whether a value contains a Format Specifier (printf placeholder)
 *
 * @see https://jestjs.io/docs/api#testeachtablename-fn-timeout
 * @see https://nodejs.org/api/util.html#utilformatformat-args
 *
 * @param argValue The string potentially containing a format specifier (e.g. 'Foo %s')
 * @param str The string that has replaced a format specifier with a tangible value (e.g. 'Foo Bar`)
 *
 * @returns Boolean: True if the strings matched (after considering the placeholder), or false if not.
 */
export function matchesStringWithFormatSpecifier(
	argValue: string | number | boolean | RegExp | null,
	str: string,
): boolean {
	const value = String(argValue);
	// Check whether value contains a printf format placeholder e.g. %s, %d etc
	if (value && value.match(/%(p|s|d|i|f|j|o|#)/g)) {
		return placeholderStringMatches(value, str);
	} else {
		// No format specifier placeholder
		return false;
	}
}

const checkForTemplateLiteralsWithPlaceholders = (quasis: TemplateElement[], str: string) => {
	const templateStrs = quasis.map((quasi) => quasi.value.raw.trim()).join('.*');
	let regex = new RegExp(templateStrs);
	return regex.test(str);
};

const callExpressionArgMatchesString = (
	arg: CallExpression['arguments'][number],
	str: string,
): boolean => {
	switch (arg.type) {
		case 'StringLiteral':
		case 'Literal': {
			if (arg.value === str) {
				return true;
			} else {
				// Eg: 'should contain %s'
				return matchesStringWithFormatSpecifier(arg.value, str);
			}
		}
		case 'TemplateLiteral': {
			// fuzzy match template literals, skipping expressions
			const templateStrs = arg.quasis
				.map((quasi) => {
					return quasi.value.raw.trim();
				})
				.join(' ');
			if (str.trim() === templateStrs.trim()) {
				return true;
			} else {
				// Eg: `should contain ${value}`
				return checkForTemplateLiteralsWithPlaceholders(arg.quasis, str);
			}
		}
		case 'BinaryExpression': {
			return false;
		}
		default: {
			return false;
		}
	}
};

const testMethodVariantEach = (
	path: ASTPath<CallExpression>,
	testMethods: Set<string>,
): boolean => {
	const variants = new Set(['each']);
	return (
		// @ts-ignore
		path.value?.callee?.callee?.type === 'MemberExpression' &&
		// @ts-ignore
		testMethods.has(path.value?.callee?.callee?.object?.name) &&
		// @ts-ignore
		variants.has(path.value?.callee?.callee?.property?.name)
	);
};

const hasJSXAttributesByName = (
	j: core.JSCodeshift,
	element: ASTPath<any>,
	attributeName: string,
): boolean => getJSXAttributesByName(j, element, attributeName).length > 0;

const doesIdentifierExist = (j: core.JSCodeshift, base: Collection<any>, name: string): boolean => {
	return base.find(j.Identifier).filter((identifer) => identifer.value.name === name).length > 0;
};

function removeImport(j: core.JSCodeshift, base: Collection<any>, packageName: string): void {
	base
		.find(j.ImportDeclaration)
		.filter((path) => path.node.source.value === packageName)
		.remove();
}

function tryCreateImport(
	j: core.JSCodeshift,
	base: Collection<any>,
	relativeToPackage: string,
	packageName: string,
	shouldBeTypeImport?: boolean,
): void {
	const matches = base
		.find(j.ImportDeclaration)
		.filter((path) => path.value.source.value === packageName);

	const exists: boolean = matches.length > 0;

	if (exists) {
		if (shouldBeTypeImport) {
			// if the matched import declarations are not type imports
			// but should be, we update them accordingly
			const isTypeImports: boolean = matches.every((path) => path.value.importKind === 'type');
			if (!isTypeImports) {
				matches
					.filter((path) => path.value.importKind !== 'type')
					.forEach((path) => {
						path.value.importKind = 'type';
					});
				return;
			}
		}
		return;
	}

	// we dynamically build up importDeclaration args, so that if shouldBeTypeImport
	// is falsy, it is never passed explicitly as an importKind parameter (avoiding
	// runtime exceptions during transform runs when importKind is undefined)
	const importDeclarationArgs: Parameters<typeof importDeclaration> = [[], j.literal(packageName)];
	if (shouldBeTypeImport) {
		importDeclarationArgs.push('type');
	}

	base
		.find(j.ImportDeclaration)
		.filter((path) => path.value.source.value === relativeToPackage)
		// we only take the first matching path, to avoid duplicate inserts
		// if the source contains the same import declaration more than once
		.paths()[0]
		.insertBefore(j.importDeclaration(...importDeclarationArgs));
}

function addToImport(
	j: core.JSCodeshift,
	base: Collection<any>,
	importSpecifier: ImportSpecifier | ImportDefaultSpecifier,
	packageName: string,
): void {
	base
		.find(j.ImportDeclaration)
		.filter((path) => path.value.source.value === packageName)
		.at(0)
		.replaceWith((declaration) => {
			return j.importDeclaration(
				[
					// we are appending to the existing specifiers
					// We are doing a filter hear because sometimes specifiers can be removed
					// but they hand around in the declaration
					...(declaration.value.specifiers || []).filter(
						(item) => item.type === 'ImportSpecifier' && item.imported != null,
					),
					importSpecifier,
				],
				j.literal(packageName),
				declaration.value.importKind,
			);
		});
}

const shiftDefaultImport = (
	j: core.JSCodeshift,
	base: Collection<any>,
	defaultName: string,
	oldPackagePath: string,
	newPackagePath: string,
): void => {
	tryCreateImport(j, base, oldPackagePath, newPackagePath);

	addToImport(j, base, j.importDefaultSpecifier(j.identifier(defaultName)), newPackagePath);

	// removing old default specifier
	base
		.find(j.ImportDeclaration)
		.filter((path) => path.node.source.value === oldPackagePath)
		.remove();
};

function getSafeImportName({
	j,
	base,
	currentDefaultSpecifierName,
	desiredName,
	fallbackName,
}: {
	j: core.JSCodeshift;
	base: Collection<any>;
	currentDefaultSpecifierName: string | null;
	desiredName: string;
	fallbackName: string;
}): string {
	if (currentDefaultSpecifierName === desiredName) {
		return desiredName;
	}

	const isUsed: boolean = doesIdentifierExist(j, base, desiredName);

	return isUsed ? fallbackName : desiredName;
}

export {
	getDefaultSpecifier,
	getNamedSpecifier,
	getJSXAttributesByName,
	hasJSXAttributesByName,
	hasImportDeclaration,
	hasImportDeclarationFromAnyPackageEntrypoint,
	addCommentBefore,
	addCommentToStartOfFile,
	doesIdentifierExist,
	removeImport,
	tryCreateImport,
	addToImport,
	shiftDefaultImport,
	isEmpty,
	clean,
	debug,
	callExpressionArgMatchesString,
	testMethodVariantEach,
	getSafeImportName,
	getDynamicImportName,
	addDynamicImport,
};
