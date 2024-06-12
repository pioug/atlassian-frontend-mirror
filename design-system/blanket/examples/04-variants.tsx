/** @jsx jsx */

import { useCallback, useState } from 'react';

import { css, jsx } from '@emotion/react';

import Badge from '@atlaskit/badge';
import Button from '@atlaskit/button/new';
import { fontSize } from '@atlaskit/theme/constants';
import { headingSizes } from '@atlaskit/theme/typography';
import Toggle from '@atlaskit/toggle';
import { token } from '@atlaskit/tokens';

const labelStyles = css({
	display: 'inline-block',
	color: token('color.text.subtlest'),
	fontSize: `${headingSizes.h200.size / fontSize()}em`,
	fontStyle: 'inherit',
	fontWeight: token('font.weight.semibold', '600'),
	lineHeight: headingSizes.h200.lineHeight / headingSizes.h200.size,
	marginBlockEnd: token('space.050', '4px'),
	marginBlockStart: token('space.0', '0px'),
});

const blanketStyles = css({
	display: 'inline-flex',
	boxSizing: 'border-box',
	maxWidth: '144px',
	flexDirection: 'column',
	background: token('elevation.surface'),
	border: `2px dashed ${token('color.background.accent.blue.subtler')}`,
	pointerEvents: 'initial',
});

const behindOffsetStyles = css({
	// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
	marginInlineStart: '144px',
});

import Blanket from '../src';

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

	return (
		<div>
			<Blanket
				isTinted={isTinted}
				shouldAllowClickThrough={shouldAllowClickThrough}
				onBlanketClicked={incrementBlanketCountClicked}
			>
				<div css={blanketStyles}>
					<h2 data-testid="child-heading">Blanket children</h2>
					<label css={labelStyles} htmlFor="is-tinted">
						Tint the blanket
					</label>
					<Toggle
						id="is-tinted"
						testId="is-tinted"
						onChange={toggleIsTinted}
						defaultChecked={isTinted}
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
				</div>
			</Blanket>
			<div css={behindOffsetStyles}>
				<h2>Behind blanket</h2>
				<div>
					<Button onClick={incrementCount} testId="increment">
						Increment
					</Button>
					<Badge testId="count-increment-clicked">{countIncrementClicked}</Badge>
				</div>
				<div>
					Blanket clicked
					<Badge testId="count-blanket-clicked">{countBlanketClicked}</Badge>
				</div>
			</div>
		</div>
	);
};

export default BasicExample;
