import React from 'react';

import InlineEdit from '@atlaskit/inline-edit';

const Example = (): React.JSX.Element => (
	<InlineEdit
		onConfirm={() => {}}
		onCancel={() => {}}
		defaultValue="Editable text"
		editView={() => <div>Edit view</div>}
		readView={() => <div>Read view</div>}
	/>
);
export default Example;
