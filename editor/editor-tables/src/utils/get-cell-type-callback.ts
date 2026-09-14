import type { NodeType } from '@atlaskit/editor-prosemirror/model';

import type { GetCellTypeArgs } from './split-cell-with-type';

export type GetCellTypeCallback = (option: GetCellTypeArgs) => NodeType;
