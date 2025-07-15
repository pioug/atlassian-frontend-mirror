import { collectLeafNodesWeights } from './tree-processing';
import type { AdfNode, ComplexityResult } from './types';

export class DocumentComplexityCalculator {
	private static nodeCache = new WeakMap<AdfNode, ComplexityResult>();
	private static instance: DocumentComplexityCalculator;

	constructor() {
		if (DocumentComplexityCalculator.instance) {
			return DocumentComplexityCalculator.instance;
		}

		DocumentComplexityCalculator.instance = this;
	}

	public async calculateTreeWeight(
		nodeDocument: AdfNode,
		options: {
			useWebWorker?: boolean;
			debug?: boolean;
		} = {
			useWebWorker: true,
			debug: false,
		},
	): Promise<ComplexityResult> {
		const cached = DocumentComplexityCalculator.nodeCache.get(nodeDocument);
		if (cached !== undefined) {
			return cached;
		}

		try {
			const tmp = await collectLeafNodesWeights(nodeDocument, {
				useWebWorker: options.useWebWorker,
				debug: options.debug,
			});

			const result = {
				weight: Math.round(tmp.weight),
				debugPaths: tmp.debugPaths,
			};

			DocumentComplexityCalculator.nodeCache.set(nodeDocument, result);
			return result;
		} catch (error) {
			// eslint-disable-next-line no-console
			console.error('Complexity calculation failed, using fallback', error);
			return {
				weight: -1,
			};
		}
	}

	public clearCache(): void {
		DocumentComplexityCalculator.nodeCache = new WeakMap();
	}
}
