import React from 'react';
import v1schema from '@atlaskit/adf-schema/json-schema/v1/full.json';

const jsonPretty = (obj: any) => JSON.stringify(obj, null, 2);

export default function Example() {
  return (
    <pre>
      <code className="json">{jsonPretty(v1schema)}</code>
    </pre>
  );
}
