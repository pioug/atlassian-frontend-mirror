import { DocumentComplexityCalculator } from './calculator';
import type { AdfNode, ComplexityResult } from './types';

/**
 *
 */
export function calculateADFComplexity(
	doc: AdfNode,
	options?: {
		calculateNodePaths: boolean;
	},
	useWebWorker: boolean = false,
): Promise<ComplexityResult> {
	const calc = new DocumentComplexityCalculator();

	return calc.calculateTreeWeight(doc, { debug: options?.calculateNodePaths, useWebWorker });
}
