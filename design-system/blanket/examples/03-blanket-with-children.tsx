/**
 * @jsxRuntime classic
 */
/** @jsx jsx */
import { Fragment, useCallback, useState } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';
import Lorem from 'react-lorem-component';

import Button from '@atlaskit/button/new';
import Heading from '@atlaskit/heading';
import { Stack, xcss } from '@atlaskit/primitives';
import { token } from '@atlaskit/tokens';

import Blanket from '../src';

const blanketChildStyles = xcss({
	width: '50%',
	margin: `${token('space.800', '64px')} auto`,
	padding: 'space.500',
	backgroundColor: 'elevation.surface',
});

const BasicExample = () => {
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
		<Fragment>
			<p>Select "Show blanket" to open the blanket. Press Escape to dismiss the blanket.</p>
			<Button appearance="default" onClick={showBlanketClick} testId="show-button">
				Show blanket
			</Button>
			<Blanket
				onBlanketClicked={onBlanketClicked}
				isTinted={isBlanketVisible}
				shouldAllowClickThrough={shouldAllowClickThrough}
				testId="blanket-with-children"
			>
				<Stack space="space.200" xcss={blanketChildStyles}>
					<Heading size="xlarge">Blanket Heading</Heading>
					<Lorem count={20} />
				</Stack>
			</Blanket>
		</Fragment>
	);
};

export default BasicExample;
