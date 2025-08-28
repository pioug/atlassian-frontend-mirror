// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled
import { css, type SerializedStyles } from '@emotion/react';

import { token } from '@atlaskit/tokens';

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles
export const codeMarkStyles: SerializedStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'.code': {
		'--ds--code--bg-color': token('color.background.neutral'),
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
		display: 'inline',
		padding: '2px 0.5ch',
		backgroundColor: `var(--ds--code--bg-color,${token('color.background.neutral')})`,
		borderRadius: token('border.radius', '3px'),
		borderStyle: 'none',
		boxDecorationBreak: 'clone',
		color: token('color.text'),
		fontFamily: token('font.family.code'),
		// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
		fontSize: '0.875em',
		fontWeight: token('font.weight.regular'),
		overflow: 'auto',
		overflowWrap: 'break-word',
		whiteSpace: 'pre-wrap',
	},
});
