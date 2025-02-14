import type { FloatingToolbarItem } from '../types';

export type Item = FloatingToolbarItem<Function>;
// Ignored via go/ees005
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function makeSameType<T>(_a: T, _b: any): _b is T {
	return true;
}

export const shallowEqual = (objA?: Object, objB?: Object) => {
	if (objA === objB) {
		return true;
	}
	if (objA == null || objB == null) {
		return false;
	}

	const keysA = Object.keys(objA);
	const keysB = Object.keys(objB);

	if (keysA.length !== keysB.length) {
		return false;
	}

	const bHasOwnProperty = Object.prototype.hasOwnProperty.bind(objB);

	for (let idx = 0; idx < keysA.length; idx++) {
		const key = keysA[idx];

		if (!bHasOwnProperty(key)) {
			return false;
		}

		// Ignored via go/ees005
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		if ((objA as any)[key] !== (objB as any)[key]) {
			return false;
		}
	}

	return true;
};

// Ignored via go/ees005
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const compareArrays = <T extends Array<any>>(
	left: Array<T>,
	right: Array<T>,
	compareFn: (left: T, right: T) => boolean = shallowEqual,
) => {
	if (left.length !== right.length) {
		return false;
	}

	for (let idx = 0; idx < left.length; idx++) {
		if (!compareFn(left[idx], right[idx])) {
			return false;
		}
	}

	return true;
};

const compareItemWithKeys = <T extends Object, U extends keyof T>(
	leftItem: T,
	rightItem: T,
	excludedKeys: Array<U> = [],
): boolean =>
	(Object.keys(leftItem) as Array<U>)
		.filter((key) => excludedKeys.indexOf(key) === -1)
		.every((key) =>
			leftItem[key] instanceof Object
				? // Ignored via go/ees005
					// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
					// Ignored via go/ees005
					// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
					shallowEqual(leftItem[key]!, rightItem[key]!)
				: leftItem[key] === rightItem[key],
		);

export const isSameItem = (leftItem: Item, rightItem: Item): boolean => {
	if (leftItem.type !== rightItem.type) {
		return false;
	}

	switch (leftItem.type) {
		case 'button':
			// Need to typecast `rightItem as typeof leftItem` otherwise we will
			// have to put the `type !==` inside each case.
			return compareItemWithKeys(leftItem, rightItem as typeof leftItem, [
				'type',
				'onClick',
				'onMouseEnter',
				'onMouseLeave',
			]);
		case 'copy-button':
			return compareItemWithKeys(leftItem, rightItem as typeof leftItem, ['type', 'items']);
		case 'input':
			return compareItemWithKeys(leftItem, rightItem as typeof leftItem, [
				'type',
				'onSubmit',
				'onBlur',
			]);
		case 'select':
			if (
				makeSameType(leftItem, rightItem) &&
				Array.isArray(leftItem.options) &&
				Array.isArray(rightItem.options) &&
				// Ignored via go/ees005
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				!compareArrays(leftItem.options as any, rightItem.options as any, (left, right) =>
					compareItemWithKeys(left, right),
				)
			) {
				return false;
			}
			return compareItemWithKeys(leftItem, rightItem as typeof leftItem, [
				'type',
				'onChange',
				'options',
			]);
		case 'overflow-dropdown':
		case 'dropdown':
			if (
				makeSameType(leftItem, rightItem) &&
				Array.isArray(leftItem.options) &&
				Array.isArray(rightItem.options) &&
				// @ts-expect-error TS2345: Argument of type 'DropdownOptionT<Function>[]' is not assignable to parameter of type 'any[][]'
				!compareArrays(leftItem.options, rightItem.options, (left, right) =>
					// @ts-expect-error  TS2322: Type '"onClick"' is not assignable to type 'keyof any[]'
					compareItemWithKeys(left, right, ['onClick']),
				)
			) {
				return false;
			}
			return compareItemWithKeys(leftItem, rightItem as typeof leftItem, ['type', 'options']);
		case 'custom':
			return false;
		case 'separator':
			return compareItemWithKeys(leftItem, rightItem as typeof leftItem);
		case 'extensions-placeholder':
			return compareItemWithKeys(leftItem, rightItem as typeof leftItem);
	}
};

export const areSameItems = (leftArr?: Array<Item>, rightArr?: Array<Item>): boolean => {
	if (leftArr === undefined && rightArr === undefined) {
		return true;
	}

	if (leftArr === undefined || rightArr === undefined) {
		return false;
	}

	if (leftArr.length !== rightArr.length) {
		return false;
	}

	return leftArr.every((item, index) => isSameItem(rightArr[index], item));
};

// eslint-disable-next-line @atlaskit/editor/no-re-export
export { default as messages } from './messages';
