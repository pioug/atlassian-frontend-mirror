import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';

import { validNode } from './validNode';

/** Validates prosemirror nodes, and returns true only if all nodes are valid */
export const validateNodes = (nodes: PMNode[]): boolean => nodes.every(validNode);
