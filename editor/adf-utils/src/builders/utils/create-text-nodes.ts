import { TextDefinition } from '@atlaskit/adf-schema';
import { text } from '../nodes/text';

export function createTextNodes<T = any>(
  nodes: Array<T | string>,
): Array<T | TextDefinition> {
  return nodes.map(createTextFromString);
}

export function createTextFromString<T = any>(
  str: T | string,
): T | TextDefinition {
  return typeof str === 'string' ? text(str) : str;
}
