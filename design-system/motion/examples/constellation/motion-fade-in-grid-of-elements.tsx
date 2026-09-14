/* eslint-disable @atlaskit/ui-styling-standard/no-nested-selectors */
/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { cloneElement, useState } from 'react';

import { css, jsx } from '@compiled/react';

import Button from '@atlaskit/button/default/button';
import { cssMap } from '@atlaskit/css';
import { JiraSoftwareIcon } from '@atlaskit/logo/jira-software-icon';
import { JiraWorkManagementIcon } from '@atlaskit/logo/jira-work-management/icon';
import {
	BitbucketIcon,
	ConfluenceIcon,
	JiraIcon,
	JiraServiceManagementIcon,
	OpsgenieIcon,
	StatuspageIcon,
	TrelloIcon,
} from '@atlaskit/logo';
import Motion from '@atlaskit/motion/entering/motion';
import StaggeredEntrance from '@atlaskit/motion/staggered-entrance';
import { token } from '@atlaskit/tokens';

import { Block } from '../utils/blocks';
import { RetryContainer } from '../utils/containers';

const styles = cssMap({
	entering: {
		animationDuration: token('motion.duration.xlong'),
		animationTimingFunction: token('motion.easing.out.practical'),
		animationName: `${token('motion.keyframe.scale.in.medium')}, ${token(
			'motion.keyframe.fade.in',
		)}`,
	},
	exiting: {
		animationDuration: token('motion.duration.long'),
		animationTimingFunction: token('motion.easing.in.practical'),
		animationName: `${token('motion.keyframe.scale.out.medium')}, ${token(
			'motion.keyframe.fade.out',
		)}`,
	},
});

const MotionFadeInGridOfElementsExample = (): JSX.Element => {
	const [state, setState] = useState(() => ({
		size: 'medium' as any,
		numOfChildren: 9,
	}));

	return (
		<div>
			<div css={buttonContainerStyles}>
				{[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 20, 30, 50, 80].map((num) => (
					<Button
						key={num}
						isSelected={num === state.numOfChildren}
						onClick={() => {
							setState({
								size: num > 9 ? 'small' : 'medium',
								numOfChildren: num,
							});
						}}
					>
						{num}
					</Button>
				))}
			</div>

			<RetryContainer key={state.numOfChildren}>
				<ul css={listStyles}>
					<StaggeredEntrance columns="responsive">
						{Array(state.numOfChildren)
							.fill(undefined)
							.map((_, index) => (
								<Motion
									enteringAnimationXcss={styles.entering}
									exitingAnimationXcss={styles.exiting}
								>
									<li css={listItemStyles}>
										<Block appearance={state.size}>
											{/* eslint-disable-next-line @repo/internal/react/no-clone-element */}
											{cloneElement(logos[index % logos.length], {
												size: state.numOfChildren > 9 ? 'small' : 'xlarge',
											})}
										</Block>
									</li>
								</Motion>
							))}
					</StaggeredEntrance>
				</ul>
			</RetryContainer>
		</div>
	);
};

const logos = [
	<BitbucketIcon size="xlarge" />,
	<ConfluenceIcon size="xlarge" />,
	<JiraServiceManagementIcon size="xlarge" />,
	<JiraIcon size="xlarge" />,
	<JiraSoftwareIcon size="xlarge" />,
	<JiraWorkManagementIcon size="xlarge" />,
	<OpsgenieIcon size="xlarge" />,
	<StatuspageIcon size="xlarge" />,
	<TrelloIcon size="xlarge" />,
];

const buttonContainerStyles = css({
	textAlign: 'center',
	'> *': {
		marginBlockEnd: token('space.025'),
		marginBlockStart: token('space.025'),
		marginInlineEnd: token('space.025'),
		marginInlineStart: token('space.025'),
	},
});

const listStyles = css({
	display: 'flex',
	maxWidth: '474px',
	justifyContent: 'flex-start',
	flexWrap: 'wrap',
	marginBlockEnd: token('space.200'),
	marginBlockStart: token('space.200'),
	marginInlineEnd: token('space.200'),
	marginInlineStart: token('space.200'),
	paddingBlockEnd: token('space.0'),
	paddingBlockStart: token('space.0'),
	paddingInlineEnd: token('space.0'),
	paddingInlineStart: token('space.0'),
	div: {
		marginBlockEnd: token('space.0'),
		marginBlockStart: token('space.0'),
		marginInlineEnd: token('space.0'),
		marginInlineStart: token('space.0'),
	},
});

const listItemStyles = css({
	display: 'block',
	marginBlockEnd: token('space.050'),
	marginBlockStart: token('space.050'),
	marginInlineEnd: token('space.050'),
	marginInlineStart: token('space.050'),
	paddingBlockEnd: token('space.0'),
	paddingBlockStart: token('space.0'),
	paddingInlineEnd: token('space.0'),
	paddingInlineStart: token('space.0'),
});

export default MotionFadeInGridOfElementsExample;
