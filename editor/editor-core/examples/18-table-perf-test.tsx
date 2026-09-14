import React, { useMemo } from 'react';

import { useExampleDocument } from '@atlaskit/editor-test-helpers/use-example-document';

import { default as FullPageExample } from './5-full-page';

const loadHugeTableDocument = () => import('../example-helpers/templates/huge-table.adf.json');

export default function Example(): React.JSX.Element {
	const defaultValue = useExampleDocument(loadHugeTableDocument);
	const editorProps = useMemo(() => {
		return { defaultValue };
	}, [defaultValue]);

	return <FullPageExample editorProps={editorProps} />;
}
