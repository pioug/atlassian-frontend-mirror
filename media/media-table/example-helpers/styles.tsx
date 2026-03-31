import { token } from '@atlaskit/tokens';
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, type SerializedStyles } from '@emotion/react';

export const ROW_HIGHLIGHT_CLASSNAME = 'media-table-row-highlighted';
export const ROW_CLASSNAME = 'media-table-row';

// eslint-disable-next-line @atlaskit/design-system/no-css-tagged-template-expression, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const exampleWrapperStyles: SerializedStyles = css`
	display: flex;
	flex-direction: column;
	align-items: center;

	.${ROW_HIGHLIGHT_CLASSNAME} {
		background-color: ${token('color.background.warning')};

		&:hover {
			background-color: ${token('color.background.warning.hovered')};
		}
	}
`;

// eslint-disable-next-line @atlaskit/design-system/no-css-tagged-template-expression, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const greenOnHoverStyles: SerializedStyles = css`
	background-color: ${token('color.background.danger.bold')};
	height: 8px;
	width: 8px;

	.${ROW_CLASSNAME}:hover & {
		background-color: ${token('color.background.success.bold.hovered')};
	}
`;
