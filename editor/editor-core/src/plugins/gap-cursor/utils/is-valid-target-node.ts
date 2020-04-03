import { Node as PMNode } from 'prosemirror-model';
import { isIgnored } from './is-ignored';

export const isValidTargetNode = (node?: PMNode | null): boolean => {
  return !!node && !isIgnored(node);
};
