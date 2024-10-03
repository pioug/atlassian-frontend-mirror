/* eslint-disable @atlaskit/design-system/use-tokens-space */
/* eslint-disable @atlaskit/design-system/use-tokens-typography */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css } from '@emotion/react';

import { token } from '@atlaskit/tokens';

// @see typography spreadsheet: https://docs.google.com/spreadsheets/d/1iYusRGCT4PoPfvxbJ8NrgjtfFgXLm5lpDWXzjua1W2E/edit#gid=93913128
// text sizing prototype: http://proto/fabricrender/
export const headingsSharedStyles = () =>
	css({
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
		'& h1': {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
			fontSize: `${24 / 14}em`,
			fontStyle: 'inherit',
			lineHeight: 28 / 24,
			color: token('color.text'),
			fontWeight: token('font.weight.medium'),
			letterSpacing: `-0.01em`,
			marginBottom: 0,
			marginTop: '1.667em',
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
		'& h2': {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
			fontSize: `${20 / 14}em`,
			fontStyle: 'inherit',
			lineHeight: 24 / 20,
			color: token('color.text'),
			fontWeight: token('font.weight.medium'),
			letterSpacing: `-0.008em`,
			marginTop: '1.8em',
			marginBottom: 0,
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
		'& h3': {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
			fontSize: `${16 / 14}em`,
			fontStyle: 'inherit',
			lineHeight: 20 / 16,
			color: token('color.text'),
			fontWeight: token('font.weight.semibold'),
			letterSpacing: `-0.006em`,
			marginTop: '2em',
			marginBottom: 0,
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
		'& h4': {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
			fontSize: `${14 / 14}em`,
			fontStyle: 'inherit',
			lineHeight: 16 / 14,
			color: token('color.text'),
			fontWeight: token('font.weight.semibold'),
			letterSpacing: `-0.003em`,
			marginTop: '1.357em',
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
		'& h5': {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
			fontSize: `${12 / 14}em`,
			fontStyle: 'inherit',
			lineHeight: 16 / 12,
			color: token('color.text'),
			fontWeight: token('font.weight.semibold'),
			marginTop: '1.667em',
			textTransform: 'none',
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
		'& h6': {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
			fontSize: `${11 / 14}em`,
			fontStyle: 'inherit',
			lineHeight: 16 / 11,
			color: token('color.text.subtlest'),
			fontWeight: token('font.weight.bold'),
			marginTop: '1.455em',
			textTransform: 'none',
		},
	});
