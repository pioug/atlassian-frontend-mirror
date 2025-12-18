import React from 'react';

import LikeIcon from '@atlaskit/icon/core/thumbs-up';

import { ActionName, TitleBlock } from '../../src';

import ExampleContainer from './example-container';

export default (): React.JSX.Element => (
	<ExampleContainer>
		<TitleBlock
			showActionOnHover={true}
			actions={[
				{
					name: ActionName.CustomAction,
					icon: <LikeIcon color="currentColor" spacing="spacious" label="Like" />,
					content: 'Like',
					onClick: () => console.log('Like clicked!'),
				},
				{
					name: ActionName.EditAction,
					onClick: () => console.log('Edit clicked!'),
				},
				{
					name: ActionName.DeleteAction,
					onClick: () => console.log('Delete clicked!'),
				},
			]}
		/>
	</ExampleContainer>
);
