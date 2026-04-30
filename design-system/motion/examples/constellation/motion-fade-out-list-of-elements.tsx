/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useState } from 'react';

import { jsx } from '@compiled/react';

import Button from '@atlaskit/button/new';
import { cssMap } from '@atlaskit/css';
import {
	BitbucketIcon,
	ConfluenceIcon,
	JiraServiceManagementIcon,
	JiraSoftwareIcon,
	OpsgenieIcon,
	StatuspageIcon,
} from '@atlaskit/logo';
import { ExitingPersistence, Motion } from '@atlaskit/motion';
import { Inline, Stack, Text } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

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

const MotionFadeOutListOfElementsExample = (): JSX.Element => {
	const [items, setItems] = useState(logos);

	return (
		<Stack space="space.200">
			<Inline space="space.100">
				<Button onClick={() => setItems((list) => randRemove(list))}>Random remove</Button>
				<Button onClick={() => setItems(logos)}>Reset</Button>
			</Inline>
			<Stack space="space.100" xcss={styles.list}>
				<ExitingPersistence appear exitThenEnter>
					{items.map((logo) => (
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
				</ExitingPersistence>
			</Stack>
		</Stack>
	);
};

const logos = [
	[<BitbucketIcon size="small" />, 'Bitbucket'],
	[<ConfluenceIcon size="small" />, 'Confluence'],
	[<JiraServiceManagementIcon size="small" />, 'Jira Service Management'],
	[<JiraSoftwareIcon size="small" />, 'Jira Software'],
	[<OpsgenieIcon size="small" />, 'Opsgenie'],
	[<StatuspageIcon size="small" />, 'Statuspage'],
];

const randRemove = <T extends Array<TItem>, TItem>(arr: T) => {
	if (arr.length === 0) return arr;

	const newArr = arr.concat([]);
	newArr.splice(Date.now() % newArr.length, 1);
	return newArr;
};

export default MotionFadeOutListOfElementsExample;
