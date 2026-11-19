import fs from 'fs';
import path from 'path';

import {
	deprecatedCore as deprecatedIconLabCore,
	deprecatedUtility as deprecatedIconLabUtility,
} from '@atlaskit/icon-lab/deprecated-map';
import deprecatedCore from '@atlaskit/icon/deprecated-map';

import type { DeprecatedCategories, DeprecatedConfig } from './types';

// Built once at module load because rules call getConfig for every linted file
const parsedConfig = JSON.parse(
	fs.readFileSync(path.resolve(__dirname, '..', '..', '..', 'configs', 'deprecated.json'), 'utf8'),
);

const combinedConfig = {
	...parsedConfig,
	imports: {
		...parsedConfig.imports,
		...deprecatedCore,
		...deprecatedIconLabCore,
		...deprecatedIconLabUtility,
	},
};

export const getConfig = (specifier: DeprecatedCategories): DeprecatedConfig =>
	combinedConfig[specifier];
