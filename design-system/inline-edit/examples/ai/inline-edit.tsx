import React from 'react';

import InlineEdit from '@atlaskit/inline-edit';

export default [
	<InlineEdit
		onConfirm={() => {}}
		onCancel={() => {}}
		defaultValue="Editable text"
		editView={() => <div>Edit view</div>}
		readView={() => <div>Read view</div>}
	/>,
];
