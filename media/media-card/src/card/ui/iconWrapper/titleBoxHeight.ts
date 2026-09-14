import { type Breakpoint, getTitleBoxHeight } from '../common';

export function titleBoxHeight(hasTitleBox: boolean, breakpoint: Breakpoint): string {
	// there is no titlebox
	if (!hasTitleBox) {
		return `0px`;
	}

	// calculate height of the titlebox
	const marginBottom = getTitleBoxHeight(breakpoint);

	return `${marginBottom}px`;
}
