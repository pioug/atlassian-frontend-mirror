import React from 'react';

import Theme, { AtlaskitThemeProvider } from '@atlaskit/theme/components';

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
    <>
      <AtlaskitThemeProvider mode="dark">
        <CodeBlock language="jsx" text={exampleCodeBlock} />
      </AtlaskitThemeProvider>

      <AtlaskitThemeProvider mode="dark">
        <CodeBlock
          language="jsx"
          text={exampleCodeBlock}
          highlight="2,5-7,12-15"
        />
      </AtlaskitThemeProvider>
      <AtlaskitThemeProvider mode="light">
        <Theme.Provider
          value={() => ({
            mode: 'dark',
          })}
        >
          <CodeBlock
            language="jsx"
            text={exampleCodeBlock}
            highlight="2,
          5-7,12-15"
          />
        </Theme.Provider>
      </AtlaskitThemeProvider>
    </>
  );
}
