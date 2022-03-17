import React from 'react';

type ChangedData<T> = {
  key: keyof T;
  difference?: any;
  maxDepthReached?: boolean;
  newValue?: any;
  oldValue?: any;
  reactElementChanged?: boolean;
};
type Changed<T> = Array<ChangedData<T>>;

export type PropsDifference<T> = {
  removed: Array<keyof T>;
  added: Array<keyof T>;
  changed: Changed<T>;
};

export type ShallowPropsDifference<T> = {
  removed: Array<keyof T>;
  added: Array<keyof T>;
  changed: Array<keyof T>;
};

export const getKeys = Object.keys as <T>(obj: T) => Array<keyof T>;

export const getKeysAddedRemovedCommon = <T>(object1: T, object2: T) => {
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

export const serializeValue = <T>(value: T[keyof T]) => {
  const valueType = typeof value;
  if (value === null) {
    return 'null';
  } else if (value === undefined) {
    return 'undefined';
  } else if (valueType === 'string' || valueType === 'number') {
    return value;
  } else if (valueType === 'symbol') {
    return ((value as unknown) as symbol).toString();
  }
  // Calling toString of function returns whole function text with body.
  // So, just return function with name.
  else if (valueType === 'function') {
    return `function:${((value as unknown) as Function).name}`;
  } else if (valueType === 'object') {
    return {
      type: 'object',
      keys: Object.keys(value),
    };
  }
};

export const getPropsDifference = <T>(
  object1: T,
  object2: T,
  curDepth: number = 0,
  maxDepth: number = 2,
  keysToIgnore: Array<keyof T> = [],
): PropsDifference<T> => {
  const { added, common, removed } = getKeysAddedRemovedCommon(
    object1,
    object2,
  );

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
          const difference = getPropsDifference(
            value1,
            value2,
            curDepth + 1,
            maxDepth,
          );
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

export const getShallowPropsDifference = <T>(
  object1: T,
  object2: T,
): ShallowPropsDifference<T> => {
  const { added, common, removed } = getKeysAddedRemovedCommon(
    object1,
    object2,
  );

  const changed = common.filter((key) => object1[key] !== object2[key]);

  return {
    added,
    changed,
    removed,
  };
};
