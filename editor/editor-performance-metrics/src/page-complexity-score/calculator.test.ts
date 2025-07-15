/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { DocumentComplexityCalculator } from './calculator';
import type { AdfNode, LeafNodeDebugInfo } from './types';

describe('DocumentComplexityCalculator', () => {
	let calculator: DocumentComplexityCalculator;

	beforeEach(async () => {
		calculator = new DocumentComplexityCalculator();
	});

	describe('Basic Document Tests', () => {
		it('should calculate weight for simple document with single text node', async () => {
			const doc: AdfNode = {
				type: 'doc',
				content: [
					{
						type: 'paragraph',
						attrs: {
							localId: null,
						},
						content: [
							{
								type: 'text',
								text: 'Hello',
							},
						],
					},
				],
			};

			const { weight } = await calculator.calculateTreeWeight(doc);
			expect(weight).toBeGreaterThan(0);
		});

		it('should calculate weight for document with multiple paragraphs', async () => {
			const doc: AdfNode = {
				type: 'doc',
				content: [
					{
						type: 'paragraph',
						attrs: {
							localId: null,
						},
						content: [
							{
								type: 'text',
								text: 'First paragraph',
							},
						],
					},
					{
						type: 'paragraph',
						attrs: {
							localId: null,
						},
						content: [
							{
								type: 'text',
								text: 'Second paragraph',
							},
						],
					},
				],
			};

			const { weight } = await calculator.calculateTreeWeight(doc);
			expect(weight).toBeGreaterThan(0);
		});

		it('should calculate weight for document with table structure', async () => {
			const doc: AdfNode = {
				type: 'doc',
				content: [
					{
						type: 'table',
						attrs: {
							isNumberColumnEnabled: false,
							layout: 'default',
						},
						content: [
							{
								type: 'tableRow',
								content: [
									{
										type: 'tableCell',
										attrs: {
											colspan: 1,
											rowspan: 1,
										},
										content: [
											{
												type: 'paragraph',
												attrs: {
													localId: null,
												},
												content: [
													{
														type: 'text',
														text: 'Table content',
													},
												],
											},
										],
									},
								],
							},
						],
					},
				],
			};

			const { weight } = await calculator.calculateTreeWeight(doc);
			expect(weight).toBeGreaterThan(0);
		});

		it('should calculate weight for document with emoji', async () => {
			const doc: AdfNode = {
				type: 'doc',
				content: [
					{
						type: 'paragraph',
						attrs: {
							localId: null,
						},
						content: [
							{
								type: 'emoji',
								attrs: {
									shortName: ':smile:',
									id: '123',
									text: '😊',
								},
							},
						],
					},
				],
			};

			const { weight } = await calculator.calculateTreeWeight(doc);
			expect(weight).toBeGreaterThan(0);
		});

		it('should calculate weight for document with mention', async () => {
			const doc: AdfNode = {
				type: 'doc',
				content: [
					{
						type: 'paragraph',
						attrs: {
							localId: null,
						},
						content: [
							{
								type: 'mention',
								attrs: {
									id: '123',
									text: '@user',
								},
							},
						],
					},
				],
			};

			const { weight } = await calculator.calculateTreeWeight(doc);
			expect(weight).toBeGreaterThan(0);
		});

		it('should cache reuslts for the same adf', async () => {
			const doc: AdfNode = {
				type: 'doc',
				content: [
					{
						type: 'paragraph',
						attrs: {
							localId: null,
						},
						content: [
							{
								type: 'text',
								text: 'Cache test',
							},
						],
					},
				],
			};

			const firstResult = await calculator.calculateTreeWeight(doc);
			const secondResult = await calculator.calculateTreeWeight(doc);
			expect(firstResult).toBe(secondResult);
		});

		it('should clean the cache properly', async () => {
			const doc: AdfNode = {
				type: 'doc',
				content: [
					{
						type: 'paragraph',
						attrs: {
							localId: null,
						},
						content: [
							{
								type: 'text',
								text: 'Cache test',
							},
						],
					},
				],
			};

			const firstResult = await calculator.calculateTreeWeight(doc);

			calculator.clearCache();

			const secondResult = await calculator.calculateTreeWeight(doc);
			expect(secondResult).not.toBe(firstResult);
		});
	});

	it('should provide detailed debug information', async () => {
		const doc: AdfNode = {
			type: 'doc',
			content: [
				{
					type: 'paragraph',
					content: [
						{
							type: 'text',
							text: 'Hello',
						},
					],
				},
			],
		};

		const result = await calculator.calculateTreeWeight(doc, { debug: true });
		expect(result.debugPaths).toHaveLength(1);
		expect(result.debugPaths![0]).toEqual([
			'doc',
			'paragraph',
			{
				type: 'text',
				count: 1,
				totalWeight: 2,
				baseWeight: 1,
				parentWeight: 2,
			},
		]);
	});

	it('should merge similar leaf nodes in debug information', async () => {
		const doc: AdfNode = {
			type: 'doc',
			content: [
				{
					type: 'paragraph',
					content: [
						{ type: 'text', text: 'First' },
						{ type: 'text', text: 'Second' },
					],
				},
				{
					type: 'paragraph',
					content: [{ type: 'text', text: 'Third' }],
				},
			],
		};

		const result = await calculator.calculateTreeWeight(doc, { debug: true });

		// Should have two entries: one for text nodes in first paragraph, one for second
		expect(result.debugPaths).toHaveLength(1);

		// Check the first paragraph's text nodes
		const firstPath = result.debugPaths![0];
		expect(firstPath[firstPath.length - 1]).toMatchObject({
			type: 'text',
			count: 3,
			totalWeight: expect.any(Number),
		});
	});

	it('should correctly calculate total weights for merged nodes', async () => {
		const doc: AdfNode = {
			type: 'doc',
			content: [
				{
					type: 'paragraph',
					content: [
						{ type: 'mention', attrs: { id: '1' } },
						{ type: 'mention', attrs: { id: '2' } },
					],
				},
			],
		};

		const result = await calculator.calculateTreeWeight(doc, { debug: true });

		expect(result.debugPaths).toHaveLength(1);

		const mentionInfo = result.debugPaths![0][
			result.debugPaths![0].length - 1
		] as LeafNodeDebugInfo;
		expect(mentionInfo).toMatchObject({
			type: 'mention',
			count: 2,
			baseWeight: 1.2,
			totalWeight: expect.any(Number),
		});

		// Total weight should be baseWeight * parentWeight * count
		expect(mentionInfo.totalWeight).toBe(
			mentionInfo.baseWeight * mentionInfo.parentWeight * mentionInfo.count,
		);
	});

	describe('when parent nodes have siblings', () => {
		it('should match the leaf nodes properly', async () => {
			const doc: AdfNode = {
				type: 'doc',
				content: [
					{
						type: 'paragraph',
						attrs: {
							localId: null,
						},
					},
					{
						type: 'table',
						attrs: {
							displayMode: null,
							isNumberColumnEnabled: false,
							layout: 'center',
							localId: 'ac9a9d4d-90ee-4b29-a792-b63cfc2c2b05',
							width: 927,
							__autoSize: false,
						},
						content: [
							{
								type: 'tableRow',
								content: [
									{
										type: 'tableHeader',
										attrs: {
											colspan: 1,
											rowspan: 1,
											colwidth: [211],
											background: null,
										},
										content: [
											{
												type: 'paragraph',
												attrs: {
													localId: null,
												},
											},
										],
									},
								],
							},
						],
					},
				],
			};

			const result = await calculator.calculateTreeWeight(doc, { debug: true });

			expect(result.debugPaths).toHaveLength(2);
			expect(result.debugPaths).toEqual(
				expect.arrayContaining([
					[
						'doc',
						{
							type: 'paragraph',
							baseWeight: expect.any(Number),
							parentWeight: expect.any(Number),
							count: 1,
							totalWeight: expect.any(Number),
						},
					],
				]),
			);

			expect(result.debugPaths).toEqual(
				expect.arrayContaining([
					[
						'doc',
						'table',
						'tableRow',
						'tableHeader',
						{
							type: 'paragraph',
							baseWeight: expect.any(Number),
							parentWeight: expect.any(Number),
							count: 1,
							totalWeight: expect.any(Number),
						},
					],
				]),
			);
		});
	});
});
