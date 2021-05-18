import React, { useState } from 'react';

import CodeBlock from '@atlaskit/code/block';
import Range from '@atlaskit/range';

import SectionMessage, { SectionMessageAction } from '../src';

const Example = () => {
  const [width, setWidth] = useState(800);

  return (
    <div>
      <p>SectionMessage expands to fill the space available to it.</p>
      <Range min={100} max={800} onChange={setWidth} step={1} value={width} />
      <div style={{ maxWidth: `${width}px` }}>
        <SectionMessage
          title="The Modern Prometheus"
          actions={[
            <SectionMessageAction href="https://en.wikipedia.org/wiki/Mary_Shelley">
              Mary
            </SectionMessageAction>,
            <SectionMessageAction href="https://en.wikipedia.org/wiki/Villa_Diodati">
              Villa Diodatti
            </SectionMessageAction>,
          ]}
        >
          <p>
            You will rejoice to hear that no disaster has accompanied the
            commencement of an enterprise which you have regarded with such evil
            forebodings. I arrived here yesterday, and my first task is to
            assure my dear sister of my welfare and increasing confidence in the
            success of my undertaking.
          </p>

          <CodeBlock
            language="javascript"
            text="const CODE_BLOCK_FULL_PARENT_WIDTH = true;"
            showLineNumbers
          />
        </SectionMessage>
      </div>
    </div>
  );
};

export default Example;
