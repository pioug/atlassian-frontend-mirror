import React from 'react';

import { Code } from '../../src';

export default function CodeDefaultExample() {
  return (
    <p>
      To start creating a changeset, run
      <Code language="text" text="bolt changeset" />. Then you will be prompted
      to select packages for release.
    </p>
  );
}
