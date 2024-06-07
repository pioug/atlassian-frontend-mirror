import invariant from 'tiny-invariant';

export function getItem(container: HTMLElement, itemId: string) {
	const item: HTMLElement | null = container.querySelector(`[data-testid="item-${itemId}"]`);
	if (item == null) {
		throw new Error(`Could not find item ${itemId}`);
	}
	return item;
}

export function getColumn(container: HTMLElement, columnId: string) {
	const element: HTMLElement | null = container.querySelector(`[data-testid="column-${columnId}"]`);
	const dragHandle: HTMLElement | null = container.querySelector(
		`[data-testid="column-${columnId}--header"]`,
	);
	invariant(element, `Cannot find element for column ${columnId}`);
	invariant(dragHandle, `Cannot find dragHandle for column ${columnId}`);
	return { element, dragHandle };
}

export function getColumnItems(container: HTMLElement, columnId: string): Element[] {
	const element: HTMLElement | null = container.querySelector(
		`[data-testid="column-${columnId}--item-list"]`,
	);
	invariant(element, `Cannot find item list element for column ${columnId}`);

	return Array.from(element.children);
}

export function getColumnOrder(container: HTMLElement): string[] {
	const board = container.querySelector('[data-testid="board"]');
	invariant(board, 'Cannot find board');

	return Array.from(board.children, (element) => {
		const testId = element.getAttribute('data-testid');
		invariant(testId, 'Immediate child of board should be a column and have a test id');
		return testId;
	});
}
