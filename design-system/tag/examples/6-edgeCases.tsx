import React from 'react';

import Tag from '../src/tag/removable-tag';

export default () => (
  <div>
    <p>edge case: a simple tag (should warn that no text was given in dev)</p>
    <Tag text="example" isRemovable={false} />

    <p>
      edge case: a removable tag (should warn that no text was given in dev)
    </p>
    <Tag text="example" removeButtonLabel="Remove me" isRemovable />

    <p>edge case: special characters (must not alert)</p>
    <Tag text="<script>alert('must not alert');</script>" isRemovable={false} />
  </div>
);
