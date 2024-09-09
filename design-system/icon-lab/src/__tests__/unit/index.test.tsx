import React from 'react';
import { render, screen } from '@testing-library/react';

import path from 'path';
import fs from 'fs';
import metadataCore from '../../metadata-core';

// List all files in a directory in Node.js recursively in a synchronous fashion
const walkSync = (dir: string, filelist: string[]) => {
	let fl = filelist;
	const files = fs.readdirSync(dir);
	fl = filelist || [];
	files.forEach((file) => {
		const pth = path.join(dir, file);
		if (fs.statSync(pth).isDirectory()) {
			fl = walkSync(pth, fl);
		} else {
			fl.push(pth);
		}
	});
	return filelist;
};

describe('@atlaskit/icon-lab', () => {
	describe('new icon exports', () => {
		it('align with metadata', () => {
			// NOTE: An addition is a feature, a removal or rename is a BREAKING CHANGE
			const expectedIcons = Object.keys(metadataCore);

			const expectedPaths = expectedIcons.map((a) =>
				path.join(__dirname, '../../../core', `${a}.js`),
			);

			const actualPaths = walkSync(path.join(__dirname, '../../../core'), []).filter((ab) =>
				/.*\.js$/.test(ab),
			);

			expect(actualPaths.sort()).toEqual(expectedPaths.sort());
		});
	});

	describe('component structure', () => {
		Object.keys(metadataCore).forEach((key) => {
			it(`should be possible to create the ${key} component`, async () => {
				const component = await import(`../../../core/${key}`);

				const Icon = component.default;
				render(<Icon label={Icon.name} />);
				expect(screen.getByRole('img')).toBeInTheDocument();
				expect(Icon).toBeInstanceOf(Function);
			});
		});
	});
});
