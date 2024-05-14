import {
  type API,
  type FileInfo,
  type ImportDefaultSpecifier,
  type ImportSpecifier,
} from 'jscodeshift';
import { addCommentBefore } from '@atlaskit/codemod-utils';
import { getDefaultImportSpecifierName } from '@hypermod/utils';

import {
  PRINT_SETTINGS,
  NEW_BUTTON_VARIANTS,
  entryPointsMapping,
  NEW_BUTTON_ENTRY_POINT,
  linkButtonMissingHrefComment,
  buttonPropsNoLongerSupportedComment,
  unsupportedProps,
} from '../utils/constants';
import {
  generateNewElement,
  handleIconAttributes,
} from '../utils/generate-new-button-element';
import { ifHasUnsupportedProps } from '../utils/has-unsupported-props';
import { checkIfVariantAlreadyImported } from '../utils/if-variant-already-imported';
import { renameDefaultButtonToLegacyButtonImport } from '../utils/rename-default-button-to-legacy-button';
import { migrateFitContainerIconButton } from '../utils/migrate-fit-container-icon-button';
import { importTypesFromNewEntryPoint } from '../utils/import-types-from-new-entry-point';

const transformer = (file: FileInfo, api: API): string => {
  const j = api.jscodeshift;
  const fileSource = j(file.source);

  const buttonImports = fileSource
    .find(j.ImportDeclaration)
    .filter(
      (path) =>
        path.node.source.value === entryPointsMapping.Button ||
        path.node.source.value === entryPointsMapping.LoadingButton ||
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

  let hasLinkIconButton = checkIfVariantAlreadyImported(
    NEW_BUTTON_VARIANTS.linkIcon,
    fileSource,
    j,
  );
  let hasLinkButton = checkIfVariantAlreadyImported(
    NEW_BUTTON_VARIANTS.link,
    fileSource,
    j,
  );
  let hasIconButton = checkIfVariantAlreadyImported(
    NEW_BUTTON_VARIANTS.icon,
    fileSource,
    j,
  );

  const allButtons = fileSource
    .find(j.JSXElement)
    .filter(
      (path) =>
        path.value.openingElement.name.type === 'JSXIdentifier' &&
        path.value.openingElement.name.name === specifierIdentifier,
    );
  const buttonsWithoutUnsupportedProps = allButtons.filter(
    (path) => !ifHasUnsupportedProps(path.value.openingElement.attributes),
  );

  const loadingButtonImportName = getDefaultImportSpecifierName(
    j,
    fileSource,
    entryPointsMapping.LoadingButton,
  );

  buttonsWithoutUnsupportedProps.forEach((element) => {
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

    const hasNoChildren = element.value.children?.length === 0;
    const isFitContainerIconButton =
      hasIcon &&
      hasNoChildren &&
      buttonAttributes.includes('shouldFitContainer');
    const isLinkIconButton =
      hasHref && hasIcon && hasNoChildren && !isFitContainerIconButton;

    const isLinkButton = hasHref && !isLinkIconButton;
    let isIconButton =
      !hasHref && hasIcon && hasNoChildren && !isFitContainerIconButton;

    const isDefaultButtonWithAnIcon =
      !isLinkIconButton &&
      !isIconButton &&
      !isFitContainerIconButton &&
      hasIcon;

    const isLoadingButton =
      element.value.openingElement.name.type === 'JSXIdentifier' &&
      element.value.openingElement.name.name === loadingButtonImportName;

    if (isDefaultButtonWithAnIcon) {
      handleIconAttributes(element.value, j);
    }

    if (isFitContainerIconButton) {
      const migratedToIconButton = migrateFitContainerIconButton(element, j);
      if (migratedToIconButton) {
        isIconButton = true;
      }
    }

    if (isLinkIconButton) {
      hasLinkIconButton = true;

      j(element).replaceWith(
        generateNewElement(NEW_BUTTON_VARIANTS.linkIcon, element.value, j),
      );
    }

    if (isIconButton) {
      hasIconButton = true;

      j(element).replaceWith(
        generateNewElement(NEW_BUTTON_VARIANTS.icon, element.value, j),
      );
    }

    if (isLinkButton) {
      hasLinkButton = true;

      j(element).replaceWith(
        generateNewElement(NEW_BUTTON_VARIANTS.link, element.value, j),
      );
    }

    if (isLoadingButton) {
      j(element).replaceWith(
        generateNewElement(NEW_BUTTON_VARIANTS.default, element.value, j),
      );
    }

    const linkAppearanceAttribute = attributes.find(
      (node) =>
        node.type === 'JSXAttribute' &&
        node.value?.type === 'StringLiteral' &&
        node?.name?.name === 'appearance' &&
        (node?.value?.value === 'link' || node?.value?.value === 'subtle-link'),
    );
    if (!hasHref && linkAppearanceAttribute) {
      addCommentBefore(
        j,
        j(linkAppearanceAttribute),
        linkButtonMissingHrefComment,
        'line',
      );
    }
  });

  // modify import declarations
  let specifiers: (ImportDefaultSpecifier | ImportSpecifier)[] = [];
  [
    hasLinkButton ? 'link' : null,
    hasIconButton ? 'icon' : null,
    hasLinkIconButton ? 'linkIcon' : null,
  ].forEach((variant) => {
    if (variant) {
      specifiers.push(
        j.importSpecifier(j.identifier(NEW_BUTTON_VARIANTS[variant])),
      );
    }
  });

  const oldButtonImport = fileSource
    .find(j.ImportDeclaration)
    .filter(
      (path) =>
        path.node.source.value === NEW_BUTTON_ENTRY_POINT ||
        path.node.source.value === entryPointsMapping.Button ||
        path.node.source.value === entryPointsMapping.LoadingButton,
    );

  const remainingDefaultButtons =
    fileSource
      .find(j.JSXElement)
      .filter(
        (path) =>
          path.value.openingElement.name.type === 'JSXIdentifier' &&
          path.value.openingElement.name.name === specifierIdentifier &&
          !ifHasUnsupportedProps(path.value.openingElement.attributes),
      ).length > 0 ||
    fileSource
      .find(j.CallExpression)
      .filter((path) =>
        path.node.arguments
          .map((argument) => argument.type === 'Identifier' && argument?.name)
          .includes(specifierIdentifier),
      ).length > 0;

  // Loading buttons map back to default imports
  if (specifierIdentifier === loadingButtonImportName) {
    fileSource
      // rename LoadingButton to Button in all call expressions i.e. render(LoadingButton), find(LoadingButton)
      .find(j.CallExpression)
      .find(j.Identifier)
      .forEach((path) => {
        if (path.node.name === loadingButtonImportName) {
          path.node.name = NEW_BUTTON_VARIANTS.default;
        }
      });
    specifiers.push(
      j.importDefaultSpecifier(j.identifier(NEW_BUTTON_VARIANTS.default)),
    );
  }

  if (
    !specifiers.find(
      (specifier) => specifier.type === 'ImportDefaultSpecifier',
    ) &&
    remainingDefaultButtons
  ) {
    specifiers.push(
      j.importDefaultSpecifier(j.identifier(NEW_BUTTON_VARIANTS.default)),
    );
  }

  // update import path for types imports
  specifiers = importTypesFromNewEntryPoint(
    buttonImports,
    specifiers,
    j,
    fileSource,
  );

  const buttonsWithUnsupportedProps = allButtons.filter((path) =>
    ifHasUnsupportedProps(path.value.openingElement.attributes),
  );
  if (buttonsWithUnsupportedProps.length) {
    // add comment to all buttons with unsupported props: "component", "style", "css"
    buttonsWithUnsupportedProps.forEach((element) => {
      const attribute = element.value.openingElement.attributes?.find(
        (node) =>
          node.type === 'JSXAttribute' &&
          typeof node.name.name === 'string' &&
          unsupportedProps.includes(node.name.name),
      );
      if (attribute) {
        addCommentBefore(
          j,
          j(attribute),
          buttonPropsNoLongerSupportedComment,
          'line',
        );
      }
    });

    // rename all buttons with unsupported props to LegacyButton if default new button is imported
    if (
      specifiers.find(
        (specifier) => specifier.type === 'ImportDefaultSpecifier',
      )
    ) {
      renameDefaultButtonToLegacyButtonImport(
        oldButtonImport,
        buttonsWithUnsupportedProps,
        j,
      );
    }
  }

  if (specifiers.length) {
    const newButtonImport = j.importDeclaration(
      specifiers,
      j.stringLiteral(NEW_BUTTON_ENTRY_POINT),
    );

    oldButtonImport.forEach((path) => {
      newButtonImport.comments = path?.node?.comments
        ? path.node.comments
        : undefined;
    });

    oldButtonImport.replaceWith(newButtonImport);
  }

  // remove empty import declarations
  fileSource
    .find(j.ImportDeclaration)
    .filter(
      (path) =>
        (path.node.source.value === '@atlaskit/button' ||
          path.node.source.value === '@atlaskit/button/types') &&
        !!path.node.specifiers &&
        path.node.specifiers.length === 0,
    )
    .remove();

  return fileSource.toSource(PRINT_SETTINGS);
};

export default transformer;
