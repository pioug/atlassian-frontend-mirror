// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled
import { css, type SerializedStyles } from '@emotion/react';

import { token } from '@atlaskit/tokens';

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles
export const overflowShadowStyles: SerializedStyles = css({
	backgroundImage: `
		linear-gradient(
			to right,
			${token('color.background.neutral')} ${token('space.300')},
			transparent ${token('space.300')}
		),
		linear-gradient(
			to right,
			${token('elevation.surface.raised')} ${token('space.300')},
			transparent ${token('space.300')}
		),
		linear-gradient(
			to left,
			${token('color.background.neutral')} ${token('space.100')},
			transparent ${token('space.100')}
		),
		linear-gradient(
			to left,
			${token('elevation.surface.raised')} ${token('space.100')},
			transparent ${token('space.100')}
		),
		linear-gradient(
			to left,
			${token('elevation.shadow.overflow.spread')} 0,
			${token('utility.UNSAFE.transparent')}  ${token('space.100')}
		),
		linear-gradient(
			to left,
			${token('elevation.shadow.overflow.perimeter')} 0,
			${token('utility.UNSAFE.transparent')}  ${token('space.100')}
		),
		linear-gradient(
			to right,
			${token('elevation.shadow.overflow.spread')} 0,
			${token('utility.UNSAFE.transparent')}  ${token('space.100')}
		),
		linear-gradient(
			to right,
			${token('elevation.shadow.overflow.perimeter')} 0,
			${token('utility.UNSAFE.transparent')}  ${token('space.100')}
		)
	`,
});
