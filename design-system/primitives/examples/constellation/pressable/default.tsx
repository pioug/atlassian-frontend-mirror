import React, { useCallback } from 'react';

import Pressable from '@atlaskit/primitives/pressable';

export default function Default(): React.JSX.Element {
	const handleClick = useCallback(() => {
		console.log('Clicked');
	}, []);

	return <Pressable onClick={handleClick}>Pressable</Pressable>;
}
