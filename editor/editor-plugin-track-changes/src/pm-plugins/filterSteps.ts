import type { InvertableStep } from './invertableStep';
import { MAX_STEPS_FROM_BASELINE } from './maxSteps';

/**
 * Returns the filtered steps to ensure we don't track an entire document worth of changes
 */
export function filterSteps(
	steps: InvertableStep[],
	allocations: Set<number>,
): { steps: InvertableStep[]; allocations: Set<number> } {
	if (allocations.size <= MAX_STEPS_FROM_BASELINE) {
		return { steps, allocations };
	}

	// Create a new allocation, retaining only the most recent values
	const elements = Array.from(allocations);
	const newAllocation = new Set(elements.slice(-MAX_STEPS_FROM_BASELINE));

	const finalSteps: InvertableStep[] = [];
	let cutoffFound = false;

	for (const step of steps) {
		if (newAllocation.has(step.allocation)) {
			cutoffFound = true;
		}
		// Accept everything after this point otherwise we could have mis-ordered steps
		if (cutoffFound) {
			finalSteps.push(step);
		}
	}

	return {
		steps: finalSteps,
		allocations: newAllocation,
	};
}
