import React from 'react';
import Tag from '../src';

export default () => (
  <div>
    <p>edge case: a simple tag (should warn that no text was given in dev)</p>
    <Tag text="example" />

    <p>
      edge case: a removable tag (should warn that no text was given in dev)
    </p>
    <Tag text="example" removeButtonText="Remove me" />

    <p>edge case: special characters (must not alert)</p>
    <Tag text="<script>alert('must not alert');</script>" />
  </div>
);
