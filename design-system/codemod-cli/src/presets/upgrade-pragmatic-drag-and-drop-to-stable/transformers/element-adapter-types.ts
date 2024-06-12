import type { API, FileInfo } from 'jscodeshift';

const newImport = '@atlaskit/pragmatic-drag-and-drop/element/adapter';

export function shiftCanMonitorArgType(file: FileInfo, api: API): string {
	const j = api.jscodeshift;
	const root = j(file.source);

	const isUsingImport: boolean = root
		.find(j.ImportDeclaration)
		.some((path) => path.node.source.value === newImport);

	// don't change the file if we don't need to
	if (!isUsingImport) {
		return file.source;
	}

	// replace old named import and usages with new one
	root
		.find(j.Identifier)
		.filter((path) => path.value.name === 'ElementMonitorCanMonitorArgs')
		.replaceWith(j.identifier('ElementMonitorGetFeedbackArgs'));

	return root.toSource({ quote: 'single' });
}
