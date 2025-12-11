import React from 'react';

import { CodeBlock } from '@atlaskit/code';

const exampleCodeBlock = `SELECT
    id,
    first_name,
    last_name,
    email,
    created_at
FROM
    users
WHERE
    status = 'active'
ORDER BY
    created_at DESC
LIMIT 10;`;

export default function ExampleSQL(): React.JSX.Element {
	return (
		<div>
			<h2>SQL</h2>
			<CodeBlock language="sql" text={exampleCodeBlock} />
		</div>
	);
}
