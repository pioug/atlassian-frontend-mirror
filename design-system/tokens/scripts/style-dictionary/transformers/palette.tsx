import type { Transform } from 'style-dictionary';

import type {
	DeprecatedTypographyToken,
	OpacityToken,
	PaintToken,
	RawToken,
	ShadowToken,
	ShapeToken,
	SpacingToken,
	TypographyToken,
} from '../../../src/types';
import { getTokenId } from '../../../src/utils/token-ids';

function isHex(hex: string) {
	return /[0-9A-Fa-f]{6}/g.test(hex);
}

const transform = (palette: Record<string, any>): Transform => {
	return {
		type: 'value',
		matcher: (token) => {
			return !!token.attributes && token.attributes.group !== 'palette';
		},
		transformer: (token) => {
			const originalToken = token.original as
				| PaintToken<any>
				| ShadowToken<any>
				| SpacingToken<any>
				| ShapeToken<any>
				| TypographyToken<any>
				| DeprecatedTypographyToken<any>
				| OpacityToken
				| RawToken;

			if (!originalToken) {
				return token.value;
			}

			if (
				originalToken.attributes.group === 'paint' &&
				!palette.color.palette[originalToken.value]
			) {
				const value = originalToken.value as string;

				if (isHex(value)) {
					return value;
				}

				if (value === 'transparent') {
					return '#00000000';
				}

				throw new Error(
					`Invalid color format "${value}" provided to token: "${getTokenId(
						token.path,
					)}". Please use either a base token, hexadecimal or "transparent"`,
				);
			}

			if (originalToken.attributes.group === 'paint') {
				const value = originalToken.value;
				return palette.color.palette[value].value;
			}

			if (originalToken.attributes.group === 'raw') {
				return originalToken.value as RawToken['value'];
			}

			if (originalToken.attributes.group === 'shadow') {
				const values = originalToken.value as ShadowToken<any>['value'];

				return values.map((value) => {
					const color = isHex(value.color) ? value.color : palette.color.palette[value.color].value;

					return {
						...value,
						color,
					};
				});
			}

			if (originalToken.attributes.group === 'opacity') {
				const value = originalToken.value as OpacityToken['value'];
				return palette.value.opacity[value].value;
			}

			if (originalToken.attributes.group === 'spacing') {
				const value = originalToken.value;
				return palette.space[value].value;
			}

			if (originalToken.attributes.group === 'shape') {
				const value = originalToken.value;
				return palette.border.radius[value]?.value || palette.border.width[value]?.value;
			}

			if (originalToken.attributes.group === 'typography') {
				const { fontSize, fontStyle, fontWeight, lineHeight, fontFamily, letterSpacing } =
					originalToken.value;
				return {
					fontSize: palette.typography.fontSize[fontSize].value,
					// this is not actually a token atm
					fontStyle: fontStyle,
					fontWeight: palette.typography.fontWeight[fontWeight].value,
					lineHeight: palette.typography.lineHeight[lineHeight].value,
					fontFamily: palette.typography.fontFamily[fontFamily].value,
					letterSpacing: palette.typography.letterSpacing[letterSpacing].value,
				};
			}

			if (originalToken.attributes.group === 'fontSize') {
				const value = originalToken.value;
				return palette.typography.fontSize[value].value;
			}

			if (originalToken.attributes.group === 'fontWeight') {
				const value = originalToken.value;
				return palette.typography.fontWeight[value].value;
			}

			if (originalToken.attributes.group === 'fontFamily') {
				const value = originalToken.value;
				return palette.typography.fontFamily[value].value;
			}

			if (originalToken.attributes.group === 'lineHeight') {
				const value = originalToken.value;
				return palette.typography.lineHeight[value].value;
			}

			if (originalToken.attributes.group === 'letterSpacing') {
				const value = originalToken.value;
				return palette.typography.letterSpacing[value].value;
			}
		},
	};
};

export default transform;
