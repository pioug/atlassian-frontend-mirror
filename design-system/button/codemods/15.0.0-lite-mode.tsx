import { type API, type FileInfo, type Options } from 'jscodeshift';
import { type Collection } from 'jscodeshift/src/Collection';

import { changeType, transformButton } from './helpers/15.0.0-runner';
import {
	getDefaultSpecifierName,
	type Nullable,
	shiftDefaultImport,
} from './helpers/helpers-generic';

export default function transformer(file: FileInfo, { jscodeshift: j }: API, options: Options) {
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
