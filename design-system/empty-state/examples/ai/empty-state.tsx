import React from 'react';

import EmptyState from '@atlaskit/empty-state';

const Examples = (): React.JSX.Element => (
	<>
		<EmptyState header="No items" description="Add items to get started" />
		<EmptyState
			header="No search results"
			description="Try adjusting your search criteria or browse all items."
		/>
		<EmptyState
			header="Welcome to your dashboard"
			description="Create your first project to get started with the platform."
		/>
	</>
);
export default Examples;
