/* eslint-disable no-console */
console.warn = jest.fn();
console.error = jest.fn();

const fs = require('fs');
const os = require('os');
const path = require('path');

const {
	BUNDLE_FILENAME,
	PAGE_ENTRY_COPIES,
	copyBundleToPageEntries,
} = require('../../config/copyBundleToPageEntries');

const packageDir = path.resolve(__dirname, '../..');
const webpackProdSource = fs.readFileSync(path.join(packageDir, 'config/webpack.prod.js'), 'utf8');
const npmignore = fs.readFileSync(path.join(packageDir, '.npmignore'), 'utf8');

describe('published /page entry', () => {
	it('does not replace the existing webpack bundle entry', () => {
		expect(webpackProdSource).toContain("'embedded-confluence-bundle': indexPath");
		expect(webpackProdSource).not.toMatch(/entry:\s*\{[^}]*cjs\/page/);
	});

	it('copies the existing bundle to AFM /page dist paths without changing the source file', () => {
		const distDir = fs.mkdtempSync(path.join(os.tmpdir(), 'embedded-confluence-dist-'));
		const bundleContents = 'UMD_BUNDLE_CONTENTS';
		fs.writeFileSync(path.join(distDir, BUNDLE_FILENAME), bundleContents);

		copyBundleToPageEntries(distDir);

		expect(fs.readFileSync(path.join(distDir, BUNDLE_FILENAME), 'utf8')).toBe(bundleContents);
		for (const relativePath of PAGE_ENTRY_COPIES) {
			expect(fs.readFileSync(path.join(distDir, relativePath), 'utf8')).toBe(bundleContents);
		}
	});

	it('fails if the webpack bundle was not emitted', () => {
		const distDir = fs.mkdtempSync(path.join(os.tmpdir(), 'embedded-confluence-dist-'));
		expect(() => copyBundleToPageEntries(distDir)).toThrow(
			/Missing embedded-confluence-bundle\.js/,
		);
	});

	it('npmignores dist trees except the /page copies', () => {
		const lines = npmignore.split('\n').map((line) => line.trim());

		for (const tree of ['cjs', 'esm', 'es2019']) {
			expect(lines).toContain(`dist/${tree}/**`);
			expect(lines).toContain(`!dist/${tree}/page/index.js`);
			expect(lines).not.toContain(`dist/${tree}/`);
			expect(lines).not.toContain(`!dist/${tree}/page/`);
		}
	});
});
