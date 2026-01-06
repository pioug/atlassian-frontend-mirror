import React from 'react';

import Tag from '@atlaskit/tag';

const Examples = (): React.JSX.Element => (
	<>
		<Tag text="Basic tag" />
		<Tag text="Bug" color="red" />
		<Tag text="Removable tag" removeButtonLabel="Remove" />
	</>
);
export default Examples;
