import React from 'react';

import { cssMap } from '@atlaskit/css';
import { Motion, StaggeredEntrance } from '@atlaskit/motion';
import { token } from '@atlaskit/tokens';

const styles = cssMap({
	entering: {
		animationName: `${token('motion.keyframe.scale.in.medium')}, ${token('motion.keyframe.fade.in')}`,
		animationDuration: token('motion.duration.xlong'),
		animationTimingFunction: token('motion.easing.out.practical'),
	},
});

const items = ['Item A', 'Item B', 'Item C'];

export default function StaggeredEntranceExample(): JSX.Element {
	return (
		<StaggeredEntrance columns={1}>
			{items.map((item) => (
				<Motion key={item} enteringAnimationXcss={styles.entering}>
					<div>{item}</div>
				</Motion>
			))}
		</StaggeredEntrance>
	);
}
