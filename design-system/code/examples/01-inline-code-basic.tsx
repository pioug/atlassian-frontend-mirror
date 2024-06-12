/** @jsx jsx */
import { css, jsx } from '@emotion/react';

import Button from '@atlaskit/button/new';
import { token } from '@atlaskit/tokens';

import { Code } from '../src';

const jsCode = `const map = new Map({ key: 'value' })`;
const adg4 = `ADG 4.0`;

const containerStyles = css({
	display: 'grid',
	maxWidth: 800,
	margin: token('space.100', '8px'),
	alignItems: 'baseline',
	gap: token('space.100', '8px'),
	gridTemplateColumns: '100px 1fr',
});

const noMarginTopStyles = css({
	marginBlockStart: token('space.0', '0px'),
});

export default function Component() {
	return (
		<div id="inline-examples" css={containerStyles}>
			<p>h1 w/ code</p>
			<h1 css={noMarginTopStyles}>
				Code in a heading <Code testId="code-h1">{adg4}</Code>
			</h1>
			<p>h2 w/ code</p>
			<h2 css={noMarginTopStyles}>
				Code in a heading <Code testId="code-h2">{adg4}</Code>
			</h2>
			<p>h3 w/ code</p>
			<h3 css={noMarginTopStyles}>
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
