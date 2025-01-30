/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useCallback, useEffect, useState } from 'react';

import { bind } from 'bind-event-listener';

import Blanket from '@atlaskit/blanket';
import Button from '@atlaskit/button/new';
import { cssMap, jsx } from '@atlaskit/css';
import { Box, Stack, Text } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

const eventResultStyles = cssMap({
	root: {
		paddingTop: token('space.100'),
		paddingRight: token('space.100'),
		paddingBottom: token('space.100'),
		paddingLeft: token('space.100'),
		borderColor: token('color.border'),
		borderStyle: 'dashed',
		borderWidth: token('border.width'),
		borderRadius: token('border.radius.100'),
		color: token('color.text.subtlest'),
	},
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

	useEffect(() => {
		const onKeyDown = (event: KeyboardEvent | React.KeyboardEvent) => {
			const { key } = event;
			if (key === 'Escape' || key === 'Esc') {
				onBlanketClicked();
			}
		};
		const unbind = bind(window, {
			type: 'keydown',
			listener: onKeyDown,
		});
		return () => {
			unbind();
		};
	}, [onBlanketClicked]);

	return (
		<Stack space="space.100" alignInline="start">
			<Text>
				Click the "Show blanket" button to open the blanket and either click the blanket or press
				the Escape key to dismiss it.
			</Text>
			<Button appearance="default" onClick={showBlanketClick} testId="show-button">
				Show blanket
			</Button>
			<Blanket
				onBlanketClicked={onBlanketClicked}
				isTinted={isBlanketVisible}
				shouldAllowClickThrough={shouldAllowClickThrough}
				testId="basic-blanket"
			/>
			<Box role="status" xcss={eventResultStyles.root}>
				Blanket isTinted:{String(isBlanketVisible)} shouldAllowClickThrough:
				{String(shouldAllowClickThrough)}
			</Box>
		</Stack>
	);
};

export default BasicExample;
