/* eslint-disable @atlaskit/design-system/use-tokens-space */
import { css } from '@emotion/react';

import { h100, h300, h400, h500, h600, h700 } from '@atlaskit/theme/typography';

// @see typography spreadsheet: https://docs.google.com/spreadsheets/d/1iYusRGCT4PoPfvxbJ8NrgjtfFgXLm5lpDWXzjua1W2E/edit#gid=93913128
// text sizing prototype: http://proto/fabricrender/
export const headingsSharedStyles = () =>
	css({
		'& h1': {
			...h700(),
			marginBottom: 0,
			marginTop: '1.667em',
		},
		'& h2': {
			...h600(),
			marginTop: '1.8em',
			marginBottom: 0,
		},
		'& h3': {
			...h500(),
			marginTop: '2em',
			marginBottom: 0,
		},
		'& h4': {
			...h400(),
			marginTop: '1.357em',
		},
		'& h5': {
			...h300(),
			marginTop: '1.667em',
			textTransform: 'none',
		},
		'& h6': {
			...h100(),
			marginTop: '1.455em',
			textTransform: 'none',
		},
	});
