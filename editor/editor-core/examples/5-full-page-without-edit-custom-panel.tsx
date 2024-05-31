import React from 'react';

import { exampleDocument } from '../example-helpers/example-doc-with-custom-panels';

import { default as FullPageExample } from './5-full-page';

const editorProps = {
	defaultValue: exampleDocument,
	allowPanel: {
		allowCustomPanel: true,
		allowCustomPanelEdit: false,
	},
};

export default function Example() {
	return <FullPageExample editorProps={editorProps} />;
}
