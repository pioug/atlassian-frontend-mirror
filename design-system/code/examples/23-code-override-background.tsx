/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { css, jsx } from '@compiled/react';

import { Code, CodeBlock } from '@atlaskit/code';
import { Text } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

const backgroundColorOverride = css({
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

export default function Component(): JSX.Element {
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
