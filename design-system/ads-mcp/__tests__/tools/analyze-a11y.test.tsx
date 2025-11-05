import axe from 'axe-core';

import { analyzeA11yTool, analyzeLocalhostA11yTool } from '../../src/tools/analyze-a11y';

jest.mock('axe-core', () => ({
	run: jest.fn(() => ({
		violations: [],
	})),
}));

describe('ads_analyze_a11y tool', () => {
	it('Does not include violations if there are none from axe', async () => {
		const result = await analyzeA11yTool({ code: 'button ' });
		const resultContent = JSON.parse(result.content[0].text);
		expect(resultContent.violations).toHaveLength(0);
	});

	it('Includes axe results mapped to ADS fixes', async () => {
		(axe.run as jest.Mock).mockImplementationOnce(() => ({
			violations: [{ help: 'Test Violation', tags: [] }],
		}));
		const result = await analyzeA11yTool({ code: 'button' });
		const resultContent = JSON.parse(result.content[0].text);
		expect(resultContent.violations).toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					help: 'Test Violation',
					adsFix: expect.objectContaining({
						adsFix: expect.stringContaining(
							'Use the ads_suggest_a11y_fixes tool to get specific ADS component solutions.',
						),
					}),
				}),
			]),
		);
	});

	it('Includes pattern analysis if `includePatternAnalysis` is set', async () => {
		const result = await analyzeA11yTool({
			code: '<button></button>',
			includePatternAnalysis: true,
		});
		const resultContent = JSON.parse(result.content[0].text);
		expect(resultContent.violations).toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					type: 'Button without accessible text',
				}),
			]),
		);
	});

	it.each([
		['buttons', 'button', 'Always provide accessible labels for buttons'],
		['buttons', 'onClick', 'Always provide accessible labels for buttons'],
		['forms', 'input', 'Use TextField component for consistent labeling'],
		['forms', 'form', 'Use TextField component for consistent labeling'],
		['images', 'img', 'Use Image component with proper alt text'],
		['images', 'image', 'Use Image component with proper alt text'],
		['colors', 'color', 'Use design tokens for consistent contrast ratios'],
		['colors', 'style', 'Use design tokens for consistent contrast ratios'],
	])(
		'Includes the ADS specific guidelines for %s when the code includes `%s`',
		async (_guideline, codePiece, exampleGuideline) => {
			const result = await analyzeA11yTool({ code: codePiece });
			expect(JSON.parse(result.content[0].text).relevantGuidelines[0].guidelines).toEqual(
				expect.arrayContaining([exampleGuideline]),
			);
		},
	);

	it('Falls back to pattern based analysis if axe fails', async () => {
		(axe.run as jest.Mock).mockImplementationOnce(() => {
			throw new Error('Some problem with axe run');
		});
		const result = await analyzeA11yTool({ code: '<button></button>' });
		const resultContent = JSON.parse(result.content[0].text);
		expect(resultContent.error).toEqual(
			'Axe-core analysis failed, used pattern-based analysis as fallback',
		);
		expect(resultContent.violations).toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					type: 'Button without accessible text',
				}),
			]),
		);
	});
});

// Mock puppeteer for localhost a11y tests
const mockPage = {
	goto: jest.fn(),
	$: jest.fn(),
	evaluate: jest.fn(),
};

const mockBrowser = {
	newPage: jest.fn(() => mockPage),
	close: jest.fn(),
};

const mockAxePuppeteer = {
	include: jest.fn(),
	analyze: jest.fn(),
};

jest.mock('puppeteer', () => ({
	launch: jest.fn(() => mockBrowser),
}));

jest.mock('@axe-core/puppeteer', () => ({
	AxePuppeteer: jest.fn(() => mockAxePuppeteer),
}));

describe('ads_analyze_localhost_a11y tool', () => {
	beforeEach(() => {
		jest.clearAllMocks();
		mockPage.goto.mockResolvedValue(undefined);
		mockPage.$.mockResolvedValue(true);
		(mockAxePuppeteer.analyze as jest.Mock).mockResolvedValue({
			violations: [],
			passes: [],
			incomplete: [],
		});
	});

	it('Does not include violations if there are none from axe', async () => {
		const result = await analyzeLocalhostA11yTool({ url: 'http://localhost:9000' });
		const resultContent = JSON.parse(result.content[0].text);
		expect(resultContent.violations).toHaveLength(0);
	});

	it('Includes axe results mapped to ADS fixes', async () => {
		mockAxePuppeteer.analyze.mockResolvedValueOnce({
			violations: [{ help: 'Test Violation', tags: [] }],
			passes: [],
			incomplete: [],
		});
		const result = await analyzeLocalhostA11yTool({ url: 'http://localhost:9000' });
		const resultContent = JSON.parse(result.content[0].text);
		expect(resultContent.violations).toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					help: 'Test Violation',
					adsFix: expect.objectContaining({
						adsFix: expect.stringContaining(
							'Use the ads_suggest_a11y_fixes tool to get specific ADS component solutions.',
						),
					}),
				}),
			]),
		);
	});

	it('Uses selector when provided to analyze specific element', async () => {
		mockPage.$.mockResolvedValueOnce(true); // Element exists
		await analyzeLocalhostA11yTool({
			url: 'http://localhost:9000',
			selector: '#my-button',
		});
		expect(mockPage.$).toHaveBeenCalledWith('#my-button');
		expect(mockAxePuppeteer.include).toHaveBeenCalledWith('#my-button');
	});

	it('Throws error when selector element does not exist', async () => {
		mockPage.$.mockResolvedValueOnce(null); // Element does not exist
		mockPage.evaluate.mockResolvedValueOnce(['#other-element', '#another-element']);

		const result = await analyzeLocalhostA11yTool({
			url: 'http://localhost:9000',
			selector: '#non-existent',
		});
		const resultContent = JSON.parse(result.content[0].text);
		expect(resultContent.error).toContain('Element with selector "#non-existent" not found');
	});

	it('Includes URL and selector information in summary', async () => {
		const result = await analyzeLocalhostA11yTool({
			url: 'http://localhost:9000',
			selector: '#my-component',
			componentName: 'MyComponent',
			context: 'Testing component accessibility',
		});
		const resultContent = JSON.parse(result.content[0].text);
		expect(resultContent.summary).toEqual(
			expect.objectContaining({
				url: 'http://localhost:9000',
				selector: '#my-component',
				componentName: 'MyComponent',
				context: 'Testing component accessibility',
			}),
		);
	});

	it('Defaults to "Entire page analyzed" when no selector provided', async () => {
		const result = await analyzeLocalhostA11yTool({ url: 'http://localhost:9000' });
		const resultContent = JSON.parse(result.content[0].text);
		expect(resultContent.summary.selector).toBe('Entire page analyzed');
	});

	it('Handles browser/page errors', async () => {
		mockPage.goto.mockRejectedValueOnce(new Error('Failed to navigate to URL'));

		const result = await analyzeLocalhostA11yTool({ url: 'http://invalid-url' });
		const resultContent = JSON.parse(result.content[0].text);
		expect(resultContent.error).toContain('Failed to navigate to URL');
		expect(mockBrowser.close).toHaveBeenCalled();
	});

	it('Waits for network idle before analyzing', async () => {
		await analyzeLocalhostA11yTool({ url: 'http://localhost:9000' });
		expect(mockPage.goto).toHaveBeenCalledWith('http://localhost:9000', {
			waitUntil: 'networkidle0',
		});
	});

	it('Closes browser even when analysis fails', async () => {
		mockAxePuppeteer.analyze.mockRejectedValueOnce(new Error('Axe analysis failed'));

		const result = await analyzeLocalhostA11yTool({ url: 'http://localhost:9000' });
		const resultContent = JSON.parse(result.content[0].text);
		expect(resultContent.error).toContain('Axe analysis failed');
		expect(mockBrowser.close).toHaveBeenCalled();
	});

	it.each([
		['buttons', 'button', 'Always provide accessible labels for buttons'],
		['buttons', 'onClick', 'Always provide accessible labels for buttons'],
		['forms', 'input', 'Use TextField component for consistent labeling'],
		['forms', 'form', 'Use TextField component for consistent labeling'],
		['images', 'img', 'Use Image component with proper alt text'],
		['images', 'image', 'Use Image component with proper alt text'],
		['colors', 'color', 'Use design tokens for consistent contrast ratios'],
		['colors', 'style', 'Use design tokens for consistent contrast ratios'],
	])(
		'Includes the ADS specific guidelines for %s when the URL includes `%s`',
		async (_guideline, urlPiece, exampleGuideline) => {
			const result = await analyzeLocalhostA11yTool({
				url: `http://localhost:9000/${urlPiece}`,
			});
			expect(JSON.parse(result.content[0].text).relevantGuidelines[0].guidelines).toEqual(
				expect.arrayContaining([exampleGuideline]),
			);
		},
	);
});
