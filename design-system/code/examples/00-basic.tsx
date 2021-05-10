import React from 'react';

import { Code, CodeBlock } from '../src';

const exampleCodeBlock = `// Longer snippets usually require <CodeBlock/>
// CodeBlock supports line numbers syntax highlighting and accessible colors.
// Useful for providing examples, code samples.
class HelloMessage extends React.Component {
  render() {
    return (
      <div>
        Hello {this.props.name}
      </div>
    );
  }
}

// line 15 is highlighted
ReactDOM.render(
  <HelloMessage name="Taylor" />,
  mountNode
);`;

export default function Component() {
  return (
    <div>
      <p>
        Highlighting a short code snippet inline. Use <Code>{`<Code />`}</Code>.
      </p>
      <br />
      <CodeBlock highlight="15" language="jsx" text={exampleCodeBlock} />
    </div>
  );
}
