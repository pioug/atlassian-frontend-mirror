import type { ASTPath, Collection, JSCodeshift, JSXElement } from 'jscodeshift';

export function getImportDeclarationsForRbd(
  j: JSCodeshift,
  source: Collection<Node>,
) {
  return source
    .find(j.ImportDeclaration)
    .filter(path => path.node.source.value === 'react-beautiful-dnd');
}

// TODO: update this when we finalise a name
export const migrationPackageName =
  '@atlaskit/pragmatic-drag-and-drop-react-beautiful-dnd-migration';

const componentNameList = [
  'DragDropContext',
  'Draggable',
  'Droppable',
] as const;
type ComponentName = typeof componentNameList[number];

function isComponentName(str: string): str is ComponentName {
  return componentNameList.includes(str as any);
}

function getImportedRbdComponentNames(
  j: JSCodeshift,
  source: Collection<Node>,
): Map<string, ComponentName> {
  const componentsInFile = new Map<string, ComponentName>();

  getImportDeclarationsForRbd(j, source).forEach(path => {
    j(path)
      .find(j.ImportSpecifier)
      .forEach(path => {
        const originalName = path.node.imported.name;
        if (isComponentName(originalName)) {
          const nameInFile = path.node.local
            ? path.node.local.name
            : originalName;
          componentsInFile.set(nameInFile, originalName);
        }
      });
  });

  return componentsInFile;
}

function getJSXElementName(node: JSXElement): string | null {
  const nameNode = node.openingElement.name;
  if (nameNode.type !== 'JSXIdentifier') {
    return null;
  }
  return nameNode.name;
}

function getRbdElementsInFile(
  source: Collection<Node>,
  importedRbdComponentNames: Map<string, string>,
) {
  return source.findJSXElements().filter(path => {
    const nameInFile = getJSXElementName(path.node);
    if (!nameInFile) {
      return false;
    }
    return importedRbdComponentNames.has(nameInFile);
  });
}

type CallbackArgs = {
  nameInFile: string;
  originalName: ComponentName;
  path: ASTPath<JSXElement>;
};

export function forEachRbdElementInFile(
  j: JSCodeshift,
  source: Collection<Node>,
  callback: (args: CallbackArgs) => void,
) {
  const importedRbdComponentNames = getImportedRbdComponentNames(j, source);
  getRbdElementsInFile(source, importedRbdComponentNames).forEach(path => {
    const nameInFile = getJSXElementName(path.node);
    if (!nameInFile || !importedRbdComponentNames.has(nameInFile)) {
      return;
    }

    const originalName = importedRbdComponentNames.get(nameInFile);
    if (!originalName) {
      return;
    }

    callback({
      nameInFile,
      originalName,
      path,
    });
  });
}
