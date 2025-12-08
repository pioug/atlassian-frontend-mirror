import React from 'react';

import { exampleDocument } from '../example-helpers/example-doc-with-custom-panels';

import { default as FullPageExample } from './5-full-page';
// Ignored via go/ees005
// eslint-disable-next-line @repo/internal/react/no-class-components, react/prefer-stateless-function
export default class ExampleEditor extends React.Component {
	render(): React.JSX.Element {
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
