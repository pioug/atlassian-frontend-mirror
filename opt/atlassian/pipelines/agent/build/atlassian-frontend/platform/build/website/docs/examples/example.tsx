/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { cssMap, jsx } from '@atlaskit/css';
import { token } from '@atlaskit/tokens';
import Lozenge from '@atlaskit/lozenge';
import Badge from '@atlaskit/badge';

import { Example } from '../src/example';

function ComponentExample() {
	return (
		<div>
			<Badge>{25}</Badge>
			<Lozenge appearance="new" isBold>
				Label
			</Lozenge>
		</div>
	);
}

const source = `import Badge from '@atlaskit/badge';
import Lozenge from '@atlaskit/lozenge';

function ComponentExample() {
	return (
		<div>
			<Badge>{25}</Badge>
			<Lozenge appearance="new" isBold>
				Label
			</Lozenge>
		</div>
	);
};`;

const wrapperStyles = cssMap({
	root: {
		width: '300px',
		paddingInlineStart: token('space.100'),
		paddingInlineEnd: token('space.100'),
		paddingBlockStart: token('space.100'),
		paddingBlockEnd: token('space.100'),
	},
});

export function DefaultExample() {
	return (
		<div css={wrapperStyles.root}>
			<Example
				Component={ComponentExample}
				language="tsx"
				source={source}
				title="example title"
				packageName="@atlaskit/somewhere"
				highlight="1"
			/>
		</div>
	);
}

export function DefaultOpenExample() {
	return (
		<div css={wrapperStyles.root}>
			<Example
				Component={ComponentExample}
				language="tsx"
				source={source}
				title="example title"
				packageName="@atlaskit/somewhere"
				highlight="1"
				isDefaultSourceVisible
			/>
		</div>
	);
}

export function SourceOnlyExample() {
	return (
		<div css={wrapperStyles.root}>
			<Example
				Component={ComponentExample}
				language="tsx"
				source={source}
				title="example title"
				packageName="@atlaskit/somewhere"
				highlight="1"
				appearance="source-only"
			/>
		</div>
	);
}

export function SourceOnlyOpenExample() {
	return (
		<div css={wrapperStyles.root}>
			<Example
				Component={ComponentExample}
				language="tsx"
				source={source}
				title="example title"
				packageName="@atlaskit/somewhere"
				highlight="1"
				appearance="source-only"
				isDefaultSourceVisible
			/>
		</div>
	);
}

export default DefaultExample;
