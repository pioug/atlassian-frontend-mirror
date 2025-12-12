// eslint-disable-next-line import/no-namespace
import * as nodes from './nodes';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const typedNodes: Record<string, any> = nodes;

export const inlineNodes = new Set(
	Object.keys(typedNodes).filter((key) => typedNodes[key] && typedNodes[key].group === 'inline'),
);
