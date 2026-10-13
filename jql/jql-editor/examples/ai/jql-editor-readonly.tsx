import React from 'react';

import { IntlProvider } from 'react-intl';

import { JQLEditorReadOnly } from '@atlaskit/jql-editor/jql-editor-read-only';

export default function JqlEditorReadOnlyExample(): React.JSX.Element {
	return (
		<IntlProvider locale="en">
			<section aria-labelledby="query-loading-heading">
				<h2 id="query-loading-heading">Loading issue search</h2>
				<p>This read-only query is a temporary layout while the full editor loads.</p>
				<JQLEditorReadOnly query={'project = PAY AND status = Open'} />
			</section>
		</IntlProvider>
	);
}
