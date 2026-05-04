import React, { useState } from 'react';

import { cssMap } from '@atlaskit/css';
import { Motion } from '@atlaskit/motion';
import { useResizing } from '@atlaskit/motion/resizing';
import { token } from '@atlaskit/tokens';

const styles = cssMap({
	entering: {
		animationName: token('motion.keyframe.fade.in'),
		animationDuration: token('motion.duration.medium'),
		animationTimingFunction: token('motion.easing.out.practical'),
	},
});

export default function ResizingExample(): JSX.Element {
	const [items, setItems] = useState(['Item A', 'Item B']);
	const resizingProps = useResizing({
		dimension: 'height',
		duration: token('motion.duration.medium'),
		easing: token('motion.easing.inout.bold'),
	});
	return (
		<div {...resizingProps}>
			{items.map((item) => (
				<Motion key={item} enteringAnimationXcss={styles.entering}>
					<div>{item}</div>
				</Motion>
			))}
			<button type="button" onClick={() => setItems((prev) => [...prev, `Item ${String.fromCharCode(65 + prev.length)}`])}>
				Add item
			</button>
		</div>
	);
}
