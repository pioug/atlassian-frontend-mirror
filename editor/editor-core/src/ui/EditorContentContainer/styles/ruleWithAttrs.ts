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
const sketchStrokePath =
	'M0.00161171 1.0107C6.6387 1 9.94061 5.16958 16.6371 5.16958C23.3336 5.16958 26.5761 1.00913 33.2726 1.0107C39.3797 1.01213 42.4198 4.22998 48.5219 4.47643C55.9487 4.77638 59.8075 0.780687 67.2368 1.0107C73.6051 1.20786 76.8081 4.42122 83.1792 4.47643C89.815 4.53393 93.1788 1.06378 99.8147 1.0107C106.716 0.95549 110.244 4.6564 117.143 4.47643C123.248 4.31717 126.289 1.21517 132.393 1.0107C139.555 0.770735 143.25 4.64894 150.414 4.47643C156.784 4.32307 159.986 1.06591 166.357 1.0107C172.993 0.953195 176.356 4.47655 182.992 4.47643C189.628 4.47632 192.992 1.01007 199.628 1.01007C206.264 1.01007 209.627 4.47632 216.263 4.47643C222.899 4.47655 226.263 1.0107 232.899 1.0107';
const sketchStrokeMask = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 233 7'%3E%3Cpath fill='none' stroke='%23000' stroke-width='2' d='${sketchStrokePath}'/%3E%3C/svg%3E")`;
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
		maskSize: '233px 7px',
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
