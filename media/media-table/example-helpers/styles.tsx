import { token } from '@atlaskit/tokens';
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css } from '@emotion/react';
// AFP-2532 TODO: Fix automatic suppressions below
// eslint-disable-next-line @atlassian/tangerine/import/entry-points
import { colors } from '@atlaskit/theme';

export const ROW_HIGHLIGHT_CLASSNAME = 'media-table-row-highlighted';
export const ROW_CLASSNAME = 'media-table-row';

// eslint-disable-next-line @atlaskit/design-system/no-css-tagged-template-expression, @atlaskit/ui-styling-standard/no-exported-styles, @atlaskit/design-system/no-exported-css -- Ignored via go/DSP-18766
export const exampleWrapperStyles = css`
	display: flex;
	flex-direction: column;
	align-items: center;

	.${ROW_HIGHLIGHT_CLASSNAME} {
		background-color: ${token('color.background.warning', colors.Y50)};

		&:hover {
			background-color: ${token('color.background.warning.hovered', colors.Y75)};
		}
	}
`;

// eslint-disable-next-line @atlaskit/design-system/no-css-tagged-template-expression, @atlaskit/ui-styling-standard/no-exported-styles, @atlaskit/design-system/no-exported-css -- Ignored via go/DSP-18766
export const greenOnHoverStyles = css`
	background-color: ${token('color.background.danger.bold', 'red')};
	height: 8px;
	width: 8px;

	.${ROW_CLASSNAME}:hover & {
		background-color: ${token('color.background.success.bold.hovered', 'green')};
	}
`;
