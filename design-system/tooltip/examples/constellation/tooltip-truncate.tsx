import React, { useState } from 'react';

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
    <label htmlFor={id} style={{ display: 'inline-block', marginBottom: 10 }}>
      <input
        id={id}
        type="checkbox"
        style={{ marginRight: 8 }}
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
    <div>
      <Checkbox onChange={() => setTruncate(!truncate)}>Truncate text</Checkbox>
      <div style={{ display: 'flex' }}>
        <Tooltip content={content} truncate={truncate}>
          <img
            alt="Red panda - smiling"
            src={srcSmiling}
            style={{ borderRadius: 4, marginTop: 4, marginRight: 4 }}
            width="220"
          />
        </Tooltip>
        <Tooltip content="At the Cincinati Zoo" truncate={truncate}>
          <img
            alt="Red panda - walking"
            src={srcWalking}
            style={{ borderRadius: 4, marginTop: 4 }}
            width="220"
          />
        </Tooltip>
      </div>
    </div>
  );
};

export default Image;
