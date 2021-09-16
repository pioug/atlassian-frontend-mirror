/* eslint-disable @atlaskit/design-system/ensure-design-token-usage */
// eslint-disable-next-line @repo/internal/fs/filename-pattern-match
import React, { FC, useState } from 'react';

import { Note } from '../examples-util/helpers';
import { Presence } from '../src';

const PresenceWidthExample: FC = () => {
  const [width, setWidth] = useState(60);

  return (
    <div>
      <Note>
        <p>
          By default presences will <strong>stretch</strong> to fill their
          parents. Try resizing the wrapping div below to see this in action.
        </p>
        <p>
          Therefore it is <strong>recommended to always</strong> have a wrapping
          div around presences when consuming them separately to Avatars.
        </p>
      </Note>
      <input
        min="10"
        max="130"
        onChange={(e) => setWidth(parseInt(e.target.value, 10))}
        step="10"
        title="Width"
        type="range"
        value={width}
      />
      <div style={{ maxWidth: width, border: '1px dotted blue' }}>
        <Presence presence="busy" />
      </div>
    </div>
  );
};

export default PresenceWidthExample;
