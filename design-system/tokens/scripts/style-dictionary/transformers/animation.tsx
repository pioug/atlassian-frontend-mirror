import type { Transform, TransformedToken } from 'style-dictionary';

export const rawObjectToAnimation = ({
	duration,
	curve,
	keyframes,
	delay,
	properties,
}: TransformedToken): string => {
	if (keyframes) {
		return keyframes
			.map((keyframe: string) => `${duration}ms ${curve} ${keyframe}${delay ? ` ${delay}ms` : ''}`)
			.join(', ');
	} else {
		return `${properties.join(' ')} ${duration}ms ${curve}${delay ? ` ${delay}ms` : ''}`;
	}
};

/**
 * transform an object to a keyframe
 */
const rawObjectToAnimationTransform: Transform = {
	type: 'value',
	matcher: (token) => {
		return ['motion'].includes(token.attributes?.group);
	},
	transformer: ({ value }) => {
		return rawObjectToAnimation(value);
	},
};

export default rawObjectToAnimationTransform;
