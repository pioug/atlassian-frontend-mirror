/** @jsx jsx */
import React from 'react';
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';

import { HorizontalWrapper } from '../utils/vr-test';
import { FlexibleUiContext } from '../../src/state/flexible-ui-context';
import { exampleTokens, getContext } from '../utils/flexible-ui';
import {
	CommentCount,
	Priority,
	ProgrammingLanguage,
	SubscriberCount,
	ViewCount,
	ReactCount,
	VoteCount,
	Provider,
	LatestCommit,
	SubTasksProgress,
} from '../../src/view/FlexibleCard/components/elements';
import { IconType, SmartLinkSize } from '../../src/constants';
import VRTestWrapper from '../utils/vr-test-wrapper';

const overrideCss = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	backgroundColor: exampleTokens.overrideColor,
	borderRadius: '1rem',
	padding: '0.2rem',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'> span': {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
		color: exampleTokens.iconColor,
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

export default () => (
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
			<h5>Override CSS</h5>
			<HorizontalWrapper>
				<ProgrammingLanguage overrideCss={overrideCss} />
			</HorizontalWrapper>
		</FlexibleUiContext.Provider>
	</VRTestWrapper>
);
