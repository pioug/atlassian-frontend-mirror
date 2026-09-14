import React, { useCallback, useState } from 'react';

import Blanket from '@atlaskit/blanket/blanket';
import Button from '@atlaskit/button/default/button';
import { Box } from '@atlaskit/primitives/compiled';

const BlanketClickthroughExample = (): React.JSX.Element => {
	const [isBlanketVisible, setIsBlanketVisible] = useState(false);
	const showBlanketClick = useCallback(() => {
		setIsBlanketVisible((isBlanketVisible) => !isBlanketVisible);
	}, [setIsBlanketVisible]);
	return (
		<Box>
			<Button appearance="default" onClick={showBlanketClick}>
				{!isBlanketVisible ? 'Show blanket' : 'Hide blanket'}
			</Button>

			<Blanket isTinted={isBlanketVisible} shouldAllowClickThrough />
		</Box>
	);
};

export default BlanketClickthroughExample;
