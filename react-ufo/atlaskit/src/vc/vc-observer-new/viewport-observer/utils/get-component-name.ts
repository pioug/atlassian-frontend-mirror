// Helper function to extract component name from fiber
export default function getComponentName(fiber: any): string | undefined {
	const type = fiber?.type;
	if (!type) {
		return undefined;
	}

	if (typeof type === 'function' || typeof type === 'object') {
		return type.displayName || type.name;
	}

	return undefined;
}
