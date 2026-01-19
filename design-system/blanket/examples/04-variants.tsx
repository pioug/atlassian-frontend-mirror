/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { useCallback, useState } from 'react';

import Badge from '@atlaskit/badge';
import Blanket from '@atlaskit/blanket';
import Button from '@atlaskit/button/new';
import { css, cssMap, jsx } from '@atlaskit/css';
import Heading from '@atlaskit/heading';
import { useCloseOnEscapePress } from '@atlaskit/layering';
import { Box, Inline, Text } from '@atlaskit/primitives/compiled';
import Toggle from '@atlaskit/toggle';
import { token } from '@atlaskit/tokens';

const labelStyles = css({
	display: 'inline-block',
	color: token('color.text.subtlest'),
	font: token('font.body.small'),
	fontWeight: token('font.weight.semibold', '600'),
	marginBlockEnd: token('space.050', '4px'),
	marginBlockStart: token('space.0', '0px'),
});

const blanketStyles = cssMap({
	root: {
		display: 'inline-flex',
		boxSizing: 'border-box',
		maxWidth: '144px',
		flexDirection: 'column',
		borderColor: token('color.border'),
		borderStyle: 'dashed',
		borderWidth: token('border.width'),
		borderRadius: token('radius.small'),
		pointerEvents: 'initial',
	},
});

const behindOffsetStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values
	marginInlineStart: '144px' as any,
});

const BasicExample = () => {
	const [isTinted, setIsTinted] = useState(false);
	const toggleIsTinted = useCallback(() => {
		setIsTinted((isTinted) => !isTinted);
	}, [setIsTinted]);

	const [shouldAllowClickThrough, setShouldAllowClickThrough] = useState(true);
	const toggleShouldAllowClickThrough = useCallback(() => {
		setShouldAllowClickThrough((shouldAllowClickThrough) => !shouldAllowClickThrough);
	}, [setShouldAllowClickThrough]);

	const [countIncrementClicked, setCountIncrementClicked] = useState(0);
	const incrementCount = useCallback(() => {
		setCountIncrementClicked((count) => count + 1);
	}, [setCountIncrementClicked]);

	const [countBlanketClicked, setCountBlanketClicked] = useState(0);
	const incrementBlanketCountClicked = useCallback(() => {
		setCountBlanketClicked((countClicked) => countClicked + 1);
	}, []);

	useCloseOnEscapePress({
		onClose: toggleIsTinted,
		isDisabled: !isTinted,
	});

	return (
		<Box>
			<Blanket
				isTinted={isTinted}
				shouldAllowClickThrough={shouldAllowClickThrough}
				onBlanketClicked={incrementBlanketCountClicked}
			>
				<Box backgroundColor="elevation.surface" xcss={blanketStyles.root}>
					<Heading size="large" testId="child-heading">
						Blanket children
					</Heading>
					<label css={labelStyles} htmlFor="is-tinted">
						Tint the blanket
					</label>
					<Toggle
						id="is-tinted"
						testId="is-tinted"
						onChange={toggleIsTinted}
						defaultChecked={isTinted}
						isChecked={isTinted}
					/>
					<label css={labelStyles} htmlFor="allow-click-through">
						Allow click through
					</label>
					<Toggle
						id="allow-click-through"
						testId="allow-click-through"
						onChange={toggleShouldAllowClickThrough}
						defaultChecked={shouldAllowClickThrough}
					/>
				</Box>
			</Blanket>
			<div css={behindOffsetStyles}>
				<Heading size="large">Behind blanket</Heading>
				<Inline alignBlock="center">
					<Button onClick={incrementCount} testId="increment">
						Increment
					</Button>
					<Badge testId="count-increment-clicked">{countIncrementClicked}</Badge>
				</Inline>
				<Inline alignBlock="center">
					<Text>Blanket clicked</Text>
					<Badge testId="count-blanket-clicked">{countBlanketClicked}</Badge>
				</Inline>
			</div>
		</Box>
	);
};

export default BasicExample;
