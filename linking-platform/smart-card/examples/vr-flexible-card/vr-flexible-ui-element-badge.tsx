/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React from 'react';

import { css, jsx } from '@compiled/react';

import { token } from '@atlaskit/tokens';

import { IconType, SmartLinkSize } from '../../src/constants';
import { FlexibleUiContext } from '../../src/state/flexible-ui-context';
import {
	CommentCount,
	LatestCommit,
	Priority,
	ProgrammingLanguage,
	Provider,
	ReactCount,
	SubscriberCount,
	SubTasksProgress,
	ViewCount,
	VoteCount,
} from '../../src/view/FlexibleCard/components/elements';
import { getContext } from '../utils/flexible-ui';
import { HorizontalWrapper } from '../utils/vr-test';
import VRTestWrapper from '../utils/vr-test-wrapper';

const overrideCss = css({
	backgroundColor: token('color.background.brand.bold', '#0B66E4'),
	borderRadius: '1rem',
	padding: '0.2rem',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'> span': {
		color: token('color.text.inverse', '#FFFFFF'),
	},
});
const context = getContext({
	commentCount: 1,
	viewCount: 2,
	reactCount: 3,
	voteCount: 4,
	subTasksProgress: '3/4',
	priority: { icon: IconType.PriorityLow },
	programmingLanguage: 'JS',
	subscriberCount: 999,
	latestCommit: '1d2adc2',
});

export default () => {
	return (
		<VRTestWrapper>
			<FlexibleUiContext.Provider value={context}>
				{Object.values(SmartLinkSize).map((size, idx) => (
					<React.Fragment key={idx}>
						<h5>Size: {size}</h5>
						<HorizontalWrapper>
							<CommentCount size={size} testId="vr-test-badge-comment" />
							<ViewCount size={size} testId="vr-test-badge-view" />
							<ReactCount size={size} testId="vr-test-badge-react" />
							<VoteCount size={size} testId="vr-test-badge-vote" />
							<SubscriberCount size={size} testId="vr-test-badge-subscriber-count" />
							<ProgrammingLanguage size={size} testId="vr-test-badge-programming-language" />
							<Priority icon={IconType.PriorityBlocker} />
							<Priority icon={IconType.PriorityCritical} />
							<Priority icon={IconType.PriorityHigh} />
							<Priority icon={IconType.PriorityHighest} />
							<Priority icon={IconType.PriorityLow} />
							<Priority icon={IconType.PriorityLowest} />
							<Priority icon={IconType.PriorityMajor} />
							<Priority icon={IconType.PriorityMedium} />
							<Priority icon={IconType.PriorityMinor} />
							<Priority icon={IconType.PriorityTrivial} />
							<Priority icon={IconType.PriorityUndefined} />
							<Provider />
							<Provider label="Provider" />
							<LatestCommit size={size} testId="vr-test-badge-latest-commit" />
							<SubTasksProgress testId="vr-test-badge-subtasks-progress" />
						</HorizontalWrapper>
					</React.Fragment>
				))}
				<h5>Appearance: Subtle</h5>
				<HorizontalWrapper>
					<Provider appearance="subtle" />
					<CommentCount appearance="subtle" />
				</HorizontalWrapper>
				<h5>Override CSS</h5>
				<HorizontalWrapper>
					<ProgrammingLanguage css={overrideCss} />
				</HorizontalWrapper>
			</FlexibleUiContext.Provider>
		</VRTestWrapper>
	);
};
