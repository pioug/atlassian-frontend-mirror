/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { cssMap, jsx } from '@compiled/react';

import Button from '@atlaskit/button/new';
import { Code } from '@atlaskit/code';
import { token } from '@atlaskit/tokens';

const jsCode = `const map = new Map({ key: 'value' })`;
const adg4 = `ADG 4.0`;

const containerStyles = cssMap({
	root: {
		display: 'grid',
		maxWidth: 800,
		alignItems: 'baseline',
		gap: token('space.100'),
		gridTemplateColumns: '100px 1fr',
		marginBlockEnd: token('space.100'),
		marginBlockStart: token('space.100'),
		marginInlineEnd: token('space.100'),
		marginInlineStart: token('space.100'),
	},
	noMarginTopStyles: {
		marginBlockStart: token('space.0'),
	},
});

export default function Component(): JSX.Element {
	return (
		<div id="inline-examples" css={containerStyles.root}>
			<p>h1 w/ code</p>
			<h1 css={containerStyles.noMarginTopStyles}>
				Code in a heading <Code testId="code-h1">{adg4}</Code>
			</h1>
			<p>h2 w/ code</p>
			<h2 css={containerStyles.noMarginTopStyles}>
				Code in a heading <Code testId="code-h2">{adg4}</Code>
			</h2>
			<p>h3 w/ code</p>
			<h3 css={containerStyles.noMarginTopStyles}>
				Code in a heading <Code testId="code-h3">{adg4}</Code>
			</h3>
			<p>p w/ code</p>
			<p>
				Lorem ipsum dolor sit amet consectetur adipisicing elit.{' '}
				<Code testId="code-p">{jsCode}</Code>
			</p>
			<p>very long code</p>
			<p>
				<Code testId="code-long">
					Lorem ipsum dolor sit amet consectetur adipisicing elit. Ullam totam architecto laudantium
					necessitatibus reiciendis. Vero eaque repellendus assumenda maxime nobis, earum nihil
					placeat facilis aliquid suscipit obcaecati. Quis, amet fuga?
				</Code>
			</p>
			<p>jsx child</p>
			<p>
				<Code testId="code-children">
					{jsCode} <Button appearance="primary">Hello</Button>
				</Code>
			</p>
		</div>
	);
}
