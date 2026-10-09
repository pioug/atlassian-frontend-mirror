/* eslint-disable @atlaskit/ui-styling-standard/no-nested-selectors */
/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { jsx } from '@compiled/react';

import { cssMap } from '@atlaskit/css';
import { BitbucketIcon } from '@atlaskit/logo/bitbucket-icon';
import { ConfluenceIcon } from '@atlaskit/logo/confluence-icon';
import { JiraIcon } from '@atlaskit/logo/jira-icon';
import { JiraServiceManagementIcon } from '@atlaskit/logo/jira-service-management-icon';
import { StatuspageIcon } from '@atlaskit/logo/statuspage-icon';
import { TrelloIcon } from '@atlaskit/logo/trello-icon';
import Motion from '@atlaskit/motion/entering/motion';
import StaggeredEntrance from '@atlaskit/motion/staggered-entrance';
import { Inline } from '@atlaskit/primitives/compiled/inline';
import { Stack } from '@atlaskit/primitives/compiled/stack';
import { Text } from '@atlaskit/primitives/compiled/text';
import { token } from '@atlaskit/tokens';

import { RetryContainer } from '../utils/containers';

const styles = cssMap({
	list: {
		width: '100%',
		marginBlockEnd: token('space.200'),
	},
	listItem: {
		display: 'flex',
		alignItems: 'center',
		backgroundColor: token('elevation.surface'),
		borderRadius: token('radius.medium'),
		boxShadow: token('elevation.shadow.overlay'),
		paddingBlockEnd: token('space.100'),
		paddingBlockStart: token('space.100'),
		paddingInlineEnd: token('space.100'),
		paddingInlineStart: token('space.100'),
	},
	entering: {
		animationDuration: token('motion.duration.xlong'),
		animationTimingFunction: token('motion.easing.out.practical'),
		animationName: `${token('motion.keyframe.scale.in.medium')}, ${token('motion.keyframe.fade.in')}`,
	},
	exiting: {
		animationDuration: token('motion.duration.long'),
		animationTimingFunction: token('motion.easing.in.practical'),
		animationName: `${token('motion.keyframe.scale.out.medium')}, ${token('motion.keyframe.fade.out')}`,
	},
});

const MotionFadeInListOfElementsExample = (): JSX.Element => {
	return (
		<RetryContainer>
			<Stack space="space.100" xcss={styles.list}>
				<StaggeredEntrance>
					{logos.map((logo) => (
						// Gotcha #1 set propery keys YO
						<Motion
							enteringAnimationXcss={styles.entering}
							exitingAnimationXcss={styles.exiting}
							key={logo[1] as string}
						>
							<Inline xcss={styles.listItem} space="space.100">
								{logo[0]}
								<Text>{logo[1]}</Text>
							</Inline>
						</Motion>
					))}
				</StaggeredEntrance>
			</Stack>
		</RetryContainer>
	);
};

const logos = [
	[<BitbucketIcon size="small" />, 'Bitbucket'],
	[<ConfluenceIcon size="small" />, 'Confluence'],
	[<JiraServiceManagementIcon size="small" />, 'Jira Service Management'],
	[<JiraIcon size="small" />, 'Jira'],
	[<TrelloIcon size="small" />, 'Trello'],
	[<StatuspageIcon size="small" />, 'Statuspage'],
];

export default MotionFadeInListOfElementsExample;
