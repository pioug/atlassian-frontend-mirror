import React from 'react';

import { CodeBlock } from '../src';

const exampleCodeBlock = `// React Component.  Curabitur placerat luctus massa, nec pharetra sapien condimentum a. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec bibendum fringilla orci eu tempor. Praesent et felis aliquam, pellentesque velit id, bibendum lorem. Fusce vestibulum eros iaculis urna volutpat sodales. Mauris varius interdum condimentum. Cras eu consequat nunc. Aenean nulla risus, auctor ac sagittis sit amet, elementum vel ipsum.
class HelloMessage extends React.Component {
  render() {
    return (
      <div>
        Hello {this.props.name}. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque laoreet bibendum mi non consectetur.
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
      <h2>Highlighting specific lines with long line wrapping </h2>
      <CodeBlock
        testId="highlight-long-lines"
        language="jsx"
        text={exampleCodeBlock}
        highlight="1,5-7"
        shouldWrapLongLines
      />
    </div>
  );
}
