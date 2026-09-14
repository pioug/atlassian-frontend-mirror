import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';

// array = [
//   [A1, B1, C1, null],
//   [A2, B2, null, D1],
//   [A3. B3, C2, null],
// ]
export type ArrayOfRows = Array<PMNode | null>[];
