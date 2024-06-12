import type { Transform } from 'style-dictionary';

const transform: Transform = {
	type: 'name',
	transformer: (token) => token.path.join('.'),
};

export default transform;
