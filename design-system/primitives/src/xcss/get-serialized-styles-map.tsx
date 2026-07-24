// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, type SerializedStyles } from '@emotion/react';

import { type CURRENT_SURFACE_CSS_VAR } from '@atlaskit/tokens/constants';

import type { SpacingProperty } from './create-spacing-styles-map';

type TokenMappableProperty =
	| SpacingProperty
	| 'backgroundColor'
	| 'fontWeight'
	| 'fontSize'
	| 'fontFamily'
	| 'lineHeight'
	| 'color'
	| 'font'
	| typeof CURRENT_SURFACE_CSS_VAR;

export const getSerializedStylesMap = <Token extends string>(
	cssProperty: TokenMappableProperty,
	tokenMap: Record<Token, string>,
): Record<Token, SerializedStyles> => {
	return (Object.keys(tokenMap) as Token[]).reduce(
		(emotionSpacingMap, tokenName) => {
			// eslint-disable-next-line @repo/internal/styles/no-exported-styles
			emotionSpacingMap[tokenName] = css({
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
				[cssProperty]: tokenMap[tokenName],
			});

			return emotionSpacingMap;
		},
		{} as Record<Token, SerializedStyles>,
	);
};
