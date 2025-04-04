import React from 'react';

import { CodeBlock } from '@atlaskit/code';

// brings in prism styles
// eslint-disable-next-line @atlaskit/ui-styling-standard/no-global-styles, @repo/internal/import/no-unresolved -- Ignored via go/DSP-18766
import '!style-loader!css-loader!prismjs/themes/prism-tomorrow.css';

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
