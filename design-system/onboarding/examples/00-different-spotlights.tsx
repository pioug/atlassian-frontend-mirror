/**
 * @jsxRuntime classic
 * @jsx jsx
 */

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';

import Button from '@atlaskit/button/new';
import UndoIcon from '@atlaskit/icon/glyph/editor/undo';
import { SpotlightCard } from '@atlaskit/onboarding';
import { Text } from '@atlaskit/primitives';
import { token } from '@atlaskit/tokens';

import welcomeImage from './assets/this-is-new-jira.png';

const wrapperStyles = css({
	display: 'flex',
	width: '600px',
	height: '500px',
	padding: token('space.200', '16px'),
	alignItems: 'space-evenly',
	justifyContent: 'space-evenly',
	flexDirection: 'column',
	flexWrap: 'wrap',
});

const copy =
	'Quickly switch between your most recent projects by selecting the project name and icon.';

export default () => {
	return (
		<div css={wrapperStyles} data-testid="spotlight-examples">
			<SpotlightCard
				actions={[{ text: 'Next', onClick: () => {} }]}
				actionsBeforeElement="1/3"
				width={275}
			>
				{copy}
			</SpotlightCard>
			<SpotlightCard
				actions={[
					{ text: 'Next', onClick: () => {} },
					{ text: 'Skip', onClick: () => {}, appearance: 'subtle' },
				]}
				width={275}
			>
				{copy}
			</SpotlightCard>
			<SpotlightCard
				actionsBeforeElement={
					<Text as="p" weight="semibold">
						Try clicking the project name.
					</Text>
				}
				width={275}
			>
				{copy}
			</SpotlightCard>
			<SpotlightCard
				image={<img alt="" src={welcomeImage} width="275" />}
				actions={[{ text: 'Next', onClick: () => {} }]}
				width={275}
			>
				{copy}
			</SpotlightCard>
			<SpotlightCard
				heading="Switch it up"
				headingLevel={2}
				headingAfterElement={
					<Button iconBefore={UndoIcon} appearance="subtle">
						Replay
					</Button>
				}
				actions={[{ text: 'Got it', onClick: () => {} }]}
				width={275}
			>
				{copy}
			</SpotlightCard>
		</div>
	);
};
