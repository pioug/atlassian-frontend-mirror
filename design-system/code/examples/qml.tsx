import React from 'react';

import { CodeBlock } from '@atlaskit/code';

const exampleCodeBlock = `import QtQuick 1.0
Rectangle {}`;

export default function Component(): React.JSX.Element {
	return (
		<div>
			<h2>QML</h2>
			<CodeBlock language="qml" text={exampleCodeBlock} />
		</div>
	);
}
