import React from 'react';

import { UNSAFE_useMediaQuery as useMediaQuery } from '../src/compiled/responsive/use-media-query';

export default () => {
	const mq = useMediaQuery('above.sm', (event) => setIsAbove(event.matches));
	const [isAbove, setIsAbove] = React.useState(mq?.matches);

	let text = 'unknown';
	if (isAbove === true) {
		text = 'above sm';
	}
	if (isAbove === false) {
		text = 'below sm';
	}

	return <div>{text}</div>;
};
