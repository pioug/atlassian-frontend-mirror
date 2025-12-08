const fs = require('fs');
const path = require('path');

const { globSync } = require('glob');
const mkdirp = require('mkdirp');
const SVGSpriter = require('svg-sprite');

const { getWorkspacesInfo } = require('@af/yarn-utils');

getWorkspacesInfo({ only: '@atlaskit/icon' }).then(([pkg]) => {
	// We use icon package dir to get the processed SVGs.
	const iconPackageDir = pkg.dir;

	const spriterConfig = {
		dest: './src',
		// this generates the id attr for each svg in the sprite
		shape: {
			id: {
				generator: (_name, file) => {
					const iconName = file.path
						.replace(path.join(iconPackageDir, 'svgs/'), '')
						.replace('.svg', '');
					return `ak-icon-${iconName}`;
				},
			},
		},
		// this puts an inline style on the sprite to prevent it from being displayed on the page
		mode: {
			symbol: {
				dest: '.',
				inline: true,
				sprite: 'icons-sprite.svg',
			},
		},
	};

	const spriter = new SVGSpriter(spriterConfig);

	// Add SVG source files from 'ak-icon'
	globSync(path.join(iconPackageDir, 'svgs/**/*.svg'), {}).forEach((svgFile) => {
		// eslint-disable-next-line no-console
		console.log(svgFile);
		const svgContents = fs.readFileSync(svgFile, { encoding: 'utf-8' });
		spriter.add(svgFile, path.basename(svgFile), svgContents);
	});

	// Compile the sprite
	spriter.compile((error, result) => {
		if (error) {
			console.error(error); // eslint-disable-line no-console
			process.exit(1);
		}

		const { path: spritePath, contents } = result.symbol.sprite;
		mkdirp.sync(path.dirname(spritePath));

		fs.writeFileSync(spritePath, contents);
	});
});
