import React from 'react';

import { AkCodeBlock } from '../../src';

const exampleCodeBlock = `
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

export default function CodeBlockLineHighlightExample() {
  return (
    <AkCodeBlock
      language="javascript"
      text={exampleCodeBlock}
      highlight="2,5-7"
    />
  );
}
