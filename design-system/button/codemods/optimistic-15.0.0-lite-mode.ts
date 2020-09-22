import { NodePath } from 'ast-types/lib/node-path';
import core, { API, FileInfo, JSXElement, Node, Options } from 'jscodeshift';
import { Collection } from 'jscodeshift/src/Collection';

import { convertButtonType, transformButton } from './helpers/15.0.0-runner';
import {
  addCommentBefore,
  addCommentToStartOfFile,
  addToImport,
  changeImportFor,
  getDefaultSpecifierName,
  getSafeImportName,
  isOnlyUsingNameForJSX,
  isUsingProp,
  isUsingSupportedSpread,
  Nullable,
  tryCreateImport,
} from './helpers/helpers-generic';

function changeUsage({
  j,
  base,
  packageName,
}: {
  j: core.JSCodeshift;
  base: Collection<Node>;
  packageName: string;
}): void {
  // 1. Are we using the default export?
  // If not: we can exit early!
  const defaultName: Nullable<string> = getDefaultSpecifierName({
    j,
    base,
    packageName,
  });
  if (defaultName == null) {
    return;
  }

  // Only supporting cases where default identifier is only used in JSX
  const isSupported: boolean = isOnlyUsingNameForJSX({
    j,
    base,
    name: defaultName,
  });

  if (!isSupported) {
    tryCreateImport({
      j,
      base,
      relativeToPackage: '@atlaskit/button',
      packageName: '@atlaskit/button/standard-button',
    });
    addToImport({
      j,
      base,
      // we can safely use the default name, because it was being used before
      importSpecifier: j.importDefaultSpecifier(j.identifier(defaultName)),
      packageName: '@atlaskit/button/standard-button',
    });

    addCommentBefore({
      j,
      target: base
        .find(j.ImportDeclaration)
        .filter(
          declaration =>
            declaration.value.source.value ===
            '@atlaskit/button/standard-button',
        ),
      message: `
        This file does not exclusively use Button in JSX.
        The codemod is unable to know which button variant, so it is using
        the standard button: "@atlaskit/button/standard-button".

        Please validate this decision.
        You might need to change the usage of Button to either LoadingButton or CustomThemeButton
      `,
    });
    return;
  }

  // Find usages of the Button component
  // There are three possible import statements:
  //  1. import Button from '@atlaskit/button/standard';
  //  2. import LoadingButton from '@atlaskit/button/loading-button';
  //  3. import CustomThemeButton from '@atlaskit/button/custom-theme-button';

  // What to do if any of the names clash?
  // - In the case of clash: prefix with 'DS' (eg import DSLoadingButton from '@atlaskit/button/loading-button';)

  // What to do if old Button was aliased? eg "AkButton"
  // - We cannot use that existing alias as we might have three different Button imports in the file
  // - We automatically will be be swapping to the standard names with 'DS' prefix for all imports

  type Groups = {
    standard: NodePath<JSXElement, JSXElement>[];
    loading: NodePath<JSXElement, JSXElement>[];
    customTheme: NodePath<JSXElement, JSXElement>[];
  };

  const groups: Groups = {
    standard: [],
    loading: [],
    customTheme: [],
  };

  base.findJSXElements(defaultName).forEach(path => {
    const hasThemeProp: boolean = isUsingProp({
      j,
      base,
      element: path,
      propName: 'theme',
    });

    if (hasThemeProp) {
      groups.customTheme.push(path);
      return;
    }

    if (!isUsingSupportedSpread({ j, base, element: path })) {
      addCommentToStartOfFile({
        j,
        base,
        message: `
          Detected spreading props (<Button {...props} />) that was too complex for our codemod to understand
          Our codemod will only look at inline objects, or objects defined in the same file (ObjectExpression's)
          We have opted for our safest upgrade component in this file: '<CustomThemeButton />'
        `,
      });
      groups.customTheme.push(path);
      return;
    }

    const isUsingThemeInFile: boolean =
      base
        .find(j.ImportDeclaration)
        .filter(
          declaration =>
            declaration.value.source.value ===
            '@atlaskit/button/custom-theme-button',
        )
        .find(j.ImportSpecifier)
        .filter(specifier => specifier.value.imported.name === 'Theme').length >
      0;

    if (isUsingThemeInFile) {
      addCommentToStartOfFile({
        j,
        base,
        message: `
          Using "import { Theme } from '@atlaskit/button/custom-theme-button" in a file
          will cause all buttons in that file to be safely converted to a <CustomThemeButton/>
        `,
      });

      groups.customTheme.push(path);
      return;
    }

    const hasIsLoadingProp: boolean = isUsingProp({
      j,
      base,
      element: path,
      propName: 'isLoading',
    });

    if (hasIsLoadingProp) {
      groups.loading.push(path);
      return;
    }

    groups.standard.push(path);
    return;
  });

  convertButtonType({
    j,
    base,
    elements: groups.standard,
    name: getSafeImportName({
      j,
      base,
      currentDefaultSpecifierName: defaultName,
      desiredName: 'Button',
      fallbackName: 'DSButton',
    }),
    newPackageName: '@atlaskit/button/standard-button',
  });

  convertButtonType({
    j,
    base,
    elements: groups.loading,
    newPackageName: '@atlaskit/button/loading-button',
    name: getSafeImportName({
      j,
      base,
      desiredName: 'LoadingButton',
      fallbackName: 'DSLoadingButton',
      currentDefaultSpecifierName: defaultName,
    }),
  });
  convertButtonType({
    j,
    base,
    elements: groups.customTheme,
    newPackageName: '@atlaskit/button/custom-theme-button',
    name: getSafeImportName({
      j,
      base,
      currentDefaultSpecifierName: defaultName,
      desiredName: 'CustomThemeButton',
      fallbackName: 'DSCustomThemeButton',
    }),
  });
}

export default function transformer(
  file: FileInfo,
  { jscodeshift: j }: API,
  options: Options,
) {
  return transformButton({
    j,
    file,
    custom: (base: Collection<any>) => {
      changeImportFor({
        j,
        base,
        option: {
          type: 'keep-name',
          name: 'ButtonProps',
          behaviour: 'keep-as-named-import',
        },
        oldPackagePath: '@atlaskit/button',
        newPackagePath: '@atlaskit/button/types',
      });

      const isUsingButtonPropsType: boolean =
        base
          .find(j.ImportDeclaration)
          .filter(
            declaration =>
              declaration.value.source.value === '@atlaskit/button/types',
          )
          .find(j.ImportSpecifier)
          .filter(specifier => specifier.value.imported.name === 'ButtonProps')
          .length > 0;

      if (isUsingButtonPropsType) {
        const target = base
          .find(j.ImportDeclaration)
          .filter(
            declaration =>
              declaration.value.source.value === '@atlaskit/button/types',
          );
        addCommentBefore({
          j,
          target,
          message: `
      Verify ButtonProps is the right prop type
      You might need the LoadingButtonProps, CustomButtonProps types which can be imported from '@atlaskit/button/types'
    `,
        });
      }

      changeUsage({
        j,
        base,
        packageName: '@atlaskit/button',
      });
    },
  });
}

// Note: not exporting a 'parser' because doing so
// will prevent consumers overriding it
