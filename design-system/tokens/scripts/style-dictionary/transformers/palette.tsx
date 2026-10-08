import type { Transform } from 'style-dictionary';

import type {
	DeprecatedTypographyToken,
	MotionToken,
	OpacityToken,
	PaintToken,
	RawToken,
	ShadowToken,
	ShapeToken,
	SpacingToken,
	TypographyToken,
} from '../../../src/types';
import { getTokenId } from '../../../src/utils/get-token-id';

function isHex(hex: string) {
	return /[0-9A-Fa-f]{6}/g.test(hex);
}

/**
 * Custom themes (e.g. `UNSAFE-dynamic`, `UNSAFE-typography`) derive token values from runtime
 * input variables using CSS functions. These expressions are passed through untouched.
 */
function isCssExpression(value: unknown): value is string {
	return typeof value === 'string' && /^(var|oklch|calc)\(/.test(value);
}

/**
 * Resolves a palette key to its value, passing custom theme CSS expressions through.
 */
function resolvePaletteValue(group: Record<string, { value: any }>, value: any) {
	if (isCssExpression(value) && !group[value]) {
		return value;
	}

	return group[value].value;
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
				| MotionToken<any>
				| OpacityToken
				| RawToken;

			if (!originalToken) {
				return token.value;
			}

			if (!originalToken.attributes) {
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

				if (isCssExpression(value)) {
					return value;
				}

				throw new Error(
					`Invalid color format "${value}" provided to token: "${getTokenId(token.path)}". Please use either a base token, hexadecimal or "transparent"`,
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
					const color = isHex(value.color)
						? value.color
						: resolvePaletteValue(palette.color.palette, value.color);

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
				return palette.radius[value]?.value || palette.border.width[value]?.value;
			}

			if (originalToken.attributes.group === 'typography') {
				const { fontSize, fontStyle, fontWeight, lineHeight, fontFamily, letterSpacing } =
					originalToken.value;
				return {
					fontSize: resolvePaletteValue(palette.typography.fontSize, fontSize),
					// this is not actually a token atm
					fontStyle: fontStyle,
					fontWeight: palette.typography.fontWeight[fontWeight].value,
					lineHeight: resolvePaletteValue(palette.typography.lineHeight, lineHeight),
					fontFamily: resolvePaletteValue(palette.typography.fontFamily, fontFamily),
					letterSpacing: palette.typography.letterSpacing[letterSpacing].value,
				};
			}

			if (originalToken.attributes.group === 'fontSize') {
				const value = originalToken.value;
				return resolvePaletteValue(palette.typography.fontSize, value);
			}

			if (originalToken.attributes.group === 'fontWeight') {
				const value = originalToken.value;
				return palette.typography.fontWeight[value].value;
			}

			if (originalToken.attributes.group === 'fontFamily') {
				const value = originalToken.value;
				return resolvePaletteValue(palette.typography.fontFamily, value);
			}

			if (originalToken.attributes.group === 'lineHeight') {
				const value = originalToken.value;
				return resolvePaletteValue(palette.typography.lineHeight, value);
			}

			if (originalToken.attributes.group === 'letterSpacing') {
				const value = originalToken.value;
				return palette.typography.letterSpacing[value].value;
			}

			if (originalToken.attributes.group === 'motion') {
				const value = originalToken.value;
				return {
					duration: palette.motion.duration?.[value.duration]?.value,
					curve: palette.motion.curve?.[value.curve]?.value,
					keyframes: value.keyframes,
					properties: value.properties?.map(
						(property: string) => palette.motion.properties?.[property]?.value,
					),
					delay: palette.motion.duration?.[value.delay]?.value,
					fill: palette.motion.fillMode?.[value.fill]?.value,
				};
			}

			if (originalToken.attributes.group === 'motionDuration') {
				const value = originalToken.value;
				return `${palette.motion.duration?.[value]?.value}ms`;
			}

			if (originalToken.attributes.group === 'motionEasing') {
				const value = originalToken.value;
				return palette.motion.curve?.[value]?.value;
			}

			if (originalToken.attributes.group === 'motionKeyframe') {
				const value = originalToken.value;
				return value;
			}
		},
	};
};

export default transform;
