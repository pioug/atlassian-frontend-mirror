/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::abdb6f8b0dfdc4e2489691c04488f46e>>
 * @codegenCommand yarn workspace @atlaskit/eslint-plugin-design-system codegen
 */
import all from './presets/all.codegen';
import recommended from './presets/recommended.codegen';

export { default as rules } from './rules/index.codegen';

export const configs = {
	all,
	recommended,
};
