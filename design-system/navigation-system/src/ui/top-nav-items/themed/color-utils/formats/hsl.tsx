import type { HSL, RGB } from '../types';

type RgbChannel = 'red' | 'green' | 'blue';

const rgbOffset: Record<RgbChannel, number> = {
	red: 0, // Pure red has a hue of 0 degrees
	green: 120, // Pure green has a hue of 120 degrees
	blue: 240, // Pure blue has a hue of 240 degrees
};

/**
 * Returns the contribution of the given RGB channel to the provided hue.
 *
 * Maximum value is 1, meaning it's the main channel for the hue
 * Minimum value is -1, meaning it doesn't contribute to the hue at all
 *
 * The function looks like a single trapezoidal wave that is
 * horizontally shifted according to the hue offset of the given channel.
 */
const getChannelContributionToHue = ({
	rgbChannel,
	hue,
}: {
	rgbChannel: RgbChannel;
	hue: number;
}) => {
	const k = ((360 - rgbOffset[rgbChannel] + hue) / 30) % 12;
	return Math.max(-1, Math.min(k - 3, 9 - k, 1));
};

/**
 * Derived from Wikipedia article on HSL:
 * https://en.wikipedia.org/wiki/HSL_and_HSV#HSL_to_RGB_alternative
 *
 * You can think of it as taking an RGB channel, and the saturation and lightness values
 * to construct a function mapping hue to channel intensity.
 *
 * It then evaluates the function for the given hue.
 */
const getRgbChannel = ({
	rgbChannel,
	color: { h: hue, s: saturation, l: lightness },
}: {
	rgbChannel: RgbChannel;
	color: HSL;
}) => {
	const shiftY = lightness;
	const scaleY = -1 * saturation * Math.min(lightness, 1 - lightness);
	/**
	 * Value between 0-1 describing how much the RGB channel contributes to the given HSL color.
	 *
	 * `getChannelContributionToHue` is the channel contribution for the pure hue,
	 * which is why we need to adjust and scale according to saturation and lightness.
	 */
	const channelContribution = shiftY + scaleY * getChannelContributionToHue({ rgbChannel, hue });

	return Math.round(255 * channelContribution);
};

/**
 * Attempts to parse a legacy notation CSS `hsl()` color string.
 *
 * Returns `null` on failure.
 */
export function parseHsl(color: string): RGB | null {
	/**
	 * I was creating increasingly complex regular expressions, aiming for correct parsing.
	 *
	 * I decided to be pragmatic and just opt for what Nav 3 does (through the `chromatism` library),
	 * with some slight improvements.
	 *
	 * We can refine it as needed.
	 *
	 * Known limitations of this approach:
	 *
	 * - It is overly permissive and will allow some invalid syntax,
	 *   for example `hsl(1, 2, 3, 4, 5, 6, 7)` where it would just extract the first 3 parameters
	 * - Only the integer parts of non-integers will be parsed
	 * - Only supports the legacy, comma-separated syntax
	 */
	const [h, s, l] = color
		.replace(/hsl\(|[)%\s]/g, '')
		.split(',')
		.map((value) => parseInt(value, 10));

	if ([h, s, l].some((channel) => !Number.isInteger(channel))) {
		if (process.env.NODE_ENV !== 'production') {
			// eslint-disable-next-line no-console
			console.error(`parseHsl failed to parse input: '${color}'`);
		}

		return null;
	}

	/**
	 * Normalized HSL value so that:
	 *
	 * - hue angle is from 0 (inclusive) to 360 (not inclusive)
	 * - saturation and lightness percentages are expressed as fractional values from 0 to 1
	 */
	const normal: HSL = {
		h: h % 360,
		s: Math.min(s / 100, 1),
		l: Math.min(l / 100, 1),
	};

	return {
		r: getRgbChannel({ rgbChannel: 'red', color: normal }),
		g: getRgbChannel({ rgbChannel: 'green', color: normal }),
		b: getRgbChannel({ rgbChannel: 'blue', color: normal }),
	};
}
