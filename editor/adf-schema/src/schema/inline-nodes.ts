import * as nodes from './nodes';

const typedNodes: Record<string, any> = nodes;

export const inlineNodes = new Set(
  Object.keys(typedNodes).filter(
    (key) => typedNodes[key] && typedNodes[key].group === 'inline',
  ),
);
