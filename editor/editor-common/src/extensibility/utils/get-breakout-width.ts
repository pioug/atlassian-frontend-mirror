import type { Mark } from '@atlaskit/editor-prosemirror/model';

/** returns the breakout width if the node has a breakout mark with a positive breakout width. */
export const getBreakoutWidth = (marks?: readonly Mark[]): number | undefined => {
	for (const mark of marks ?? []) {
		if (
			mark.type.name === 'breakout' &&
			typeof mark.attrs.width === 'number' &&
			mark.attrs.width > 0
		) {
			return mark.attrs.width;
		}
	}
	return undefined;
};
