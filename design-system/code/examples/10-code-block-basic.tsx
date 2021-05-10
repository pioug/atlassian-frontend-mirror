import React from 'react';

import { CodeBlock } from '../src';

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
    <div>
      <h2>Showing code without line numbers</h2>
      <CodeBlock
        language="jsx"
        text={exampleCodeBlock}
        showLineNumbers={false}
      />

      <h2>Showing code with line numbers</h2>
      <CodeBlock language="jsx" text={exampleCodeBlock} />

      <h2>Highlighting specific lines</h2>
      <CodeBlock
        language="jsx"
        text={exampleCodeBlock}
        highlight="2,5-7,12-15"
      />
    </div>
  );
}
