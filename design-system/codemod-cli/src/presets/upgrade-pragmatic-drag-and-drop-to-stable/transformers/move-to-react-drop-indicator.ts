import type { API, FileInfo } from 'jscodeshift';

const oldPackagePath = '@atlaskit/pragmatic-drag-and-drop-react-indicator';
const newPackagePath = '@atlaskit/pragmatic-drag-and-drop-react-drop-indicator';

function isString(value: unknown): value is string {
  return typeof value === 'string';
}
function isOldPackagePath(value: unknown): boolean {
  return isString(value) && value.startsWith(oldPackagePath);
}

export function moveToReactDropIndicator(file: FileInfo, api: API): string {
  const j = api.jscodeshift;
  const root = j(file.source);

  const isUsingImport = root
    .find(j.ImportDeclaration)
    .some((path) => isOldPackagePath(path.node.source.value));

  // Don't format the file if we are not changing anything
  if (!isUsingImport) {
    return file.source;
  }

  // replace imports
  root.find(j.ImportDeclaration).forEach((path) => {
    const { value } = path.node.source;

    if (isString(value) && isOldPackagePath(path.node.source.value)) {
      path.node.source.value = value.replace(oldPackagePath, newPackagePath);
    }
  });

  return root.toSource({ quote: 'single' });
}
