/**
 * Side-by-side comparison of ReactionTooltip with
 * platform_reactions_tooltip_a11y feature gate ON vs OFF.
 *
 * Hover over each reaction button to see the tooltip with "and N others".
 * Flag ON: the overflow footer renders as a <button> inside <li>.
 * Flag OFF: the overflow footer renders as a plain <li> with onClick handlers.
 */
/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { useState } from 'react';

import { css, jsx } from '@compiled/react';
import { IntlProvider } from 'react-intl';

import { setBooleanFeatureFlagResolver } from '@atlaskit/platform-feature-flags';
import { token } from '@atlaskit/tokens';

import { ReactionTooltip } from '../src/components/ReactionTooltip';
import { type ReactionSummary } from '../src/types';

const demoReaction: ReactionSummary = {
	ari: 'reaction-id',
	containerAri: 'container-id',
	emojiId: '1f44d',
	count: 9,
	reacted: false,
	users: [
		{ id: 'user-1', displayName: 'Alice Johnson' },
		{ id: 'user-2', displayName: 'Bob Smith' },
		{ id: 'user-3', displayName: 'Carol Williams' },
		{ id: 'user-4', displayName: 'David Brown' },
		{ id: 'user-5', displayName: 'Robert ReallyLongFamilyNamePerson' },
		{ id: 'user-6', displayName: 'Eve Davis' },
		{ id: 'user-7', displayName: 'Frank Miller' },
		{ id: 'user-8', displayName: 'Grace Wilson' },
	],
};

const reactionButtonStyle = css({
	paddingTop: token('space.050'),
	paddingRight: token('space.100'),
	paddingBottom: token('space.050'),
	paddingLeft: token('space.100'),
	borderRadius: token('radius.small'),
	borderWidth: token('border.width'),
	borderStyle: 'solid',
	borderColor: token('color.border'),
	backgroundColor: token('color.background.neutral'),
	cursor: 'pointer',
	fontSize: '14px',
});

const demoCardStyle = css({
	paddingTop: token('space.200'),
	paddingRight: token('space.200'),
	paddingBottom: token('space.200'),
	paddingLeft: token('space.200'),
	borderWidth: token('border.width'),
	borderStyle: 'solid',
	borderColor: token('color.border'),
	borderRadius: token('radius.small'),
	minWidth: '200px',
});

const flagLabelStyle = css({
	marginTop: token('space.0'),
	marginRight: token('space.0'),
	marginBottom: token('space.100'),
	marginLeft: token('space.0'),
	fontWeight: token('font.weight.semibold'),
});

const descriptionStyle = css({
	marginTop: token('space.0'),
	marginRight: token('space.0'),
	marginBottom: token('space.150'),
	marginLeft: token('space.0'),
	fontSize: '12px',
	color: token('color.text.subtlest'),
});

const codeStyle = css({
	fontSize: '12px',
});

const dialogOpenedStyle = css({
	marginTop: token('space.100'),
	color: token('color.text.success'),
	fontSize: '12px',
});

const dismissedStyle = css({
	marginTop: token('space.100'),
	fontSize: '12px',
	color: token('color.text.disabled'),
});

const resetButtonStyle = css({
	fontSize: '12px',
	cursor: 'pointer',
});

const pageStyle = css({
	paddingTop: token('space.300'),
	paddingRight: token('space.300'),
	paddingBottom: token('space.300'),
	paddingLeft: token('space.300'),
});

const headingStyle = css({
	marginBottom: token('space.100'),
});

const subtitleStyle = css({
	marginBottom: token('space.300'),
	color: token('color.text.subtlest'),
});

const rowStyle = css({
	display: 'flex',
	gap: token('space.300'),
	flexWrap: 'wrap',
});

const ReactionButton = ({ label }: { label: string }): React.JSX.Element => (
	<button type="button" css={reactionButtonStyle}>
		{label}
	</button>
);

const TooltipDemo = ({ flagOn }: { flagOn: boolean }) => {
	const [dialogOpened, setDialogOpened] = useState(false);
	const [tooltipEnabled, setTooltipEnabled] = useState(true);

	setBooleanFeatureFlagResolver((flagKey) => {
		if (flagKey === 'platform_reactions_tooltip_a11y') {
			return flagOn;
		}
		if (flagKey === 'platform_suppression_removal_fix_reactions') {
			return true;
		}
		return false;
	});

	const handleDismissTooltip = () => setTooltipEnabled(false);
	const handleOpenDialog = () => {
		setDialogOpened(true);
		setTimeout(() => setDialogOpened(false), 2000);
	};

	return (
		<div css={demoCardStyle}>
			<p css={flagLabelStyle}>
				Flag {flagOn ? 'ON' : 'OFF'}: <code css={codeStyle}>platform_reactions_tooltip_a11y</code>
			</p>
			<p css={descriptionStyle}>
				{flagOn
					? 'Footer renders as <button> inside <li> — no suppression'
					: 'Footer renders as <li> with onClick — suppression present'}
			</p>
			<ReactionTooltip
				reaction={demoReaction}
				emojiName="thumbs up"
				allowUserDialog
				isEnabled={tooltipEnabled}
				dismissTooltip={handleDismissTooltip}
				handleOpenReactionsDialog={handleOpenDialog}
			>
				<ReactionButton label="👍 9" />
			</ReactionTooltip>
			{dialogOpened && <p css={dialogOpenedStyle}>✓ Dialog opened!</p>}
			{!tooltipEnabled && (
				<p css={dismissedStyle}>
					Tooltip dismissed.{' '}
					<button type="button" css={resetButtonStyle} onClick={() => setTooltipEnabled(true)}>
						Reset
					</button>
				</p>
			)}
		</div>
	);
};

export default (): JSX.Element => (
	<IntlProvider locale="en">
		{/* eslint-disable-next-line @atlaskit/design-system/use-primitives */}
		<div css={pageStyle}>
			<h2 css={headingStyle}>ReactionTooltip — A11y fix comparison</h2>
			<p css={subtitleStyle}>
				Hover over the reaction buttons to see the tooltip. Click "and N others" to trigger the
				dialog entrypoint.
			</p>
			<div css={rowStyle}>
				<TooltipDemo flagOn={false} />
				<TooltipDemo flagOn={true} />
			</div>
		</div>
	</IntlProvider>
);
