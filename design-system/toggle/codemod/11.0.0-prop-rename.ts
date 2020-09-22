import core, { API, FileInfo, Options } from 'jscodeshift';

function hasImportDeclaration(
  j: core.JSCodeshift,
  source: ReturnType<typeof j>,
  importPath: string,
) {
  return !!source
    .find(j.ImportDeclaration)
    .filter(path => path.node.source.value === importPath).length;
}

function hasDefaultImport(
  j: core.JSCodeshift,
  source: ReturnType<typeof j>,
  importName: string,
) {
  return !!source
    .find(j.ImportDeclaration)
    .find(j.ImportDefaultSpecifier)
    .find(j.Identifier)
    .filter(identifier => identifier!.value!.name === importName).length;
}

function findIdentifierAndReplaceAttribute(
  j: core.JSCodeshift,
  source: ReturnType<typeof j>,
  identifierName: string,
  searchAttr: string,
  replaceWithAttr: string,
) {
  source
    .find(j.JSXElement)
    .find(j.JSXOpeningElement)
    .filter(path => {
      return !!j(path.node)
        .find(j.JSXIdentifier)
        .filter(identifier => identifier.value.name === identifierName);
    })
    .forEach(element => {
      j(element)
        .find(j.JSXAttribute)
        .find(j.JSXIdentifier)
        .filter(attr => attr.node.name === searchAttr)
        .forEach(attribute => {
          j(attribute).replaceWith(j.jsxIdentifier(replaceWithAttr));
        });
    });
}

function hasVariableAssignment(
  j: core.JSCodeshift,
  source: ReturnType<typeof j>,
  identifierName: string,
) {
  const occurance = source.find(j.VariableDeclaration).filter(path => {
    return !!j(path.node)
      .find(j.VariableDeclarator)
      .find(j.Identifier)
      .filter(identifier => {
        return identifier.node.name === identifierName;
      }).length;
  });
  return !!occurance.length ? occurance : false;
}

export default function transformer(
  fileInfo: FileInfo,
  { jscodeshift: j }: API,
  options: Options,
) {
  const source = j(fileInfo.source);

  if (hasImportDeclaration(j, source, '@atlaskit/toggle')) {
    if (hasDefaultImport(j, source, 'Toggle')) {
      findIdentifierAndReplaceAttribute(
        j,
        source,
        'Toggle',
        'isDefaultChecked',
        'defaultChecked',
      );

      let x = hasVariableAssignment(j, source, 'Toggle');
      if (x) {
        x.find(j.VariableDeclarator).forEach(delarator => {
          j(delarator)
            .find(j.Identifier)
            .filter(identifier => identifier.name === 'id')
            .forEach(ids => {
              findIdentifierAndReplaceAttribute(
                j,
                source,
                ids.node.name,
                'isDefaultChecked',
                'defaultChecked',
              );
            });
        });
      }
    }

    return source.toSource(options.printOptions || { quote: 'single' });
  }

  return fileInfo.source;
}
