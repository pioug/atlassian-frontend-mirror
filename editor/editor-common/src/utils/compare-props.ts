import React from 'react';

import { getKeys } from './getKeys';
import { serializeValue } from './serializeValue';
type ChangedData<T> = {
	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	difference?: any;
	key: keyof T;
	maxDepthReached?: boolean;
	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	newValue?: any;
	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	oldValue?: any;
	reactElementChanged?: boolean;
};
type Changed<T> = Array<ChangedData<T>>;

export type PropsDifference<T> = {
	added: Array<keyof T>;
	changed: Changed<T>;
	removed: Array<keyof T>;
};

export type ShallowPropsDifference<T> = {
	added: Array<keyof T>;
	changed: Array<keyof T>;
	removed: Array<keyof T>;
};


export const getKeysAddedRemovedCommon = <T>(
	object1: T,
	object2: T,
): {
	added: (keyof T & keyof (T & {}))[];
	common: (keyof T & keyof (T & {}))[];
	removed: (keyof T & keyof (T & {}))[];
} => {
	const oldKeys = object1 !== null ? getKeys(object1) : [];
	const newKeys = object2 !== null ? getKeys(object2) : [];

	const removed = oldKeys.filter((key) => !newKeys.includes(key));
	const added = newKeys.filter((key) => !oldKeys.includes(key));
	const common = oldKeys.filter((key) => newKeys.includes(key));

	return {
		added,
		common,
		removed,
	};
};


// eslint-disable-next-line @atlaskit/volt-strict-mode/no-multiple-exports
export const getPropsDifference = <T>(
	object1: T,
	object2: T,
	curDepth: number = 0,
	maxDepth: number = 2,
	keysToIgnore: Array<keyof T> = [],
): PropsDifference<T> => {
	const { added, common, removed } = getKeysAddedRemovedCommon(object1, object2);

	const changed = [] as Changed<T>;
	common.forEach((key) => {
		const value1 = object1[key];
		const value2 = object2[key];
		const value1Type = typeof value1;
		const value2Type = typeof value2;

		// Do comparision only if values doesn't match (or reference to same object in memory).
		// Or if key does not exist in keys to ignore.
		if (value1 !== value2 && keysToIgnore.indexOf(key) === -1) {
			// if both key value are objects and not referencing same object in memory.
			//  then get recursive difference.
			if (React.isValidElement(value1) || React.isValidElement(value2)) {
				changed.push({
					key,
					reactElementChanged: true,
				});
			} else if (value1Type === 'object' && value2Type === 'object') {
				if (curDepth <= maxDepth) {
					const difference = getPropsDifference(value1, value2, curDepth + 1, maxDepth);
					changed.push({
						key,
						difference,
					});
				} else {
					changed.push({
						key,
						maxDepthReached: true,
					});
				}
			} else {
				changed.push({
					key,
					oldValue: serializeValue(value1),
					newValue: serializeValue(value2),
				});
			}
		}
	});

	return {
		added,
		changed,
		removed,
	};
};

// eslint-disable-next-line @atlaskit/volt-strict-mode/no-multiple-exports
export const getShallowPropsDifference = <T>(object1: T, object2: T): ShallowPropsDifference<T> => {
	const { added, common, removed } = getKeysAddedRemovedCommon(object1, object2);

	const changed = common.filter((key) => object1[key] !== object2[key]);

	return {
		added,
		changed,
		removed,
	};
};
// eslint-disable-next-line @atlaskit/editor/no-re-export
export { getKeys } from './getKeys';
// eslint-disable-next-line @atlaskit/editor/no-re-export
export { serializeValue } from './serializeValue';
