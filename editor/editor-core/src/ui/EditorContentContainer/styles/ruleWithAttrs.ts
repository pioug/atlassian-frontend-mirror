/* eslint-disable @atlaskit/design-system/use-tokens-shape,
	@repo/internal/deprecations/deprecation-ticket-required,
	@atlaskit/ui-styling-standard/no-exported-styles */
/* eslint-disable @atlaskit/ui-styling-standard/use-compiled */
import { css } from '@emotion/react';
import type { SerializedStyles } from '@emotion/react';

import { token } from '@atlaskit/tokens';

const dashedStrokeMask =
	'linear-gradient(to right, black 0, black 4px, transparent 4px, transparent 10px)';
const dottedStrokeMask = 'radial-gradient(circle at center, black 1px, transparent 1.1px)';
const sketchStrokePath = 'M0 5C3 2 3 2 6 5C9 8 9 8 12 5C15 2 15 2 18 5C21 8 21 8 24 5';
const sketchStrokeMask = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 10'%3E%3Cpath fill='none' stroke='%23000' stroke-width='2' d='${sketchStrokePath}'/%3E%3C/svg%3E")`;
const fadeStrokeMask =
	'linear-gradient(to right, transparent 0%, black 27.4%, black 74%, transparent 100%)';

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles
export const ruleWithAttrsStyles: SerializedStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'.ProseMirror hr[data-style="dashed"]': {
		maskImage: dashedStrokeMask,
		maskRepeat: 'repeat-x',
		maskSize: '10px 100%',
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'.ProseMirror hr[data-style="dotted"]': {
		maskImage: dottedStrokeMask,
		maskPosition: 'center',
		maskRepeat: 'repeat-x',
		maskSize: '6px 2px',
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'.ProseMirror hr[data-style="sketch"]': {
		height: `calc(2px + ${token('space.050')} + ${token('space.050')})`,
		maskImage: sketchStrokeMask,
		maskPosition: 'center',
		maskRepeat: 'repeat-x',
		maskSize: '24px 10px',
		paddingTop: 0,
		paddingBottom: 0,
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'.ProseMirror hr[data-style="fade"]': {
		maskImage: fadeStrokeMask,
		maskRepeat: 'no-repeat',
		maskSize: '100% 100%',
	},
});
