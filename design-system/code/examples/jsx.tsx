import React from 'react';

import { CodeBlock } from '../src';

let exampleCodeBlock = `/** @jsx jsx */
import React from "react";
import ReactDOM from "react-dom";
import styled from "@emotion/styled";
import { jsx } from "@emotion/react";
import { N800 } from "@atlaskit/theme/colors";

`;
// string concatination needed due to use of template literals
exampleCodeBlock += '// TODO refactor\n';
exampleCodeBlock += 'const Content = styled.div`\n';
exampleCodeBlock +=
  // eslint-disable-next-line no-template-curly-in-string
  '  color: ${N800};\n';
// eslint-disable-next-line no-template-curly-in-string
exampleCodeBlock += '  margin-top: 8px !important;\n';
exampleCodeBlock += '`;\n';
exampleCodeBlock += `
class HelloMessage extends React.Component {
  render() {
    return (
      <Content css={{ background: "green" }}>Hello {this.props.name}</Content>
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
