/* eslint-disable @repo/internal/fs/filename-pattern-match */
/* eslint-disable import/no-extraneous-dependencies */
/***
 * Commented due to HOT-111922
 * We will skip this test since this test is failing in CI with the following error
 *   ● Test suite failed to run
    Jest worker encountered 4 child process exceptions, exceeding retry limit
      at ChildProcessWorker.initialize (node_modules/jest-worker/build/workers/ChildProcessWorker.js:181:21)
	  To replicate the error in Local try reducing the memory by setting jestFlags['workerIdleMemoryLimit'] to some small value in
	  platform/build/ci/test-pipeline/scripts/run-test.ts

 */
// const {
// 	captureScreenshot,
// 	createFolders,
// 	findComponentsWithSVGs,
// 	renderComponents,
// } = require('./svg-automation');

// jest.mock('fs', () => ({
// 	readFileSync: jest.fn().mockReturnValue('<svg>mock svg content</svg>'),
// 	writeFileSync: jest.fn(),
// 	existsSync: jest.fn().mockReturnValue(false),
// 	mkdirSync: jest.fn(),
// 	rmdirSync: jest.fn(),
// 	unlinkSync: jest.fn(),
// }));

// jest.mock('globby', () => jest.fn(() => ['path/to/mock/component1.jsx', 'path/to/mock/image.svg']));

// jest.mock('puppeteer', () => ({
// 	launch: jest.fn().mockResolvedValue({
// 		newPage: jest.fn().mockResolvedValue({
// 			setContent: jest.fn(),
// 			evaluate: jest.fn(),
// 			$$eval: jest.fn().mockResolvedValue([
// 				{ width: 100, height: 200 },
// 				{ width: 150, height: 250 },
// 			]),
// 			setViewport: jest.fn(),
// 			screenshot: jest.fn(),
// 			close: jest.fn(),
// 		}),
// 		close: jest.fn(),
// 	}),
// }));

// jest.mock('react', () => ({ createElement: jest.fn(), Fragment: jest.fn() }));
// jest.mock('react-dom/server', () => ({ renderToString: jest.fn() }));

// jest.mock(
// 	'path/to/mock/component1.jsx',
// 	() => ({
// 		DefaultExportName: () => '<MockedComponent/>',
// 		AnotherExport: () => '<AnotherMockedComponent/>',
// 	}),
// 	{ virtual: true },
// );

// A fake test suite since we have commented out all tests. Remove it after fixing the other tests.
describe('Fake Test Suite', () => {
	it('should return true', () => {
		const result = true;
		expect(result).toBe(true);
	});
});
// Commented due to HOT-111922
// describe.skip('[findComponentsWithSVGs]', () => {
// 	it('returns components and svg files', async () => {
// 		const result = await findComponentsWithSVGs('components');
// 		expect(result).toEqual({
// 			components: ['path/to/mock/component1.jsx'],
// 			svgFiles: ['path/to/mock/image.svg'],
// 		});
// 	});
// });

// Commented due to HOT-111922
// describe.skip('[renderComponents]', () => {
// 	it('renders components correctly', () => {
// 		const ReactDOMServer = require('react-dom/server');
// 		ReactDOMServer.renderToString.mockReturnValue('<svg>mock svg content</svg>');

// 		const output = renderComponents('path/to/mock/component1.jsx');
// 		expect(output).toContain('<svg>mock svg content</svg>');
// 	});
// });

// Commented due to HOT-111922
// describe.skip('[captureScreenshot]', () => {
// 	it('captures and saves a screenshot', async () => {
// 		await captureScreenshot('<div></div>', 'output/path');
// 		const puppeteer = require('puppeteer');
// 		expect(puppeteer.launch).toHaveBeenCalled();
// 	});
// });

// Commented due to HOT-111922
// describe.skip('[createFolders]', () => {
// 	it('creates necessary folders', () => {
// 		const fs = require('fs');
// 		createFolders('mock/path');
// 		expect(fs.mkdirSync).toHaveBeenCalled();
// 	});
// });
