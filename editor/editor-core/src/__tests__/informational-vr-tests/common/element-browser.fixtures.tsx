import React from 'react';

import { Editor } from '../../../index';

export function EditorWithElementBrowser(): React.JSX.Element {
	return (
		<Editor
			appearance="full-page"
			allowExpand={true}
			allowStatus={true}
			allowFindReplace={true}
			allowLayouts={true}
			allowTasksAndDecisions={true}
			codeBlock={{ allowCopyToClipboard: true }}
			allowRule={true}
			allowPanel={true}
			allowHelpDialog={true}
			allowTables={true}
			elementBrowser={{
				showModal: true,
				replacePlusMenu: true,
				helpUrl: 'https://support.atlassian.com/confluence-cloud/docs/what-are-macros/',
			}}
			insertMenuItems={[]}
			allowFragmentMark={true}
		/>
	);
}
