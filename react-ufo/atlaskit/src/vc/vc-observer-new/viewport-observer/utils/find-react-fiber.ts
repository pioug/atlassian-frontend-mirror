// Helper function to find React fiber on an element
export default function findReactFiber(element: HTMLElement) {
	// Use for...in loop instead of Object.keys().find() to avoid creating an array
	for (const key in element) {
		if (key.startsWith('__reactFiber$') || key.startsWith('__reactInternalInstance$')) {
			return (element as any)[key];
		}
	}
	return null;
}
