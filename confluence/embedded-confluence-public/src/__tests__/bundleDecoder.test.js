/**
 * @jest-environment node
 */
const fs = require('fs');
const os = require('os');
const path = require('path');
const vm = require('vm');
const webpack = require('webpack');

// oxlint-disable-next-line import/extensions -- .common is part of the config basename, not a file extension.
const commonConfig = require('../../config/webpack.common');

describe('bundled query-string decoder', () => {
	let outputDir;
	let queryString;
	let resources;

	beforeAll(async () => {
		outputDir = fs.mkdtempSync(path.join(os.tmpdir(), 'embedded-confluence-decoder-'));
		const stats = await new Promise((resolve, reject) => {
			webpack(
				{
					mode: 'none',
					entry: require.resolve('query-string'),
					resolve: commonConfig.resolve,
					output: {
						path: outputDir,
						filename: 'query-string.js',
						libraryTarget: 'commonjs2',
					},
				},
				(error, result) => {
					if (error) {
						reject(error);
					} else if (result.hasErrors()) {
						reject(new Error(result.toString({ all: false, errors: true })));
					} else {
						resolve(result);
					}
				},
			);
		});

		resources = [...stats.compilation.modules].map((module) => module.resource);
		const context = { module: { exports: {} } };
		vm.runInNewContext(fs.readFileSync(path.join(outputDir, 'query-string.js'), 'utf8'), context);
		queryString = context.module.exports;
	});

	afterAll(() => {
		if (outputDir) {
			fs.rmSync(outputDir, { recursive: true, force: true });
		}
	});

	it('includes the patched decoder and excludes the transitive legacy decoder', () => {
		expect(resources).toContain(require.resolve('decode-uri-component-patched'));
		expect(resources).not.toContain(
			require.resolve('decode-uri-component', {
				paths: [path.dirname(require.resolve('query-string'))],
			}),
		);
	});

	it('preserves query parsing and encoding through the CommonJS adapter', () => {
		const { url, query } = queryString.parseUrl('https://example.com/page?title=caf%C3%A9&x=a+b');

		expect(url).toBe('https://example.com/page');
		expect({ ...query }).toEqual({ title: 'café', x: 'a b' });
		expect(queryString.stringify(query)).toBe('title=caf%C3%A9&x=a%20b');
	});

	it('does not decode percent escapes created while handling malformed input', () => {
		expect(queryString.parse('value=%25C3%25A5%zz').value).toBe('%C3%A5%zz');
	});
});
