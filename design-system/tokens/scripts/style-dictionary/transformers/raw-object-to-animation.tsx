import type { TransformedToken } from 'style-dictionary';

export const rawObjectToAnimation = ({
	duration,
	curve,
	keyframes,
	delay,
	properties,
	fill,
}: TransformedToken): string => {
	if (keyframes) {
		return keyframes
			.map(
				(keyframe: string) =>
					`${duration}ms ${curve} ${keyframe}${delay ? ` ${delay}ms` : ''}${fill ? ` ${fill}` : ''}`,
			)
			.join(', ');
	} else {
		return properties
			.map(
				(property: string) =>
					`${property} ${duration}ms ${curve}${delay ? ` ${delay}ms` : ''}${fill ? ` ${fill}` : ''}`,
			)
			.join(', ');
	}
};
