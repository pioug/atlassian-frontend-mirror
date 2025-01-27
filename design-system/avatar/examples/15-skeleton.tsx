import React from 'react';

import { Skeleton } from '@atlaskit/avatar';
import { Inline, Stack, xcss } from '@atlaskit/primitives';
import { token } from '@atlaskit/tokens';

import { Block } from '../examples-util/helpers';

const customTextColorStyle = xcss({
	color: 'color.text.accent.purple',
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
		<Block heading="Coloured via inheritance" testId="example-block">
			<Inline space="space.150" xcss={customTextColorStyle} alignBlock="end">
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
