/* eslint-disable @atlaskit/ui-styling-standard/no-exported-styles */
/* eslint-disable @atlaskit/design-system/use-tokens-typography */
/* eslint-disable @atlaskit/ui-styling-standard/no-unsafe-values */
/* eslint-disable @atlaskit/ui-styling-standard/no-imported-style-values */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css } from '@emotion/react';

import { akEditorLineHeight, blockNodesVerticalMargin } from '@atlaskit/editor-shared-styles';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/experiments';

import editorUGCToken from '../../ugc-tokens/get-editor-ugc-token';

// @see typography spreadsheet: https://docs.google.com/spreadsheets/d/1iYusRGCT4PoPfvxbJ8NrgjtfFgXLm5lpDWXzjua1W2E/edit#gid=93913128
export const paragraphSharedStyles = (
	typographyTheme?:
		| 'typography'
		| 'typography-adg3'
		| 'typography-modernized'
		| 'typography-refreshed',
) => {
	return editorExperiment('typography_migration_ugc', true)
		? css({
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
				'& p': {
					font: editorUGCToken('editor.font.body', typographyTheme),
					marginTop: blockNodesVerticalMargin,
					marginBottom: 0,
				},
			})
		: css({
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
				'& p': {
					fontSize: '1em',
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
					lineHeight: akEditorLineHeight,
					fontWeight: 'normal',
					marginTop: blockNodesVerticalMargin,
					marginBottom: 0,
					letterSpacing: '-0.005em',
				},
			});
};
