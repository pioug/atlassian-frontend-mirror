import type { AdfNode, ComplexityResult, DebugNodePath } from './types';

interface StackEntry {
	node: AdfNode;
	multiplier: number;
	pathLength: number;
	path: string[];
}

/**
 * Represents types that can be safely serialized for Web Worker communication.
 * Based on the Structured Clone Algorithm supported types.
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Structured_clone_algorithm
 */
type Serializable =
	| null
	| undefined
	| boolean
	| number
	| string
	| Date
	| RegExp
	| Blob
	| File
	| FileList
	| ArrayBuffer
	| ArrayBufferView
	| ImageData
	| Array<Serializable>
	| { [key: string]: Serializable }
	| Map<Serializable, Serializable>
	| Set<Serializable>;

/**
 * Makes all nested properties of a type serializable
 */
type DeepSerializable<T> = T extends Serializable
	? T
	: T extends Array<infer U>
		? Array<DeepSerializable<U>>
		: T extends Map<infer K, infer V>
			? Map<DeepSerializable<K>, DeepSerializable<V>>
			: T extends Set<infer U>
				? Set<DeepSerializable<U>>
				: T extends object
					? { [K in keyof T]: DeepSerializable<T[K]> }
					: never;

type SerializableAdfNode = DeepSerializable<AdfNode>;
type SerializableOptions = DeepSerializable<{
	debug?: boolean;
}>;

/**
 * IMPORTANT: This function must be self-contained and not reference any external variables
 * as it will be executed in a Web Worker context.
 *
 * Rules to follow:
 * 1. All dependencies must be passed through the parameters
 * 2. Only use standard built-in objects (Map, Set, Array, etc.)
 * 3. No imports or requires inside the function
 * 4. No closure variables
 * 5. No DOM references
 *
 * @throws Will throw an error if executed in a Web Worker and external dependencies are used
 */
export function collectLeafNodesWeightsInternal(
	root: SerializableAdfNode,
	options: SerializableOptions,
): ComplexityResult {
	function isLeafNode(node: AdfNode): boolean {
		return node.type === 'text' || !node.content?.length;
	}

	const debugPathsMap = new Map<
		string,
		{
			path: string[];
			type: string;
			baseWeight: number;
			parentWeight: number;
			count: number;
			totalWeight: number;
		}
	>();

	function onLeafNodeFound({
		path,
		leafNode,
		baseWeight,
		parentWeight,
	}: {
		path: string[];
		leafNode: AdfNode;
		baseWeight: number;
		parentWeight: number;
	}) {
		const pathKey = path.concat([leafNode.type]).join('->');

		const existing = debugPathsMap.get(pathKey);
		if (existing) {
			existing.count++;
			existing.totalWeight += baseWeight * parentWeight;
		} else {
			debugPathsMap.set(pathKey, {
				path,
				type: leafNode.type,
				baseWeight,
				parentWeight,
				count: 1,
				totalWeight: baseWeight * parentWeight,
			});
		}
	}

	const NON_TEXT_LEAF_NODE_BASE_WEIGHT = 1.2;
	function calcLeafNodeMultipler(node: AdfNode) {
		if (node.type === 'text') {
			return 1;
		}

		// TODO: ED-28506 - Implement custom weight for leaf nodes
		return NON_TEXT_LEAF_NODE_BASE_WEIGHT;
	}

	const stack: StackEntry[] = [
		{
			node: root,
			multiplier: 0,
			pathLength: 1,
			path: [root.type],
		},
	];

	let current: StackEntry | undefined;
	let totalWeight: number = 0;
	const debug = options.debug;

	while (
		// This is micro-performance optimization to reduce the amount of lookups
		// Please, don't replace it with the `stack.length` approach
		// eslint-disable-next-line no-cond-assign
		(current = stack.pop())
	) {
		const node = current.node;
		const multiplier = current.multiplier;
		const nodeContent = node.content;
		const pathLength = current.pathLength;
		const path = current.path;

		if (nodeContent?.length) {
			const len = nodeContent.length;

			// This is micro-performance optimization to speed up the tree loop
			// At this moment, reversed for loops has the highest ops/sec result
			// See: https://jsperf.app/for-for-of-for-in-foreach-comparison
			for (let i = len - 1; i >= 0; i--) {
				const child = nodeContent[i];
				// TODO: ED-28507 - Implement custom weight for block nodes
				const blockNodesMultiplier = 1;
				const nextPath = isLeafNode(child) ? path : path.concat(child.type);

				stack.push({
					node: child,
					// This is micro-performance optimization to reduce the amount of lookup we do at `path`
					// by providing the length as metadata
					pathLength: pathLength + 1,
					multiplier: multiplier + blockNodesMultiplier,
					path: nextPath,
				});
			}
		} else if (isLeafNode(node)) {
			const baseWeight = calcLeafNodeMultipler(node);
			const leafNodeWeight = multiplier * baseWeight;
			totalWeight = totalWeight + leafNodeWeight;

			if (debug) {
				onLeafNodeFound({
					path,
					baseWeight,
					leafNode: node,
					parentWeight: multiplier,
				});
			}
		}
	}

	if (!debug) {
		return {
			weight: totalWeight,
			debugPaths: [],
		};
	}

	const debugPaths: DebugNodePath[] = Array.from(debugPathsMap.values()).map(
		({ path, type, baseWeight, parentWeight, count, totalWeight }) => [
			...path,
			{
				type,
				baseWeight,
				parentWeight,
				count,
				totalWeight,
			},
		],
	);

	return {
		weight: totalWeight,
		debugPaths,
	};
}

function isWebWorkerSupported(): boolean {
	try {
		// Check if Worker is defined
		if (typeof Worker === 'undefined') {
			return false;
		}

		// Check if Blob is supported
		if (typeof Blob === 'undefined') {
			return false;
		}

		// Check if URL or webkitURL is supported
		if (typeof URL === 'undefined' && typeof webkitURL === 'undefined') {
			return false;
		}

		// Test if we can actually create a worker
		const blob = new Blob([''], { type: 'text/javascript' });
		const url = URL.createObjectURL(blob);
		const worker = new Worker(url);
		worker.terminate();
		URL.revokeObjectURL(url);

		return true;
	} catch (e) {
		return false;
	}
}

function createWorker(fn: Function): Worker {
	try {
		const blob = new Blob(
			[
				`
				const fn = ${fn.toString()};
				self.onmessage = function(e) {
          try {
            const result = fn(e.data.root, e.data.options);
            self.postMessage({ success: true, data: result });
          } catch (error) {
            self.postMessage({
              success: false,
              error: {
                message: error.message,
                stack: error.stack
              }
            });
          }
        }`,
			],
			{ type: 'text/javascript' },
		);

		const url = URL.createObjectURL(blob);
		const worker = new Worker(url);

		// Clean up the URL once the worker is created
		URL.revokeObjectURL(url);

		return worker;
	} catch (error) {
		throw new Error(`Failed to create Web Worker`);
	}
}

class WorkerManager {
	private static instance: WorkerManager;
	private worker: Worker | null = null;
	private currentTask: { resolve: Function; reject: Function } | null = null;
	private isProcessing = false;
	private taskQueue: Array<{
		root: AdfNode;
		options: SerializableOptions;
		resolve: Function;
		reject: Function;
	}> = [];

	private constructor() {
		// Private constructor to enforce singleton
	}

	static getInstance(): WorkerManager {
		if (!WorkerManager.instance) {
			WorkerManager.instance = new WorkerManager();
		}
		return WorkerManager.instance;
	}

	private initializeWorker() {
		if (this.worker) {
			return;
		}

		this.worker = createWorker(collectLeafNodesWeightsInternal);

		this.worker.onmessage = (e) => {
			if (!this.currentTask) {
				return;
			}

			const { resolve, reject } = this.currentTask;
			this.currentTask = null;
			this.isProcessing = false;

			if (e.data.success) {
				resolve(e.data.data);
			} else {
				reject(new Error(e.data.error.message));
			}

			this.processNextTask();
		};

		this.worker.onerror = (error) => {
			if (!this.currentTask) {
				return;
			}

			const { reject } = this.currentTask;
			this.currentTask = null;
			this.isProcessing = false;

			reject(new Error(`Worker error: ${error.message}`));
			this.processNextTask();
		};
	}

	private processNextTask() {
		if (this.isProcessing || this.taskQueue.length === 0) {
			return;
		}

		const nextTask = this.taskQueue.shift();
		if (!nextTask) {
			return;
		}

		this.isProcessing = true;
		this.currentTask = {
			resolve: nextTask.resolve,
			reject: nextTask.reject,
		};

		this.worker?.postMessage({
			root: nextTask.root,
			options: nextTask.options,
		});
	}

	executeTask(root: AdfNode, options: SerializableOptions): Promise<ComplexityResult> {
		return new Promise((resolve, reject) => {
			this.taskQueue.push({ root, options, resolve, reject });

			if (!this.worker) {
				this.initializeWorker();
			}

			if (!this.isProcessing) {
				this.processNextTask();
			}
		});
	}

	terminate() {
		if (this.worker) {
			this.worker.terminate();
			this.worker = null;
		}
		this.currentTask = null;
		this.isProcessing = false;
		this.taskQueue = [];
	}
}

export function collectLeafNodesWeights(
	root: AdfNode,
	options: {
		useWebWorker?: boolean;
		debug?: boolean;
	},
): Promise<ComplexityResult> {
	if (!options.useWebWorker || !isWebWorkerSupported()) {
		return Promise.resolve(collectLeafNodesWeightsInternal(root, options));
	}

	try {
		return WorkerManager.getInstance().executeTask(root, options);
	} catch (error) {
		// If worker execution fails, fallback to synchronous execution
		return Promise.resolve(collectLeafNodesWeightsInternal(root, options));
	}
}
