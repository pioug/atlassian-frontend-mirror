/** @jsx jsx */
import { useCallback, useState } from 'react';

import { jsx } from '@emotion/react';

import Button from '@atlaskit/button/new';
import { Box, xcss } from '@atlaskit/primitives';

import Blanket from '../../src';

const blanketChildStyles = xcss({
	width: '50%',
	margin: 'space.600',
	paddingBlock: 'space.300',
	backgroundColor: 'elevation.surface',
});

const BlanketWithChildrenExample = () => {
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
				testId="blanket-with-children"
			>
				<Box xcss={blanketChildStyles}>
					Click "Show blanket" button to open the blanket & click the blanket to dismiss it.
				</Box>
			</Blanket>
		</Box>
	);
};

export default BlanketWithChildrenExample;
