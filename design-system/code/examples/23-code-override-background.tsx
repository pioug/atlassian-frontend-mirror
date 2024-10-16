/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { css, jsx } from '@compiled/react';

import { Text } from '@atlaskit/primitives';
import { token } from '@atlaskit/tokens';

import { Code, CodeBlock } from '../src';

const backgroundColorOverride = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'--ds--code--bg-color': token('color.background.warning.bold'),
	'--ds--code--line-number-bg-color': token('color.background.danger.bold'),
});

const exampleCodeBlock = `// React Component
class HelloMessage extends React.Component {
  render() {
    return (
      <div>
        Hello {this.props.name}
      </div>
    );
  }
}

ReactDOM.render(
  <HelloMessage name="Taylor" />,
  mountNode
);`;

export default function Component() {
	return (
		<div css={backgroundColorOverride}>
			<Text as="p">
				Overriding background colors works for both <Code>{`<Code />`}</Code> and{' '}
				<Code>{`<CodeBlock />`}</Code> as shown below.
			</Text>
			<br />
			<CodeBlock text={exampleCodeBlock} />
		</div>
	);
}
