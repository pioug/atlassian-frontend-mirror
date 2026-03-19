import React from 'react';

import { useExampleDocument } from '@atlaskit/editor-test-helpers/use-example-document';

import { default as FullPageExample } from './5-full-page';

// eslint-disable-next-line jsdoc/require-jsdoc
export default function Example(): React.JSX.Element {
	const exampleDocument = useExampleDocument();

	return FullPageExample({
		editorProps: {
			defaultValue: exampleDocument,
			disabled: true,
			allowTables: {
				allowColumnResizing: true,
				allowMergeCells: true,
				allowNumberColumn: true,
				allowBackgroundColor: true,
				allowHeaderRow: true,
				allowHeaderColumn: true,
				permittedLayouts: 'all',
			},
		},
	});
}
