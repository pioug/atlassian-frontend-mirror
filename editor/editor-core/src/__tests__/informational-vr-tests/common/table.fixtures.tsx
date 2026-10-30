import React from 'react';

import { Editor } from '../../../index';
import defaultTableAdf from '../../__fixtures__/default-table.adf.json';
import nestedTableAdf from '../../__fixtures__/nested-table-inside-columns.adf.json';

// eslint-disable-next-line jsdoc/require-jsdoc
export function EditorWithTable(): React.JSX.Element {
	return (
		<Editor
			appearance="full-page"
			allowBreakout
			allowTables={{ advanced: true }}
			defaultValue={defaultTableAdf}
		/>
	);
}

// eslint-disable-next-line jsdoc/require-jsdoc
export function EditorWithNestedTable(): React.JSX.Element {
	return (
		<Editor
			appearance="full-page"
			allowBreakout
			allowLayouts
			allowTables={{ advanced: true }}
			defaultValue={nestedTableAdf}
		/>
	);
}
