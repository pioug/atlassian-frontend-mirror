// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css } from '@emotion/react';

import { TaskDecisionSharedCssClassName } from '@atlaskit/editor-common/styles';
import {
	akEditorDeleteBackgroundWithOpacity,
	akEditorDeleteBorder,
	akEditorSelectedBorderSize,
	akEditorSelectedNodeClassName,
	getSelectionStyles,
	SelectionStyle,
} from '@atlaskit/editor-shared-styles';
import { token } from '@atlaskit/tokens';

// eslint-disable-next-line @atlaskit/design-system/no-css-tagged-template-expression, @atlaskit/design-system/no-exported-css, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const taskDecisionStyles = css`
	[data-decision-wrapper] {
		cursor: pointer;
	}

	.${akEditorSelectedNodeClassName} > [data-decision-wrapper],
	ol[data-node-type='decisionList'].${akEditorSelectedNodeClassName} {
		border-radius: 4px;
		${getSelectionStyles([SelectionStyle.BoxShadow, SelectionStyle.Blanket])}
	}

	.danger {
		.${TaskDecisionSharedCssClassName.DECISION_CONTAINER}.${akEditorSelectedNodeClassName} > div {
			box-shadow: 0 0 0 ${akEditorSelectedBorderSize}px
				${token('color.border.danger', akEditorDeleteBorder)};
			background-color: ${token('color.blanket.danger', akEditorDeleteBackgroundWithOpacity)};
			&::after {
				content: none; /* reset the Blanket selection style */
			}
		}
	}
`;
