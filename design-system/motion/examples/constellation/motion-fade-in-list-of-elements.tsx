/* eslint-disable @atlaskit/ui-styling-standard/no-nested-selectors */
/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { jsx } from '@compiled/react';

import { cssMap } from '@atlaskit/css';
import {
	BitbucketIcon,
	ConfluenceIcon,
	JiraIcon,
	JiraServiceManagementIcon,
	StatuspageIcon,
	TrelloIcon,
} from '@atlaskit/logo';
import { Motion, StaggeredEntrance } from '@atlaskit/motion';
import { Inline, Stack, Text } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

import { RetryContainer } from '../utils';

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
