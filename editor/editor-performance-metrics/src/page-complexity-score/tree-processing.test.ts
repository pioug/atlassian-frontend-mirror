/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { collectLeafNodesWeights, collectLeafNodesWeightsInternal } from './tree-processing';
import type { AdfNode } from './types';

describe('collectLeafNodesWeights', () => {
	const options = {
		debug: true, // Enable debug mode to get debugPaths
	};

	it('should calculate debug paths for a simple document', async () => {
		const doc: AdfNode = {
			type: 'doc',
			content: [
				{
					type: 'paragraph',
					content: [{ type: 'text', text: 'hello' }],
				},
			],
		};

		const result = await collectLeafNodesWeights(doc, options);
		expect(result.debugPaths).toHaveLength(1);
		expect(result.debugPaths![0]).toEqual([
			'doc',
			'paragraph',
			{
				type: 'text',
				baseWeight: 1,
				parentWeight: 2,
				count: 1,
				totalWeight: 2,
			},
		]);
	});

	it('should calculate debug paths for a complex document', async () => {
		const doc: AdfNode = {
			type: 'doc',
			content: [
				{
					type: 'paragraph',
					content: [
						{ type: 'text', text: 'hello' },
						{ type: 'mention', text: '@user' },
					],
				},
				{
					type: 'table',
					content: [{ type: 'text', text: 'table text' }],
				},
			],
		};

		const result = await collectLeafNodesWeights(doc, options);
		expect(result.debugPaths).toHaveLength(3);
		expect(result.debugPaths![0]).toEqual([
			'doc',
			'paragraph',
			{
				type: 'text',
				baseWeight: 1,
				parentWeight: 2,
				count: 1,
				totalWeight: 2,
			},
		]);
		expect(result.debugPaths![1]).toEqual([
			'doc',
			'paragraph',
			{
				type: 'mention',
				baseWeight: 1.2,
				parentWeight: 2,
				count: 1,
				totalWeight: 2.4,
			},
		]);
		expect(result.debugPaths![2]).toEqual([
			'doc',
			'table',
			{
				type: 'text',
				baseWeight: 1,
				parentWeight: 2,
				count: 1,
				totalWeight: 2,
			},
		]);
	});

	it('should handle empty document', async () => {
		const doc: AdfNode = {
			type: 'doc',
		};

		const result = await collectLeafNodesWeights(doc, options);
		expect(result.debugPaths).toHaveLength(1);
		expect(result.debugPaths![0]).toEqual([
			'doc',
			{
				type: 'doc',
				baseWeight: 1.2,
				parentWeight: 0,
				count: 1,
				totalWeight: 0,
			},
		]);
	});

	it('should handle deeply nested structure', async () => {
		const doc: AdfNode = {
			type: 'doc',
			content: [
				{
					type: 'table',
					content: [
						{
							type: 'paragraph',
							content: [
								{ type: 'text', text: 'deep text' },
								{ type: 'mention', text: '@deep' },
							],
						},
					],
				},
			],
		};

		const result = await collectLeafNodesWeights(doc, options);
		expect(result.debugPaths).toHaveLength(2);
		expect(result.debugPaths).toContainEqual([
			'doc',
			'table',
			'paragraph',
			{
				type: 'text',
				baseWeight: 1,
				parentWeight: 3,
				count: 1,
				totalWeight: 3,
			},
		]);
		expect(result.debugPaths).toContainEqual([
			'doc',
			'table',
			'paragraph',
			{
				type: 'mention',
				baseWeight: 1.2,
				parentWeight: 3,
				count: 1,
				totalWeight: expect.closeTo(3.6, 1),
			},
		]);
	});

	it('should handle document with only leaf nodes', async () => {
		const doc: AdfNode = {
			type: 'doc',
			content: [
				{ type: 'text', text: 'text1' },
				{ type: 'text', text: 'text2' },
				{ type: 'mention', text: '@user' },
			],
		};

		const result = await collectLeafNodesWeights(doc, options);
		expect(result.debugPaths).toHaveLength(2);
		expect(result.debugPaths).toContainEqual([
			'doc',
			{
				type: 'text',
				baseWeight: 1,
				parentWeight: 1,
				count: 2,
				totalWeight: 2,
			},
		]);
		expect(result.debugPaths).toContainEqual([
			'doc',
			{
				type: 'mention',
				baseWeight: 1.2,
				parentWeight: 1,
				count: 1,
				totalWeight: 1.2,
			},
		]);
	});

	it('should handle document with default weights', async () => {
		const doc: AdfNode = {
			type: 'doc',
			content: [
				{
					type: 'paragraph',
					content: [
						{ type: 'text', text: 'hello' },
						{ type: 'mention', text: '@user' },
					],
				},
			],
		};

		const defaultOptions = {
			...options,
			useDefaultWeights: true,
		};

		const result = await collectLeafNodesWeights(doc, defaultOptions);
		expect(result.debugPaths).toHaveLength(2);
		expect(result.debugPaths![0]).toEqual([
			'doc',
			'paragraph',
			{
				type: 'text',
				baseWeight: 1,
				parentWeight: 2,
				count: 1,
				totalWeight: 2,
			},
		]);
		expect(result.debugPaths![1]).toEqual([
			'doc',
			'paragraph',
			{
				type: 'mention',
				baseWeight: 1.2,
				parentWeight: 2,
				count: 1,
				totalWeight: 2.4,
			},
		]);
	});

	it('should handle nodes with empty content arrays', async () => {
		const doc: AdfNode = {
			type: 'doc',
			content: [
				{
					type: 'paragraph',
					content: [],
				},
				{
					type: 'table',
					content: [],
				},
			],
		};

		const result = await collectLeafNodesWeights(doc, options);
		expect(result.debugPaths).toHaveLength(2);
		expect(result.debugPaths![0]).toEqual([
			'doc',
			{
				type: 'paragraph',
				baseWeight: 1.2,
				parentWeight: 1,
				count: 1,
				totalWeight: 1.2,
			},
		]);
		expect(result.debugPaths![1]).toEqual([
			'doc',
			{
				type: 'table',
				baseWeight: 1.2,
				parentWeight: 1,
				count: 1,
				totalWeight: 1.2,
			},
		]);
	});

	it('should handle undefined content property', async () => {
		const doc: AdfNode = {
			type: 'doc',
			content: [
				{ type: 'paragraph' }, // no content property
				{ type: 'text', text: 'hello' },
			],
		};

		const result = await collectLeafNodesWeights(doc, options);
		expect(result.debugPaths).toHaveLength(2);
		expect(result.debugPaths![0]).toEqual([
			'doc',
			{
				type: 'paragraph',
				baseWeight: 1.2,
				parentWeight: 1,
				count: 1,
				totalWeight: 1.2,
			},
		]);
		expect(result.debugPaths![1]).toEqual([
			'doc',
			{
				type: 'text',
				baseWeight: 1,
				parentWeight: 1,
				count: 1,
				totalWeight: 1,
			},
		]);
	});

	it('should return empty debug paths when debug option is false', async () => {
		const doc: AdfNode = {
			type: 'doc',
			content: [
				{
					type: 'paragraph',
					content: [{ type: 'text', text: 'hello' }],
				},
			],
		};

		const result = await collectLeafNodesWeights(doc, { ...options, debug: false });
		expect(result.debugPaths).toHaveLength(0);
		expect(result.weight).toBeDefined();
	});

	it('should maintain correct total weight in both debug and non-debug modes', async () => {
		const doc: AdfNode = {
			type: 'doc',
			content: [
				{
					type: 'paragraph',
					content: [
						{ type: 'text', text: 'hello' },
						{ type: 'mention', text: '@user' },
					],
				},
			],
		};

		const debugResult = await collectLeafNodesWeights(doc, options);
		const nonDebugResult = await collectLeafNodesWeights(doc, { ...options, debug: false });

		expect(debugResult.weight).toBe(nonDebugResult.weight);
		expect(debugResult.weight).toBeCloseTo(
			debugResult.debugPaths!.reduce((sum, path) => {
				// @ts-ignore
				const leafInfo = path[path.length - 1] as any;
				return sum + leafInfo.totalWeight;
			}, 0),
		);
	});
});

describe('collectLeafNodesWeightsInternal isolation', () => {
	/**
	 * These tests are critical for ensuring the safe execution of our code in Web Workers.
	 *
	 * Why is this important?
	 * --------------------
	 * 1. Web Worker Compatibility:
	 *    - Web Workers run in an isolated context without access to the main thread's scope
	 *    - Any external variable references will cause runtime errors in the Worker
	 *    - Functions must be completely self-contained to be serializable
	 *
	 * What we're testing:
	 * ------------------
	 * 1. Runtime Behavior:
	 *    - Verifies the function works in a restricted execution context
	 *    - Ensures no reliance on closure variables or global state
	 *    - Confirms proper handling of built-in objects and methods
	 *
	 * Common Issues This Prevents:
	 * --------------------------
	 * 1. ❌ Accessing global variables:
	 *    ```ts
	 *    const config = { ... };  // external variable
	 *    function bad(data) {
	 *      return config.someValue; // Will fail in Worker
	 *    }
	 *    ```
	 *
	 * 2. ❌ Using closure variables:
	 *    ```ts
	 *    const multiplier = 1.5;  // closure variable
	 *    function bad(data) {
	 *      return data * multiplier; // Will fail in Worker
	 *    }
	 *    ```
	 *
	 * 3. ❌ Importing modules inside function:
	 *    ```ts
	 *    function bad(data) {
	 *      const helper = require('./helper'); // Will fail in Worker
	 *      return helper(data);
	 *    }
	 *    ```
	 *
	 * Correct Pattern:
	 * ---------------
	 * ✅ Self-contained function with explicit dependencies:
	 * ```ts
	 * function good(data, config, helpers) {
	 *   const { multiplier } = config;
	 *   return helpers.process(data * multiplier);
	 * }
	 * ```
	 *
	 * Impact of Test Failure:
	 * ---------------------
	 * If these tests fail, it indicates that:
	 * 1. The function may crash when executed in a Web Worker
	 * 2. There are hidden dependencies that need to be made explicit
	 * 3. The code needs to be refactored for better isolation
	 *
	 * How to Fix Failures:
	 * ------------------
	 * 1. Move all external dependencies to function parameters
	 * 2. Use only allowed global objects (Map, Set, Array, etc.)
	 * 3. Refactor to remove closure variable dependencies
	 * 4. Pass necessary utilities and configurations as arguments
	 *
	 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API}
	 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Structured_clone_algorithm}
	 */
	describe('runtime isolation', () => {
		const createIsolatedFunction = (fnString: string) => {
			const contextStr = `
        const global = undefined;
        const window = undefined;
        const process = undefined;
        const require = undefined;
        const exports = undefined;
        const module = undefined;
        
        (${fnString})
      `;

			try {
				// eslint-disable-next-line
				return eval(contextStr);
			} catch (error) {
				throw new Error(`Failed to create isolated function: ${error}`);
			}
		};

		it('should execute without access to external variables', () => {
			const testRoot = { type: 'doc', content: [] };
			const testOptions = {
				characteristicWeights: {},
				blockNodeMultipliers: {},
				allLeafNodeCustomCharacteristics: {},
				useDefaultWeights: true,
				debug: false,
			};

			const isolatedFn = createIsolatedFunction(collectLeafNodesWeightsInternal.toString());
			const result = isolatedFn(testRoot, testOptions);

			expect(result).toBeDefined();
			expect(result.weight).toBe(0);
			expect(result.debugPaths).toEqual([]);
		});

		it('should throw error when trying to access external variables', () => {
			// Create a function that tries to access external variables
			const badFunction = `
        function test(root, options) {
          console.log(process.env); // This should fail
          return true;
        }
      `;

			const isolatedFn = createIsolatedFunction(badFunction);

			expect(() => {
				isolatedFn({}, {});
			}).toThrow();
		});

		it('should work with complex input', () => {
			const complexRoot = {
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

			const complexOptions = {
				debug: true,
			};

			const isolatedFn = createIsolatedFunction(collectLeafNodesWeightsInternal.toString());
			const result = isolatedFn(complexRoot, complexOptions);

			expect(result).toBeDefined();
			expect(result.weight).toBeGreaterThan(0);
			expect(result.debugPaths.length).toBeGreaterThan(0);
		});

		it('should maintain expected behavior with Map and Set', () => {
			const isolatedFn = createIsolatedFunction(collectLeafNodesWeightsInternal.toString());

			const root = {
				type: 'doc',
				content: [
					{
						type: 'text',
						text: 'Test',
					},
				],
			};

			const options = {
				debug: true,
			};

			// This would throw if Map or Set are not properly accessible
			const result = isolatedFn(root, options);
			expect(result).toBeDefined();
		});

		it('should handle errors gracefully', () => {
			const isolatedFn = createIsolatedFunction(collectLeafNodesWeightsInternal.toString());

			expect(() => {
				isolatedFn(null, {});
			}).toThrow();

			expect(() => {
				isolatedFn({}, null);
			}).toThrow();
		});
	});
});
