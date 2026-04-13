// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { type CSSObject } from '@emotion/react';

// This styling approach works by generating a 'style' and applying with maximum specificity
// To do this we are overwriting all pseudo selectors
export function getSpecifiers(styles: CSSObject): CSSObject {
	return {
		'&, &:hover, &:active, &:focus, &:focus-visible, &:visited, &:disabled, &[disabled]': styles,
	};
}
