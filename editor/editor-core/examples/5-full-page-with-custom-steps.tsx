import React from 'react';

import { default as FullPageExample } from './5-full-page';

export default function Example(): React.JSX.Element {
	return (
		<FullPageExample
			editorProps={{
				allowTables: {
					advanced: true,
					allowColumnSorting: true,
					allowAddColumnWithCustomStep: true,
				},
			}}
		/>
	);
}
