import type { API, FileInfo } from 'jscodeshift';

type Pair = {
  importPath: string;
  namedImport: string;
};

type Scenario = {
  existing: Pair;
  updated: Pair;
};

const scenarios: Scenario[] = [
  {
    existing: {
      importPath: '@atlaskit/pragmatic-drag-and-drop-auto-scroll/file',
      namedImport: 'autoScrollForFiles',
    },
    updated: {
      importPath: '@atlaskit/pragmatic-drag-and-drop-auto-scroll/external',
      namedImport: 'autoScrollForExternal',
    },
  },
  {
    existing: {
      importPath:
        '@atlaskit/pragmatic-drag-and-drop-auto-scroll/unsafe-overflow/file',
      namedImport: 'unsafeOverflowAutoScrollForFiles',
    },
    updated: {
      importPath:
        '@atlaskit/pragmatic-drag-and-drop-auto-scroll/unsafe-overflow/external',
      namedImport: 'unsafeOverflowAutoScrollForExternal',
    },
  },
];

export function updateAutoScroll(file: FileInfo, api: API): string {
  const j = api.jscodeshift;
  const root = j(file.source);

  let changed: boolean = false;

  for (const scenario of scenarios) {
    const isUsingImport: boolean = root
      .find(j.ImportDeclaration)
      .some((path) => path.node.source.value === scenario.existing.importPath);

    // move on to the next scenario
    if (!isUsingImport) {
      continue;
    }

    changed = true;

    // replace old import path with new import path
    root
      .find(j.ImportDeclaration)
      .filter((path) => path.node.source.value === scenario.existing.importPath)
      // replace import
      .map((path) => {
        path.node.source.value = scenario.updated.importPath;
        return path;
      });

    // replace old named import and usages with new one
    root
      .find(j.Identifier)
      .filter((path) => path.value.name === scenario.existing.namedImport)
      .replaceWith(j.identifier(scenario.updated.namedImport));
  }

  // Don't format the file if we are not changing anything
  if (!changed) {
    return file.source;
  }

  return root.toSource({ quote: 'single' });
}
