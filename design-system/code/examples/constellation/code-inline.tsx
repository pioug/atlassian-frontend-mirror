import React from 'react';

import { AkCode } from '../../src';

export default function CodeDefaultExample() {
  return (
    <p>
      To start creating a changeset, run
      <AkCode language="text" text="bolt changeset" />. Then you will be
      prompted to select packages for release.
    </p>
  );
}
