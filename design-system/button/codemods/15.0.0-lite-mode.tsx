import { API, FileInfo, Options } from 'jscodeshift';
import { Collection } from 'jscodeshift/src/Collection';

import { changeType, transformButton } from './helpers/15.0.0-runner';
import {
  getDefaultSpecifierName,
  Nullable,
  shiftDefaultImport,
} from './helpers/helpers-generic';

export default function transformer(
  file: FileInfo,
  { jscodeshift: j }: API,
  options: Options,
) {
  return transformButton({
    file,
    j,
    custom: (base: Collection<any>) => {
      changeType({
        j,
        base,
        oldName: 'ButtonProps',
        newName: 'CustomThemeButtonProps',
        fallbackNameAlias: 'DSCustomThemeButtonProps',
      });

      const defaultName: Nullable<string> = getDefaultSpecifierName({
        j,
        base,
        packageName: '@atlaskit/button',
      });
      if (defaultName == null) {
        return;
      }

      shiftDefaultImport({
        j,
        base,
        defaultName,
        oldPackagePath: '@atlaskit/button',
        newPackagePath: '@atlaskit/button/custom-theme-button',
      });
    },
  });
}

// Note: not exporting a 'parser' because doing so
// will prevent consumers overriding it
