/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::c77bc1fd6f2331dc0cae4fb3a58994d3>>
 * @codegenCommand yarn workspace @atlaskit/eslint-plugin-design-system codegen
 */
import allFlat from './presets/all-flat.codegen';
import all from './presets/all.codegen';
import recommendedFlat from './presets/recommended-flat.codegen';
import recommended from './presets/recommended.codegen';
import { rules } from './rules/index.codegen';

// this uses require because not all node versions this package supports use the same import assertions/attributes
// eslint-disable-next-line import/no-extraneous-dependencies
const pkgJson = require('@atlaskit/eslint-plugin-design-system/package.json');

const { version, name }: { name: string; version: string } = pkgJson;

export const plugin = {
	meta: {
		name,
		version,
	},
	rules,
	// flat configs need to be done like this so they can get a reference to the plugin.
	// see here: https://eslint.org/docs/latest/extend/plugins#configs-in-plugins
	// they cannot use `Object.assign` because it will not work with the getter
	configs: {
		all,
		'all/flat': {
			...allFlat,
			plugins: {
				...allFlat.plugins,
				get '@atlaskit/design-system'() {
					return plugin;
				},
			},
		},
		recommended,
		'recommended/flat': {
			...recommendedFlat,
			plugins: {
				...recommendedFlat.plugins,
				get '@atlaskit/design-system'() {
					return plugin;
				},
			},
		},
	},
} as const;

export { rules } from './rules/index.codegen';
export const { configs, meta } = plugin;

export default plugin;
