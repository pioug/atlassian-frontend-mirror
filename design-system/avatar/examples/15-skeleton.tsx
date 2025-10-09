/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { Skeleton } from '@atlaskit/avatar';
import { cssMap, jsx } from '@atlaskit/css';
import { Inline, Stack } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

import { Block } from '../examples-util/helpers';

const styles = cssMap({
	textColor: {
		color: token('color.text.accent.purple'),
	},
});

export default () => (
	<Stack space="space.200">
		<Block heading="Circle" testId="example-block">
			<Skeleton size="xxlarge" />
			<Skeleton size="xlarge" />
			<Skeleton size="large" />
			<Skeleton size="medium" />
			<Skeleton size="small" />
			<Skeleton size="xsmall" />
		</Block>
		<Block heading="Square" testId="example-block">
			<Skeleton appearance="square" size="xxlarge" />
			<Skeleton appearance="square" size="xlarge" />
			<Skeleton appearance="square" size="large" />
			<Skeleton appearance="square" size="medium" />
			<Skeleton appearance="square" size="small" />
			<Skeleton appearance="square" size="xsmall" />
		</Block>
		<Block heading="Hexagon" testId="example-block">
			<Skeleton appearance="hexagon" size="xxlarge" />
			<Skeleton appearance="hexagon" size="xlarge" />
			<Skeleton appearance="hexagon" size="large" />
			<Skeleton appearance="hexagon" size="medium" />
			<Skeleton appearance="hexagon" size="small" />
			<Skeleton appearance="hexagon" size="xsmall" />
		</Block>
		<Block heading="Coloured via inheritance" testId="example-block">
			<Inline space="space.150" xcss={styles.textColor} alignBlock="end">
				<Skeleton size="xxlarge" />
				<Skeleton size="xlarge" />
				<Skeleton size="large" />
				<Skeleton size="medium" />
				<Skeleton size="small" />
				<Skeleton size="xsmall" />
			</Inline>
		</Block>
		<Block heading="Coloured using props" testId="example-block">
			<Skeleton size="xxlarge" color={token('color.text.accent.orange')} />
			<Skeleton size="xlarge" color={token('color.text.accent.green')} />
			<Skeleton size="large" color={token('color.text.accent.blue')} />
			<Skeleton size="medium" color={token('color.text.accent.red')} />
			<Skeleton size="small" color={token('color.text.subtle')} />
			<Skeleton size="xsmall" color={token('color.text.accent.teal')} />
		</Block>
		<Block heading="With a strong weight" testId="example-block">
			<Skeleton size="xxlarge" color={token('color.text.accent.orange')} weight="strong" />
			<Skeleton size="xlarge" color={token('color.text.accent.green')} weight="strong" />
			<Skeleton size="large" color={token('color.text.accent.blue')} weight="strong" />
			<Skeleton size="medium" color={token('color.text.accent.red')} weight="strong" />
			<Skeleton size="small" color={token('color.text.subtle')} weight="strong" />
			<Skeleton size="xsmall" color={token('color.text.accent.teal')} weight="strong" />
		</Block>
	</Stack>
);
