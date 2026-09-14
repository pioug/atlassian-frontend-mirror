import React from 'react';

import CodeBlock from '@atlaskit/code/code-block';

// brings in prism styles
// eslint-disable-next-line @atlaskit/ui-styling-standard/no-global-styles -- Ignored via go/DSP-18766
import 'prismjs/themes/prism-tomorrow.css';

const exampleCodeBlock = `/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React from 'react';
import { createRoot } from 'react-dom/client';
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

const root = createRoot(document.body);
root.render(<HelloMessage name="Taylor" />);`;

export default function Component(): React.JSX.Element {
	return (
		<div>
			<h2>JSX</h2>
			<CodeBlock language="jsx" text={exampleCodeBlock} />
		</div>
	);
}
