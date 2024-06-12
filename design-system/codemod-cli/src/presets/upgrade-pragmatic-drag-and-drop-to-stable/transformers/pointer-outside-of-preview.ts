import type { API, FileInfo } from 'jscodeshift';

const paths = {
	current: '@atlaskit/pragmatic-drag-and-drop/util/offset-from-pointer',
	next: '@atlaskit/pragmatic-drag-and-drop/element/pointer-outside-of-preview',
};

export function shiftToPointerOutsideOfPreview(file: FileInfo, api: API): string {
	const j = api.jscodeshift;
	const root = j(file.source);

	const isUsingImport: boolean = root
		.find(j.ImportDeclaration)
		.some((path) => path.node.source.value === paths.current);

	// don't change the file if we don't need to
	if (!isUsingImport) {
		return file.source;
	}

	// replace old import path with new import path
	root
		.find(j.ImportDeclaration)
		.filter((path) => path.node.source.value === paths.current)
		// replace import
		.map((path) => {
			path.node.source.value = paths.next;
			return path;
		});

	// replace old named import and usages with new one
	root
		.find(j.Identifier)
		.filter((path) => path.value.name === 'offsetFromPointer')
		.replaceWith(j.identifier('pointerOutsideOfPreview'));

	return root.toSource({ quote: 'single' });
}
