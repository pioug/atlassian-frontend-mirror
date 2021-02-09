import React from 'react';

import { CodeBlock } from '../src';

const exampleCodeBlock = `import QtQuick 1.0
Rectangle {}`;

export default function Component() {
  return (
    <div>
      <h2>QML</h2>
      <CodeBlock language="qml" text={exampleCodeBlock} />
    </div>
  );
}
