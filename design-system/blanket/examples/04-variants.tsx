/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { useCallback, useState } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';

import Badge from '@atlaskit/badge';
import Button from '@atlaskit/button/new';
import Heading from '@atlaskit/heading';
import { useCloseOnEscapePress } from '@atlaskit/layering';
import { Box, Inline, Text, xcss } from '@atlaskit/primitives';
import { fontSize } from '@atlaskit/theme/constants';
import { headingSizes } from '@atlaskit/theme/typography';
import Toggle from '@atlaskit/toggle';
import { token } from '@atlaskit/tokens';

import Blanket from '../src';

const labelStyles = css({
	display: 'inline-block',
	color: token('color.text.subtlest'),
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	fontSize: `${headingSizes.h200.size / fontSize()}em`,
	fontStyle: 'inherit',
	fontWeight: token('font.weight.semibold', '600'),
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	lineHeight: headingSizes.h200.lineHeight / headingSizes.h200.size,
	marginBlockEnd: token('space.050', '4px'),
	marginBlockStart: token('space.0', '0px'),
});

const blanketStyles = xcss({
	display: 'inline-flex',
	boxSizing: 'border-box',
	maxWidth: '144px',
	flexDirection: 'column',
	background: token('elevation.surface'),
	borderColor: 'color.border',
	borderStyle: 'dashed',
	borderWidth: 'border.width',
	borderRadius: 'border.radius.100',
	pointerEvents: 'initial',
});

const behindOffsetStyles = css({
	// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
	marginInlineStart: '144px',
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
				<Box xcss={blanketStyles}>
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
