/** @jsx jsx */
import { useCallback, useState } from 'react';

import { jsx } from '@emotion/react';

import Button from '@atlaskit/button/new';
import { Box } from '@atlaskit/primitives';

import Blanket from '../../src';

const BlanketBasicExample = () => {
	const [isBlanketVisible, setIsBlanketVisible] = useState(false);
	const [shouldAllowClickThrough, setShouldAllowClickThrough] = useState(true);

	const showBlanketClick = useCallback(() => {
		setIsBlanketVisible(true);
		setShouldAllowClickThrough(false);
	}, []);

	const onBlanketClicked = useCallback(() => {
		setIsBlanketVisible(false);
		setShouldAllowClickThrough(true);
	}, []);

	return (
		<Box>
			<Button appearance="default" onClick={showBlanketClick} testId="show-button">
				Show blanket
			</Button>
			<Blanket
				onBlanketClicked={onBlanketClicked}
				isTinted={isBlanketVisible}
				shouldAllowClickThrough={shouldAllowClickThrough}
				testId="basic-blanket"
			/>
		</Box>
	);
};

export default BlanketBasicExample;
