import React from 'react';
import { ActionName, TitleBlock } from '../../src';
import ExampleContainer from './example-container';
import LikeIcon from '@atlaskit/icon/core/migration/thumbs-up--like';

export default () => (
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
