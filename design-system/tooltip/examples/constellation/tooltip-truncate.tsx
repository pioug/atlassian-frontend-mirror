import React, { useState } from 'react';

import { Box, Inline } from '@atlaskit/primitives';
import { token } from '@atlaskit/tokens';

import Tooltip from '../../src';

// unique enough id
function getUEID() {
  return Math.random().toString(32).slice(2);
}

interface CheckboxProps {
  children: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const Checkbox = ({ children, onChange }: CheckboxProps) => {
  const id = getUEID();

  return (
    <label
      htmlFor={id}
      style={{
        display: 'inline-block',
        marginBottom: token('space.150', '12px'),
      }}
    >
      <input
        id={id}
        type="checkbox"
        style={{ marginRight: token('space.100', '8px') }}
        onChange={onChange}
      />
      {children}
    </label>
  );
};

const content =
  'The red panda (Ailurus fulgens), also called the lesser panda, the red bear-cat, and the red cat-bear, is a mammal native to the eastern Himalayas and southwestern China.';
const srcSmiling =
  'https://upload.wikimedia.org/wikipedia/commons/thumb/b/be/Red_Panda_in_a_Gingko_tree.jpg/220px-Red_Panda_in_a_Gingko_tree.jpg ';
const srcWalking =
  'https://upload.wikimedia.org/wikipedia/commons/thumb/5/50/RedPandaFullBody.JPG/440px-RedPandaFullBody.JPG';

const Image = () => {
  const [truncate, setTruncate] = useState(false);

  return (
    <Box>
      <Checkbox onChange={() => setTruncate(!truncate)}>Truncate text</Checkbox>
      <Inline>
        <Tooltip content={content} truncate={truncate}>
          {(tooltipProps) => (
            <img
              alt="Red panda - smiling"
              src={srcSmiling}
              style={{
                borderRadius: 4,
                marginTop: token('space.050', '4px'),
                marginRight: token('space.050', '4px'),
              }}
              width="220"
              {...tooltipProps}
            />
          )}
        </Tooltip>
        <Tooltip content="At the Cincinati Zoo" truncate={truncate}>
          {(tooltipProps) => (
            <img
              alt="Red panda - walking"
              src={srcWalking}
              style={{ borderRadius: 4, marginTop: token('space.050', '4px') }}
              width="220"
              {...tooltipProps}
            />
          )}
        </Tooltip>
      </Inline>
    </Box>
  );
};

export default Image;
