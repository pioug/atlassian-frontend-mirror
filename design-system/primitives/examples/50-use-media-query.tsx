import React from 'react';

// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- TODO: migrate to @atlaskit/primitives/compiled
import { UNSAFE_useMediaQuery as useMediaQuery } from '@atlaskit/primitives/responsive';

export default (): React.JSX.Element => {
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
