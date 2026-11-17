/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useState } from 'react';

import { cssMap, jsx } from '@compiled/react';

import Button from '@atlaskit/button/default/button';
import { token } from '@atlaskit/tokens';

const styles = cssMap({
	content: {
		paddingBlock: token('space.300'),
		'@media (prefers-reduced-motion: no-preference)': {
			animation: token('motion.panel.content.open'),
		},
	},
});

export default function PanelContentMotionExample(): JSX.Element {
	const [iteration, setIteration] = useState(0);
	return (
		<div>
			<Button onClick={() => setIteration(iteration + 1)}>Replay opening content fade</Button>
			<div key={iteration} css={styles.content}>
				Opening content waits 100ms, then fades in over 150ms using ExpoOut. Keep this animation
				attached after the panel’s 200ms slide finishes. Content replacement uses
				motion.panel.content.enter without the opening delay.
			</div>
		</div>
	);
}
