/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::1ca7a384145f3bf3577ede9b88907a52>>
 * @codegenCommand yarn workspace @atlaskit/eslint-plugin-design-system codegen
 */
import type { ESLint } from 'eslint';

import allFlat from './presets/all-flat.codegen';
import all from './presets/all.codegen';
import recommendedFlat from './presets/recommended-flat.codegen';
import recommended from './presets/recommended.codegen';
import { rules } from './rules/index.codegen';

// this uses require because not all node versions this package supports use the same import assertions/attributes
// eslint-disable-next-line import/no-extraneous-dependencies
const pkgJson = require('@atlaskit/eslint-plugin-design-system/package.json');

const { version, name }: { name: string; version: string } = pkgJson;

const meta = {
	name,
	version,
};

export const plugin = {
	meta,
	rules,
	configs: {
		all,
		'all/flat': {
			...allFlat,
			plugins: {
				...allFlat.plugins,
				get '@atlaskit/design-system'(): ESLint.Plugin {
					return plugin;
				},
			},
		},
		recommended,
		'recommended/flat': {
			...recommendedFlat,
			plugins: {
				...recommendedFlat.plugins,
				get '@atlaskit/design-system'(): ESLint.Plugin {
					return plugin;
				},
			},
		},
	},
} satisfies ESLint.Plugin;
const configs = plugin.configs;

export { configs, meta, rules };
export default plugin;
