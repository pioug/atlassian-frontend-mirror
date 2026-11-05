import type { Mark } from '@atlaskit/editor-prosemirror/model';

import { getBreakoutWidth } from './get-breakout-width';

/** returns true if the node has a breakout mark with a positive breakout width. */
export const hasBreakoutWidth = (marks?: readonly Mark[]): boolean =>
	getBreakoutWidth(marks) !== undefined;
