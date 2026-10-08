import React from 'react';

import { IntlProvider } from 'react-intl';

import { cssMap } from '@atlaskit/css';
import { useAutocompleteProvider } from '@atlaskit/jql-editor-autocomplete-rest/use-autocomplete-provider';
import { Box } from '@atlaskit/primitives/compiled/box';
import { token } from '@atlaskit/tokens';

import { jqlFieldsMock, jqlFunctionsMock, jqlValuesMock } from '../../examples-utils/data';
import JQLEditor from '../../src/ui';
const styles = cssMap({
	subject: {
		width: '340px',
		display: 'block',
		alignItems: 'center',
		justifyContent: 'center',
		gap: token('space.200'),
	},
});
function QueryEditor() {
	const provider = useAutocompleteProvider(
		'preview',
		async () => ({ jqlFields: jqlFieldsMock, jqlFunctions: jqlFunctionsMock }),
		async () => ({ results: jqlValuesMock }),
	);
	return (
		<JQLEditor
			isCompact
			analyticsSource="preview"
			autocompleteProvider={provider}
			query="project = ATLAS"
			locale="en"
			onSearch={() => {}}
		/>
	);
}

export default function Preview(): React.JSX.Element {
	return (
		<IntlProvider locale="en">
			<Box testId="component-preview" xcss={styles.subject}>
				<QueryEditor />
			</Box>
		</IntlProvider>
	);
}
