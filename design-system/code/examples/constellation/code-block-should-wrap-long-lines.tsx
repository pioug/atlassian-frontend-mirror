import React, { useState } from 'react';

import { Label } from '@atlaskit/form';
import Toggle from '@atlaskit/toggle';

import { CodeBlock } from '../../src';

const exampleCodeBlock = `import Message from '../../../src/packages/components/example-of-a-really-long-import-path/message'

// This is an example of a comment that is going to create a long line of code, where you may want to use the \`shouldWrapLongLines\` prop. When this prop is set to false, the CodeBlock container will scroll horizontally. When it is set to true, the CodeBlock content will wrap to the next line. As you can see from this line, the 'highlight' and 'shouldWrapLongLines' props work well in tandem.

class ExtremelyLongComponentNameThatMightNormallyForceCodeBlockToScrollHorizontally extends React.Component {
  render() {
    return (
      <Message>
        Hello world
      </Message>
    );
  }
}

ReactDOM.render(
  <ExtremelyLongComponentNameThatMightNormallyForceCodeBlockToScrollHorizontally />,
  mountNode
);`;

const CodeBlockShouldWrapLongLinesExample = () => {
  const [lineWrapState, setLineWrapState] = useState(true);
  return (
    <>
      <div
        style={{
          paddingBottom: '24px',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Label htmlFor="toggle">Wrap long lines</Label>
        <Toggle
          isChecked={lineWrapState}
          onChange={() => setLineWrapState(!lineWrapState)}
          size="large"
          id="toggle"
        />
      </div>
      <CodeBlock
        language="jsx"
        text={exampleCodeBlock}
        shouldWrapLongLines={lineWrapState}
        highlight="3"
      />
    </>
  );
};

export default CodeBlockShouldWrapLongLinesExample;
