import type { Transform, TransformedToken } from 'style-dictionary';

export const rawObjectToAnimation = ({
	duration,
	curve,
	keyframes,
	delay,
}: TransformedToken): string => {
	return keyframes
		.map((keyframe: string) => `${duration}ms ${curve} ${keyframe}${delay ? ` ${delay}ms` : ''}`)
		.join(', ');
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
