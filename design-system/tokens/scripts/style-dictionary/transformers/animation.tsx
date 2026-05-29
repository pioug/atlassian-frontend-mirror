import type { Transform } from 'style-dictionary';

import { rawObjectToAnimation } from './raw-object-to-animation';

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
export { rawObjectToAnimation } from './raw-object-to-animation';
