import React from 'react';

import { fullSchema } from '@atlaskit/adf-schema/json-schema';

const jsonPretty = (obj: any) => JSON.stringify(obj, null, 2);

export default function Example() {
	return (
		<pre>
			{/* eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766 */}
			<code className="json">{jsonPretty(fullSchema)}</code>
		</pre>
	);
}
