import { css } from '@emotion/react';

export const DateSharedCssClassName = {
	DATE_WRAPPER: `date-lozenger-container`,
	DATE_CONTAINER: 'dateView-content-wrap',
};

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles, @atlaskit/design-system/no-exported-css -- Ignored via go/DSP-18766
export const dateSharedStyle = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	[`.${DateSharedCssClassName.DATE_WRAPPER} span`]: {
		whiteSpace: 'unset',
	},
});
