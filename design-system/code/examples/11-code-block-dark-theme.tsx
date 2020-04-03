import React from 'react';
import { AtlaskitThemeProvider } from '@atlaskit/theme';
import { AkCodeBlock } from '../src';

const exampleCodeBlock = `  // React component
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

export default function Component() {
  return (
    <>
      <AtlaskitThemeProvider mode="dark">
        <AkCodeBlock language="java" text={exampleCodeBlock} />
      </AtlaskitThemeProvider>

      <AtlaskitThemeProvider mode="dark">
        <AkCodeBlock
          language="java"
          text={exampleCodeBlock}
          highlight="2,5-7,12-15"
        />
      </AtlaskitThemeProvider>
    </>
  );
}
