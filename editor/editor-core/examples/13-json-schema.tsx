import React from 'react';
import { fullSchema } from '@atlaskit/adf-schema/json-schema';

const jsonPretty = (obj: any) => JSON.stringify(obj, null, 2);

export default function Example() {
  return (
    <pre>
      <code className="json">{jsonPretty(fullSchema)}</code>
    </pre>
  );
}
