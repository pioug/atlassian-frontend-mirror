import { isNodeOfType, Property, SpreadElement } from 'eslint-codemod-utils';

import { blockedEventNameLookup } from './blocked';

export function isBlockedEventBinding(
  property: Property | SpreadElement,
): boolean {
  if (!isNodeOfType(property, 'Property')) {
    return false;
  }

  // are we looking at the "type" property?

  const key = property.key;
  if (!isNodeOfType(key, 'Identifier')) {
    return false;
  }

  if (key.name !== 'type') {
    return false;
  }

  // is the "type" property value blocked?

  const value = property.value;
  if (!isNodeOfType(value, 'Literal')) {
    return false;
  }

  return (
    typeof value.value === 'string' && blockedEventNameLookup.has(value.value)
  );
}
