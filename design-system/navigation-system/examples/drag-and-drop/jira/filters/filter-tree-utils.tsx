import type { TFilter } from '../data';

function hasChildren(item: TFilter): boolean {
	return item.children.length > 0;
}

function remove(data: TFilter[], filterId: string): TFilter[] {
	return data
		.filter((item) => item.id !== filterId)
		.map((item) => {
			if (hasChildren(item)) {
				return {
					...item,
					children: remove(item.children, filterId),
				};
			}
			return item;
		});
}

function insertBefore(data: TFilter[], targetId: string, newItem: TFilter): TFilter[] {
	return data.flatMap((filter) => {
		if (filter.id === targetId) {
			return [newItem, filter];
		}
		if (hasChildren(filter)) {
			return {
				...filter,
				children: insertBefore(filter.children, targetId, newItem),
			};
		}
		return filter;
	});
}

function insertChild(data: TFilter[], targetId: string, newItem: TFilter): TFilter[] {
	return data.flatMap((item) => {
		if (item.id === targetId) {
			// already a parent: add as first child
			return {
				...item,
				// opening item so you can see where item landed
				isOpen: true,
				children: [newItem, ...item.children],
			};
		}

		if (!hasChildren(item)) {
			return item;
		}

		return {
			...item,
			children: insertChild(item.children, targetId, newItem),
		};
	});
}

function insertAfter(data: TFilter[], targetId: string, newItem: TFilter): TFilter[] {
	return data.flatMap((item) => {
		if (item.id === targetId) {
			return [item, newItem];
		}

		if (hasChildren(item)) {
			return {
				...item,
				children: insertAfter(item.children, targetId, newItem),
			};
		}

		return item;
	});
}

export function find(data: TFilter[], filterId: string): TFilter | undefined {
	for (const item of data) {
		if (item.id === filterId) {
			return item;
		}

		if (hasChildren(item)) {
			const result = find(item.children, filterId);
			if (result) {
				return result;
			}
		}
	}
}

export function getPathToFilter(
	data: TFilter[],
	filterId: string,
	path: string[] = [],
): string[] | null {
	for (const item of data) {
		if (item.id === filterId) {
			return path;
		}
		const nested = getPathToFilter(item.children, filterId, [...path, item.id]);
		if (nested) {
			return nested;
		}
	}
	return null;
}

export function tree(filters: TFilter[]) {
	let result = Array.from(filters);

	const api = {
		remove(filterId: string) {
			result = remove(result, filterId);
			return this;
		},
		insertBefore({ insert, targetId }: { insert: TFilter; targetId: string }) {
			result = insertBefore(result, targetId, insert);
			return this;
		},
		insertAfter({ insert, targetId }: { insert: TFilter; targetId: string }) {
			result = insertAfter(result, targetId, insert);
			return this;
		},
		insertChild({ insert, targetId }: { insert: TFilter; targetId: string }) {
			result = insertChild(result, targetId, insert);
			return this;
		},
		build() {
			return result;
		},
	};

	return api;
}
