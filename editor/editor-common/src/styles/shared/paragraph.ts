import { css } from '@emotion/react';

import { akEditorLineHeight, blockNodesVerticalMargin } from '@atlaskit/editor-shared-styles';

// @see typography spreadsheet: https://docs.google.com/spreadsheets/d/1iYusRGCT4PoPfvxbJ8NrgjtfFgXLm5lpDWXzjua1W2E/edit#gid=93913128
export const paragraphSharedStyles = css({
	'& p': {
		fontSize: '1em',
		lineHeight: akEditorLineHeight,
		fontWeight: 'normal',
		// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage/preview
		marginTop: blockNodesVerticalMargin,
		marginBottom: 0,
		letterSpacing: '-0.005em',
	},
});
