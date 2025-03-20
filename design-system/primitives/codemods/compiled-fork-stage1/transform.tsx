import type { API, FileInfo } from 'jscodeshift';

function transform(file: FileInfo, { j }: API) {
	const root = j(file.source);

	// Find all import declarations from '@atlaskit/primitives'
	root.find(j.ImportDeclaration, { source: { value: '@atlaskit/primitives' } }).forEach((path) => {
		// Check if 'xcss' is imported
		const hasXcss = path.node.specifiers!.some((specifier) => {
			if (!j.ImportSpecifier.check(specifier)) {
				return false;
			}

			return specifier.imported.name === 'xcss';
		});

		// If 'xcss' is not imported, change the import to '@atlaskit/primitives/compiled'
		if (!hasXcss) {
			path.node.source = j.literal('@atlaskit/primitives/compiled');
		}
	});

	return root.toSource();
}

export default transform;
