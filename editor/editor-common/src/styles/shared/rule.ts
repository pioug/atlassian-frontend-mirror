// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css } from '@emotion/react';

import { akEditorLineHeight } from '@atlaskit/editor-shared-styles';
import { N30A } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

// @see typography spreadsheet: https://docs.google.com/spreadsheets/d/1iYusRGCT4PoPfvxbJ8NrgjtfFgXLm5lpDWXzjua1W2E/edit#gid=93913128
export const ruleSharedStyles = () =>
	css({
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
		'& hr': {
			border: 'none',
			backgroundColor: token('color.border', N30A),
			// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage/preview, @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
			margin: `${akEditorLineHeight}em 0`,
			height: '2px',
			borderRadius: '1px',
		},
	});
