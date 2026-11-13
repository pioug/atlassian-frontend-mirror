// eslint-disable-next-line import/no-extraneous-dependencies -- esbuild is a build-only devDependency; this script is excluded from the published package.
import { build } from 'esbuild';

import { runScript } from './script-helpers';

runScript(() =>
	build({
		entryPoints: ['src/atlas-cli.tsx'],
		bundle: true,
		outfile: 'build/atlas/ads-cli.js',
		format: 'cjs',
		platform: 'node',
		target: 'node18',
		define: {
			__ADS_ATLAS_RELEASE_VERSION__: JSON.stringify(process.env.VERSION ?? ''),
		},
	}),
);
