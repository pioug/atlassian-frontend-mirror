/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import Button from '@atlaskit/button/new';
import { cssMap, jsx } from '@atlaskit/css';
import { token } from '@atlaskit/tokens';
import Tooltip from '@atlaskit/tooltip';

const styles = cssMap({
	container: {
		maxWidth: '300px',
		display: 'flex',
		flexDirection: 'column',
		gap: token('space.200'),
		paddingBlockStart: token('space.200'),
		paddingInlineEnd: token('space.200'),
		paddingBlockEnd: token('space.200'),
		paddingInlineStart: token('space.200'),
	},
});

export default () => (
	<div css={styles.container}>
		<Tooltip content="Single key" shortcut={['[']}>
			{(tooltipProps) => <Button {...tooltipProps}>Short with single key</Button>}
		</Tooltip>
		<Tooltip content="Multiple keys" shortcut={['Cmd', 'Opt', 'V']}>
			{(tooltipProps) => <Button {...tooltipProps}>Short with multiple keys</Button>}
		</Tooltip>
		<Tooltip
			content="Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos. Lorem ipsum dolor sit amet consectetur adipisicing"
			shortcut={['Ctrl', 'Opt', 'Z']}
		>
			{(tooltipProps) => <Button {...tooltipProps}>Long content</Button>}
		</Tooltip>
	</div>
);
