import React from 'react';

import { exampleDocument } from '../example-helpers/example-doc-with-custom-panels';

import { default as FullPageExample } from './5-full-page';
export default class ExampleEditor extends React.Component {
	render() {
		return (
			<FullPageExample
				editorProps={{
					defaultValue: exampleDocument,
					allowHelpDialog: true,
					allowPanel: {
						allowCustomPanel: true,
						allowCustomPanelEdit: true,
					},
				}}
			/>
		);
	}
}
