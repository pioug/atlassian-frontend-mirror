import type { API, FileInfo, ImportDeclaration, Node, Options } from 'jscodeshift';

export const parser = 'tsx';

type AnyNode = Node & Record<string, any>;

const AVATAR_IMPORTS = new Set([
	'@atlaskit/avatar',
	'@atlaskit/avatar/avatar',
	'@atlaskit/avatar/Avatar',
	'@atlaskit/avatar/skeleton',
	'@atlaskit/avatar/Skeleton',
	'@atlaskit/avatar/types',
	'@atlaskit/avatar-group',
	'@atlaskit/avatar-group/avatar-group',
	'@atlaskit/avatar-group/AvatarGroup',
	'@atlaskit/avatar-group/types',
]);

const COMPONENT_IMPORTS = new Set([
	'@atlaskit/avatar',
	'@atlaskit/avatar/avatar',
	'@atlaskit/avatar/Avatar',
	'@atlaskit/avatar/skeleton',
	'@atlaskit/avatar/Skeleton',
	'@atlaskit/avatar-group',
	'@atlaskit/avatar-group/avatar-group',
	'@atlaskit/avatar-group/AvatarGroup',
]);

const SIZE_TYPE_NAMES = new Set(['SizeType', 'AvatarPropTypes', 'AvatarProps', 'SkeletonProps']);
const TODO_COMMENT =
	'// TODO: (from codemod) Check whether this dynamic Avatar size should be migrated to xxsmall.';

const getImportSource = (node: ImportDeclaration): string | undefined =>
	typeof node.source.value === 'string' ? node.source.value : undefined;

const isIdentifierName = (node: Node | null | undefined, name: string): boolean =>
	node?.type === 'Identifier' && (node as AnyNode).name === name;

const isJsxIdentifierName = (node: Node | null | undefined, name: string): boolean =>
	node?.type === 'JSXIdentifier' && (node as AnyNode).name === name;

const isXSmallLiteral = (node: Node | null | undefined): boolean =>
	(node?.type === 'Literal' || node?.type === 'StringLiteral') &&
	(node as AnyNode).value === 'xsmall';

const getImportedNames = (j: API['jscodeshift'], source: ReturnType<API['jscodeshift']>) => {
	const componentNames = new Set<string>();
	const avatarGroupComponentNames = new Set<string>();
	const typeNames = new Set<string>();
	let hasSupportedImport = false;

	source.find(j.ImportDeclaration).forEach((path) => {
		const importSource = getImportSource(path.node);
		if (!importSource || !AVATAR_IMPORTS.has(importSource)) {
			return;
		}

		hasSupportedImport = true;

		for (const specifier of path.node.specifiers || []) {
			const localName = specifier.local?.name;
			if (!localName) {
				continue;
			}

			if (COMPONENT_IMPORTS.has(importSource)) {
				if (specifier.type === 'ImportDefaultSpecifier') {
					componentNames.add(localName);
					if (importSource.startsWith('@atlaskit/avatar-group')) {
						avatarGroupComponentNames.add(localName);
					}
					continue;
				}

				if (
					specifier.type === 'ImportSpecifier' &&
					(specifier.imported.name === 'Avatar' ||
						specifier.imported.name === 'Skeleton' ||
						specifier.imported.name === 'AvatarGroup')
				) {
					componentNames.add(localName);
					if (specifier.imported.name === 'AvatarGroup') {
						avatarGroupComponentNames.add(localName);
					}
				}
			}

			if (specifier.type === 'ImportSpecifier' && SIZE_TYPE_NAMES.has(specifier.imported.name)) {
				typeNames.add(localName);
			}
		}
	});

	return { avatarGroupComponentNames, componentNames, hasSupportedImport, typeNames };
};

const replaceLiteralWithXxsmall = (node: Node): void => {
	if (node.type === 'Literal') {
		(node as AnyNode).value = 'xxsmall';
		return;
	}

	if (node.type === 'StringLiteral') {
		(node as AnyNode).value = 'xxsmall';
	}
};

const addTodoLine = (todoLines: Set<number>, node: Node): void => {
	if (node.loc?.start.line) {
		todoLines.add(node.loc.start.line);
	}
};

const insertTodoComments = (source: string, todoLines: Set<number>): string => {
	if (todoLines.size === 0) {
		return source;
	}

	const lines = source.split('\n');
	const sortedLines = [...todoLines].sort((a, b) => b - a);

	for (const lineNumber of sortedLines) {
		const lineIndex = lineNumber - 1;
		const line = lines[lineIndex];
		const previousLine = lines[lineIndex - 1];

		if (!line || previousLine?.includes('TODO: (from codemod)')) {
			continue;
		}

		const indentation = line.match(/^\s*/)?.[0] ?? '';
		lines.splice(lineIndex, 0, `${indentation}${TODO_COMMENT}`);
	}

	return lines.join('\n');
};

const isImportedTypeReference = (
	node: Node | null | undefined,
	typeNames: Set<string>,
): boolean => {
	if (!node) {
		return false;
	}

	if (node.type === 'TSTypeReference') {
		const typeName = (node as AnyNode).typeName;
		return typeName.type === 'Identifier' && typeNames.has(typeName.name);
	}

	if (node.type === 'TSArrayType') {
		return isImportedTypeReference((node as AnyNode).elementType, typeNames);
	}

	if (node.type === 'TSUnionType') {
		return (node as AnyNode).types.some((type: Node) => isImportedTypeReference(type, typeNames));
	}

	return false;
};

const objectExpressionHasAvatarType = (
	parent: Node | null | undefined,
	typeNames: Set<string>,
): boolean => {
	if (!parent) {
		return false;
	}

	if (parent.type === 'VariableDeclarator') {
		return isImportedTypeReference(
			(parent as AnyNode).id.typeAnnotation?.typeAnnotation,
			typeNames,
		);
	}

	if (parent.type === 'TSAsExpression' || parent.type === 'TSTypeAssertion') {
		return isImportedTypeReference((parent as AnyNode).typeAnnotation, typeNames);
	}

	return false;
};

const transformer = (fileInfo: FileInfo, api: API, options: Options): string => {
	const j = api.jscodeshift;
	const source = j(fileInfo.source);
	const { avatarGroupComponentNames, componentNames, hasSupportedImport, typeNames } =
		getImportedNames(j, source);
	let didChange = false;
	const todoLines = new Set<number>();

	if (!hasSupportedImport) {
		return fileInfo.source;
	}

	source.find(j.JSXElement).forEach((path) => {
		const openingElement = path.node.openingElement;
		if (
			openingElement.name.type !== 'JSXIdentifier' ||
			!componentNames.has(openingElement.name.name) ||
			avatarGroupComponentNames.has(openingElement.name.name)
		) {
			return;
		}

		for (const attribute of openingElement.attributes || []) {
			if (attribute.type !== 'JSXAttribute' || !isJsxIdentifierName(attribute.name, 'size')) {
				continue;
			}

			if (isXSmallLiteral(attribute.value as Node | null | undefined)) {
				replaceLiteralWithXxsmall(attribute.value as Node);
				didChange = true;
				continue;
			}

			if (
				attribute.value?.type === 'JSXExpressionContainer' &&
				isXSmallLiteral(attribute.value.expression as Node)
			) {
				replaceLiteralWithXxsmall(attribute.value.expression as Node);
				didChange = true;
				continue;
			}

			if (attribute.value?.type === 'JSXExpressionContainer') {
				addTodoLine(todoLines, path.node as Node);
				didChange = true;
			}
		}
	});

	source.find(j.VariableDeclarator).forEach((path) => {
		if (
			isImportedTypeReference(
				(path.node.id as AnyNode).typeAnnotation?.typeAnnotation,
				typeNames,
			) &&
			isXSmallLiteral(path.node.init as Node | null | undefined)
		) {
			replaceLiteralWithXxsmall(path.node.init as Node);
			didChange = true;
		}
	});

	source.find(j.ObjectExpression).forEach((path) => {
		if (!objectExpressionHasAvatarType(path.parent.node as Node, typeNames)) {
			return;
		}

		for (const property of path.node.properties) {
			if (property.type !== 'ObjectProperty' && property.type !== 'Property') {
				continue;
			}

			if (!isIdentifierName(property.key as Node, 'size')) {
				continue;
			}

			if (isXSmallLiteral(property.value as Node)) {
				replaceLiteralWithXxsmall(property.value as Node);
				didChange = true;
				continue;
			}

			addTodoLine(todoLines, path.node as Node);
			didChange = true;
		}
	});

	const output = didChange
		? source.toSource(options.printOptions || { quote: 'single' })
		: fileInfo.source;

	return insertTodoComments(output, todoLines);
};

export default transformer;
