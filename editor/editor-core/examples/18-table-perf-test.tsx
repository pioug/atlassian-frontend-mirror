import React, { useMemo } from 'react';

import { useExampleDocument } from '@atlaskit/editor-test-helpers/use-example-document';

import { default as FullPageExample } from './5-full-page';

export default function Example() {
	const defaultValue = useExampleDocument('./adf/huge-table.adf.json');
	const editorProps = useMemo(() => {
		return { defaultValue };
	}, [defaultValue]);

	return <FullPageExample editorProps={editorProps} />;
}
