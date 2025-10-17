/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import Button from '@atlaskit/button/new';
import { cssMap, jsx } from '@atlaskit/css';
import { token } from '@atlaskit/tokens';
import Tooltip from '@atlaskit/tooltip';

import { GlobalStyleSimulator } from './utils/global-style-simulator';

const styles = cssMap({
	container: {
		paddingBlockStart: token('space.200'),
		paddingInlineEnd: token('space.200'),
		paddingBlockEnd: token('space.200'),
		paddingInlineStart: token('space.200'),
	},
});

export default function KeyboardShortcutGlobalStylesExample(): JSX.Element {
	return (
		<div css={styles.container} id="global-style-simulator-container">
			<GlobalStyleSimulator />
			<Tooltip
				content="Ensures the keyboard shortcut defends against global kbd styles from apps"
				shortcut={['Cmd', 'Opt', 'V']}
			>
				{(tooltipProps) => <Button {...tooltipProps}>Hover over me</Button>}
			</Tooltip>
		</div>
	);
}
