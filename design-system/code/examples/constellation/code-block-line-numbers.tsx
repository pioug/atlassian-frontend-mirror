import React from 'react';

import { AkCodeBlock } from '../../src';

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
);
`;

export default function CodeBlockLineNumbersExample() {
  return <AkCodeBlock language="javascript" text={exampleCodeBlock} />;
}
