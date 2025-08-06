import getComponentName from './get-component-name';

// Helper to check fiber within component
export default function checkFiberWithinComponent(
	fiber: any,
	targetComponentName: string,
	maxLevel: number,
): boolean {
	// Stop when no more levels to traverse
	if (maxLevel <= 0) {
		return false;
	}
	if (!fiber) {
		return false;
	}
	const componentName = getComponentName(fiber);
	if (componentName === targetComponentName) {
		return true;
	}

	// Recursively traverse up the fiber tree
	return checkFiberWithinComponent(fiber.return, targetComponentName, maxLevel - 1);
}
