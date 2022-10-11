import React, { useState } from 'react';

import CodeBlock from '@atlaskit/code/block';
import {
  UNSAFE_Box as Box,
  UNSAFE_Stack as Stack,
  UNSAFE_Text as Text,
} from '@atlaskit/ds-explorations';
import Range from '@atlaskit/range';

import SectionMessage, { SectionMessageAction } from '../src';

const Example = () => {
  const [width, setWidth] = useState(800);

  return (
    <Stack gap="sp-0">
      <Text>SectionMessage expands to fill the space available to it.</Text>
      <Range min={100} max={800} onChange={setWidth} step={1} value={width} />
      <Box UNSAFE_style={{ maxWidth: `${width}px` }}>
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
          <Text>
            You will rejoice to hear that no disaster has accompanied the
            commencement of an enterprise which you have regarded with such evil
            forebodings. I arrived here yesterday, and my first task is to
            assure my dear sister of my welfare and increasing confidence in the
            success of my undertaking.
          </Text>

          <CodeBlock
            language="javascript"
            text="const CODE_BLOCK_FULL_PARENT_WIDTH = true;"
            showLineNumbers
          />
        </SectionMessage>
      </Box>
    </Stack>
  );
};

export default Example;
