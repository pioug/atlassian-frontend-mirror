import fs from 'fs';
import path from 'path';

import { deprecatedCore as deprecatedIconLabCore } from '@atlaskit/icon-lab/deprecated-map';
import {
	deprecatedCore as deprecatedIconCore,
	deprecatedUtility as deprecatedIconUtility,
} from '@atlaskit/icon/deprecated-map';

import type { DeprecatedCategories, DeprecatedConfig } from './types';

export const getConfig = (specifier: DeprecatedCategories): DeprecatedConfig => {
	const configPath = path.resolve(__dirname, '..', '..', '..', 'configs', 'deprecated.json');
	const source = fs.readFileSync(configPath, 'utf8');
	const parsedConfig = JSON.parse(source);

	const combinedConfig = {
		...parsedConfig,
		imports: {
			...parsedConfig.imports,
			...deprecatedIconCore,
			...deprecatedIconUtility,
			...deprecatedIconLabCore,
		},
	};

	return combinedConfig[specifier];
};
