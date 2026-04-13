// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css } from '@emotion/react';

export function getFadingCss({
	hasOverlay,
}: {
	hasOverlay: boolean;
}): import('@emotion/react').SerializedStyles {
	return css({
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
		opacity: hasOverlay ? 0 : 1,
		transition: 'opacity 0.3s',
	});
}
