import type { API, FileInfo } from 'jscodeshift';
import { addCommentToStartOfFile } from '@atlaskit/codemod-utils';

export const pleaseMigrateMessage = `
  The file adapter has been replaced by a new (more powerful) external adapter.
  Please see our external adapter documentation on how to migrate your file adapter usage.

  We have also included "containsFiles()" as an import in this file as it is helpful to
  restrict your monitors and drop targets to only be for files.

  We have also included "getFiles()" as an import as it is a helpful way to extract the files
  from a drag operation

  dropTargetForExternal({
    canDrop: containsFiles,
    onDrop({source}) {
      const files = getFiles({source});
    }
  });

  monitorForExternal({
    canMonitor: containsFiles,
    onDrop({source}) {
      const files = getFiles({source});
    }
  });

  - [1.0 upgrade documentation](https://atlassian.design/components/pragmatic-drag-and-drop/core-package/changelog)
  - [external adapter documentation](https://atlassian.design/components/pragmatic-drag-and-drop/core-package/adapters/external)
  - [file usage documentation](https://atlassian.design/components/pragmatic-drag-and-drop/core-package/adapters/external/files)
`;

const oldImportPath = '@atlaskit/pragmatic-drag-and-drop/adapter/file';
const newImportPath = '@atlaskit/pragmatic-drag-and-drop/external/adapter';

export function moveFromFileAdapterToExternalAdapter(file: FileInfo, api: API): string {
	const j = api.jscodeshift;
	const root = j(file.source);

	const isUsingFileAdapter: boolean = root
		.find(j.ImportDeclaration)
		.some((path) => path.node.source.value === oldImportPath);

	if (!isUsingFileAdapter) {
		return file.source;
	}

	// replace old import path with new import path
	root
		.find(j.ImportDeclaration)
		.filter((path) => path.node.source.value === oldImportPath)
		// replace import
		.map((path) => {
			path.node.source.value = newImportPath;
			return path;
		})
		// Add an import for 'containsFiles()' and `getFiles()` as likely this file will need it
		.insertAfter(
			j.importDeclaration(
				[
					j.importSpecifier(j.identifier('containsFiles')),
					j.importSpecifier(j.identifier('getFiles')),
				],
				j.literal('@atlaskit/pragmatic-drag-and-drop/external/file'),
			),
		);

	// update usages of `monitorForFiles` and `dropTargetForFiles`
	root
		.find(j.Identifier)
		.filter((path) => path.value.name === 'monitorForFiles')
		.replaceWith(j.identifier('monitorForExternal'));
	root
		.find(j.Identifier)
		.filter((path) => path.value.name === 'dropTargetForFiles')
		.replaceWith(j.identifier('dropTargetForExternal'));

	// add comment to the start of the file
	addCommentToStartOfFile({ j, base: root, message: pleaseMigrateMessage });

	return root.toSource({ quote: 'single' });
}
