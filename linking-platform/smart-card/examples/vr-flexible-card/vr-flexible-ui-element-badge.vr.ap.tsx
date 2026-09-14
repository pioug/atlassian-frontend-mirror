/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React from 'react';

import { css, jsx } from '@compiled/react';

import { SmartCardProvider } from '@atlaskit/link-provider/smart-card-provider';
import { token } from '@atlaskit/tokens';

import { IconType, SmartLinkSize } from '../../src/constants';
import { FlexibleCardContext } from '../../src/state/flexible-ui-context';
import { default as CommentCount } from '../../src/view/FlexibleCard/components/elements/comment-count-element';
import { default as LatestCommit } from '../../src/view/FlexibleCard/components/elements/latest-commit-element';
import { default as Priority } from '../../src/view/FlexibleCard/components/elements/priority-element';
import { default as ProgrammingLanguage } from '../../src/view/FlexibleCard/components/elements/programming-language-element';
import { default as Provider } from '../../src/view/FlexibleCard/components/elements/provider-element';
import { default as ReactCount } from '../../src/view/FlexibleCard/components/elements/react-count-element';
import { default as SubTasksProgress } from '../../src/view/FlexibleCard/components/elements/sub-tasks-progress-element';
import { default as SubscriberCount } from '../../src/view/FlexibleCard/components/elements/subscriber-count-element';
import { default as ViewCount } from '../../src/view/FlexibleCard/components/elements/view-count-element';
import { default as VoteCount } from '../../src/view/FlexibleCard/components/elements/vote-count-element';
import { getContext } from '../utils/flexible-ui';
import { HorizontalWrapper } from '../utils/vr-test';
import VRTestWrapper from '../utils/vr-test-wrapper';

import '../utils/vr-preload-metadata-icons';

const overrideCss = css({
	backgroundColor: token('color.background.brand.bold'),
	borderRadius: token('radius.xxlarge'),
	padding: '0.2rem',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'> span': {
		color: token('color.text.inverse'),
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

export default (): JSX.Element => {
	return (
		<VRTestWrapper>
			<SmartCardProvider>
				<FlexibleCardContext.Provider value={{ data: context }}>
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
				</FlexibleCardContext.Provider>
			</SmartCardProvider>
		</VRTestWrapper>
	);
};
