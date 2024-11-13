/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useCallback, useState } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';
import Lorem from 'react-lorem-component';

import Blanket from '@atlaskit/blanket';
import Button from '@atlaskit/button/new';
import Heading from '@atlaskit/heading';
import { useCloseOnEscapePress } from '@atlaskit/layering';
import { Box, Stack, Text, xcss } from '@atlaskit/primitives';

const blanketChildStyles = xcss({
	width: '50%',
	marginBlock: 'space.800',
	marginInline: 'auto',
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

	const closeBlanket = useCallback(() => {
		setIsBlanketVisible(false);
		setShouldAllowClickThrough(true);
	}, []);

	useCloseOnEscapePress({
		onClose: closeBlanket,
		isDisabled: !isBlanketVisible,
	});

	return (
		<Stack space="space.100" alignInline="start">
			<Text>
				Select "Show blanket" to open the blanket. Either click on the blanket or press Escape to
				dismiss the blanket.
			</Text>
			<Text>Note: This example uses only the blanket component, not a modal dialog.</Text>
			<Button appearance="default" onClick={showBlanketClick} testId="show-button">
				Show blanket
			</Button>
			<Blanket
				isTinted={isBlanketVisible}
				shouldAllowClickThrough={shouldAllowClickThrough}
				testId="blanket-with-children"
			>
				<Stack space="space.200" xcss={blanketChildStyles} grow="hug">
					<Stack>
						<Heading size="xlarge">Blanket Heading</Heading>
						<Lorem count={20} />
					</Stack>
					{isBlanketVisible && (
						<Box>
							<Button appearance="primary" onClick={closeBlanket} testId="close-button">
								Close blanket
							</Button>
						</Box>
					)}
				</Stack>
			</Blanket>
		</Stack>
	);
};

export default BasicExample;
