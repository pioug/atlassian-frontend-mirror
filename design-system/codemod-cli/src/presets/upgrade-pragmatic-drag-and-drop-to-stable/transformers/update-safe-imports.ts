import type { API, FileInfo } from 'jscodeshift';

const importMap: Record<string, string> = {
	// core package
	'@atlaskit/pragmatic-drag-and-drop/adapter/element':
		'@atlaskit/pragmatic-drag-and-drop/element/adapter',
	'@atlaskit/pragmatic-drag-and-drop/util/set-custom-native-drag-preview':
		'@atlaskit/pragmatic-drag-and-drop/element/set-custom-native-drag-preview',
	'@atlaskit/pragmatic-drag-and-drop/util/center-under-pointer':
		'@atlaskit/pragmatic-drag-and-drop/element/center-under-pointer',
	'@atlaskit/pragmatic-drag-and-drop/util/preserve-offset-on-source':
		'@atlaskit/pragmatic-drag-and-drop/element/preserve-offset-on-source',
	'@atlaskit/pragmatic-drag-and-drop/util/disable-native-drag-preview':
		'@atlaskit/pragmatic-drag-and-drop/element/disable-native-drag-preview',
	'@atlaskit/pragmatic-drag-and-drop/util/scroll-just-enough-into-view':
		'@atlaskit/pragmatic-drag-and-drop/element/scroll-just-enough-into-view',
	'@atlaskit/pragmatic-drag-and-drop/util/combine': '@atlaskit/pragmatic-drag-and-drop/combine',
	'@atlaskit/pragmatic-drag-and-drop/util/once': '@atlaskit/pragmatic-drag-and-drop/once',
	'@atlaskit/pragmatic-drag-and-drop/util/reorder': '@atlaskit/pragmatic-drag-and-drop/reorder',
	// hitbox package
	'@atlaskit/pragmatic-drag-and-drop-hitbox/addon/closest-edge':
		'@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge',

	// Doing cancel-unhandled in it's own transformer as the name is changing too
	// '@atlaskit/pragmatic-drag-and-drop/addon/cancel-unhandled':
	//   '@atlaskit/pragmatic-drag-and-drop/cancel-unhandled',
	// We are doing the name update in another transform
	// '@atlaskit/pragmatic-drag-and-drop/util/offset-from-pointer':
	//   '@atlaskit/pragmatic-drag-and-drop/element/offset-from-pointer',
};

export function updateSafeImports(file: FileInfo, api: API): string {
	const j = api.jscodeshift;
	const root = j(file.source);

	// avoiding reformatting the file if we are not changing anything
	let changed: boolean = false;

	root.find(j.ImportDeclaration).forEach((path) => {
		const importPath = path.node.source.value;

		if (typeof importPath === 'string' && importMap[importPath]) {
			changed = true;
			path.node.source.value = importMap[importPath];
		}
	});

	if (!changed) {
		return file.source;
	}

	return root.toSource({ quote: 'single' });
}
