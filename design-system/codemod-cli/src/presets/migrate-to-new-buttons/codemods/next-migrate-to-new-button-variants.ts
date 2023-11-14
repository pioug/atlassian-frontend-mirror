import type {
  API,
  FileInfo,
  ImportDefaultSpecifier,
  ImportSpecifier,
  JSXElement,
} from 'jscodeshift';
import {
  PRINT_SETTINGS,
  NEW_BUTTON_VARIANTS,
  entryPointsMapping,
  NEW_BUTTON_ENTRY_POINT,
} from '../utils/constants';

const transformer = (file: FileInfo, api: API): string => {
  const j = api.jscodeshift;
  const fileSource = j(file.source);

  const buttonImports = fileSource
    .find(j.ImportDeclaration)
    .filter(
      (path) =>
        path.node.source.value === entryPointsMapping.Button ||
        path.node.source.value === NEW_BUTTON_ENTRY_POINT,
    );

  if (!buttonImports.length) {
    return fileSource.toSource();
  }

  const defaultButtonImport = buttonImports
    .find(j.Specifier)
    .filter((path) => path.node.type === 'ImportDefaultSpecifier');

  if (defaultButtonImport.length === 0) {
    return fileSource.toSource();
  }

  const specifierIdentifier = defaultButtonImport.get(0).node.local.name;

  const attributes = fileSource
    .find(j.JSXElement)
    .filter(
      (path) =>
        path.value.openingElement.name.type === 'JSXIdentifier' &&
        path.value.openingElement.name.name === specifierIdentifier,
    )
    .find(j.JSXAttribute);

  const hasCustomComponent =
    attributes.filter((attribute) => attribute.node.name.name === 'component')
      .length > 0;

  const hasCssProp =
    attributes.filter((attribute) => attribute.node.name.name === 'css')
      .length > 0;

  if (hasCustomComponent || hasCssProp) {
    return fileSource.toSource(PRINT_SETTINGS);
  }

  const checkIfVariantAlreadyImported = (variant: string): boolean =>
    fileSource
      .find(j.ImportDeclaration)
      .filter((path) => path.node.source.value === NEW_BUTTON_ENTRY_POINT)
      .find(j.ImportSpecifier)
      .filter((path) => path.node.imported.name === variant).length > 0;

  const generateNewElement = (
    variant: (typeof NEW_BUTTON_VARIANTS)[keyof typeof NEW_BUTTON_VARIANTS]['as'],
    element: JSXElement,
  ) => {
    const { attributes } = element.openingElement;
    if (variant === NEW_BUTTON_VARIANTS.icon.as) {
      const attr = attributes?.filter(
        (attribute) =>
          attribute.type === 'JSXAttribute' &&
          (attribute.name.name === 'iconBefore' ||
            attribute.name.name === 'iconAfter'),
      );
      if (attr?.length && attr[0].type === 'JSXAttribute') {
        attr[0].name.name = 'icon';
      }
    }
    // self closing if it's an icon button or icon link button
    const isSelfClosing =
      variant === NEW_BUTTON_VARIANTS.icon.as ||
      variant === NEW_BUTTON_VARIANTS.linkIcon.as;
    return j.jsxElement(
      j.jsxOpeningElement(j.jsxIdentifier(variant), attributes, isSelfClosing),
      isSelfClosing ? null : j.jsxClosingElement(j.jsxIdentifier(variant)),
      element.children,
    );
  };

  let hasLinkIconButton = checkIfVariantAlreadyImported(
    NEW_BUTTON_VARIANTS.linkIcon.import,
  );
  let hasLinkButton = checkIfVariantAlreadyImported(
    NEW_BUTTON_VARIANTS.link.import,
  );
  let hasIconButton = checkIfVariantAlreadyImported(
    NEW_BUTTON_VARIANTS.icon.import,
  );

  const allButtons = fileSource
    .find(j.JSXElement)
    .filter(
      (path) =>
        path.value.openingElement.name.type === 'JSXIdentifier' &&
        path.value.openingElement.name.name === specifierIdentifier,
    );

  allButtons.forEach((element) => {
    const { attributes } = element.value.openingElement;
    if (!attributes) {
      return;
    }

    const buttonAttributes = attributes.map(
      (node) => node.type === 'JSXAttribute' && node.name.name,
    );

    const hasHref = buttonAttributes.includes('href');
    const hasIcon =
      buttonAttributes.includes('iconBefore') ||
      buttonAttributes.includes('iconAfter');
    const isLinkIconButton =
      hasHref && hasIcon && element.value.children?.length === 0;
    const isLinkButton = hasHref && !isLinkIconButton;
    const isIconButton =
      !hasHref && hasIcon && element.value.children?.length === 0;
    if (isLinkIconButton) {
      hasLinkIconButton = true;

      j(element).replaceWith(
        generateNewElement(NEW_BUTTON_VARIANTS.linkIcon.as, element.value),
      );
    }

    if (isIconButton) {
      hasIconButton = true;

      j(element).replaceWith(
        generateNewElement(NEW_BUTTON_VARIANTS.icon.as, element.value),
      );
    }

    if (isLinkButton) {
      hasLinkButton = true;

      j(element).replaceWith(
        generateNewElement(NEW_BUTTON_VARIANTS.link.as, element.value),
      );
    }
  });

  const specifiers: (ImportSpecifier | ImportDefaultSpecifier)[] = [];

  if (hasLinkButton) {
    specifiers.push(
      j.importSpecifier(
        j.identifier(NEW_BUTTON_VARIANTS.link.import),
        j.identifier(NEW_BUTTON_VARIANTS.link.as),
      ),
    );
  }

  if (hasIconButton) {
    specifiers.push(
      j.importSpecifier(
        j.identifier(NEW_BUTTON_VARIANTS.icon.import),
        j.identifier(NEW_BUTTON_VARIANTS.icon.as),
      ),
    );
  }

  if (hasLinkIconButton) {
    specifiers.push(
      j.importSpecifier(
        j.identifier(NEW_BUTTON_VARIANTS.linkIcon.import),
        j.identifier(NEW_BUTTON_VARIANTS.linkIcon.as),
      ),
    );
  }

  const oldButtonImport = fileSource
    .find(j.ImportDeclaration)
    .filter(
      (path) =>
        path.node.source.value === NEW_BUTTON_ENTRY_POINT ||
        path.node.source.value === entryPointsMapping.Button,
    );

  const leftButtons =
    fileSource
      .find(j.JSXElement)
      .filter(
        (path) =>
          path.value.openingElement.name.type === 'JSXIdentifier' &&
          path.value.openingElement.name.name === specifierIdentifier,
      ).length > 0 ||
    fileSource
      .find(j.CallExpression)
      .filter((path) =>
        path.node.arguments
          .map((argument) => argument.type === 'Identifier' && argument?.name)
          .includes(specifierIdentifier),
      ).length > 0;

  if (specifiers.length || leftButtons) {
    if (leftButtons) {
      specifiers.push(
        j.importSpecifier(
          j.identifier(NEW_BUTTON_VARIANTS.default.import),
          j.identifier(specifierIdentifier),
        ),
      );
    }
    oldButtonImport.replaceWith(
      j.importDeclaration(specifiers, j.stringLiteral(NEW_BUTTON_ENTRY_POINT)),
    );
  }

  return fileSource.toSource(PRINT_SETTINGS);
};

export default transformer;
