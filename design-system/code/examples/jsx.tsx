import React from 'react';

import { CodeBlock } from '@atlaskit/code';

const exampleCodeBlock = `/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React from 'react';
import ReactDOM from 'react-dom';
import { cssMap, jsx } from '@compiled/react';
import { token } from '@atlaskit/tokens';

const styles = cssMap({
	root: {
	  color: token('color.text'),
  	marginTop: '8px !important',
		backgroundColor: token('color.background.accent.green.subtle'),
	}
});

class HelloMessage extends React.Component {
  render() {
    return (
      <div css={styles.root}>Hello {this.props.name}</div>
    );
  }
}

ReactDOM.render(<HelloMessage name="Taylor" />, document.body);`;

export default function Component() {
	return (
		<div>
			<h2>JSX</h2>
			<CodeBlock language="jsx" text={exampleCodeBlock} />
		</div>
	);
}
